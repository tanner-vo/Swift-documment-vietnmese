import { getCachedTranslation, upsertCachedTranslation } from "@/lib/db/sqlite";
import { ContentBlock } from "./types";

const TRANSLATION_CACHE = new Map<string, string>();
const MAX_TRANSLATION_CHARS_PER_REQUEST = 1600;
const RETRY_ATTEMPTS = 4;
const RETRY_BASE_DELAY_MS = 300;

const GLOSSARY_TERMS = [
  "protocol",
  "closure",
  "guard",
  "actor",
  "optional",
  "nil",
  "async",
  "await",
  "throws",
  "rethrows",
  "defer",
  "switch",
  "enum",
  "struct",
  "class",
  "extension",
  "generic",
  "initializer",
  "deinitializer",
  "type inference",
  "type safety",
  "property wrapper",
  "result builder",
  "main actor",
  "actor isolation",
  "task",
  "task group",
  "sendable",
  "async let",
  "generic parameter",
  "associated type",
  "opaque type",
  "reference counting",
  "declaration",
  "expression",
  "statement",
  "subscript",
  "mutating",
  "nonmutating",
  "escaping",
  "nonescaping",
  "inout",
  "throws",
  "try",
  "catch",
];

function protectSegments(input: string): {
  protectedText: string;
  restores: Array<{ token: string; value: string }>;
} {
  const restores: Array<{ token: string; value: string }> = [];
  let index = 0;
  let output = input;

  const capture = (regex: RegExp) => {
    output = output.replace(regex, (value) => {
      const token = `⟪LOCK_${index}⟫`;
      restores.push({ token, value });
      index += 1;
      return token;
    });
  };

  capture(/https?:\/\/[^\s)\]]+/g);
  capture(/`[^`]+`/g);
  capture(/^\|.*\|$/gm);
  capture(/^\s*(?:•|\d+\.)\s+/gm);

  GLOSSARY_TERMS.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    capture(regex);
  });

  return {
    protectedText: output,
    restores,
  };
}

function restoreSegments(
  translatedText: string,
  restores: Array<{ token: string; value: string }>,
): string {
  let restored = translatedText;

  restores.forEach(({ token, value }) => {
    restored = restored.replaceAll(token, value);
  });

  return restored;
}

function shouldTranslate(block: ContentBlock): boolean {
  if (block.type === "code") {
    return false;
  }

  return Boolean(block.en.trim());
}

type RetryableError = Error & {
  retryable?: boolean;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function chunkLongText(input: string, maxChars: number): string[] {
  if (input.length <= maxChars) {
    return [input];
  }

  const chunks: string[] = [];
  let remaining = input.trim();

  while (remaining.length > maxChars) {
    let cut = remaining.lastIndexOf("\n\n", maxChars);

    if (cut < Math.floor(maxChars * 0.4)) {
      cut = remaining.lastIndexOf("\n", maxChars);
    }

    if (cut < Math.floor(maxChars * 0.4)) {
      cut = remaining.lastIndexOf(". ", maxChars);
      if (cut > 0) {
        cut += 1;
      }
    }

    if (cut < Math.floor(maxChars * 0.4)) {
      cut = remaining.lastIndexOf(" ", maxChars);
    }

    if (cut <= 0) {
      cut = maxChars;
    }

    const part = remaining.slice(0, cut).trim();
    if (part) {
      chunks.push(part);
    }

    remaining = remaining.slice(cut).trimStart();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

function extractGoogleTranslatedText(payload: unknown): string {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    throw new Error("Google translate payload không hợp lệ");
  }

  const sentenceTuples = payload[0] as unknown[];
  const translated = sentenceTuples
    .map((tuple) => {
      if (!Array.isArray(tuple)) {
        return "";
      }

      const first = tuple[0];
      return typeof first === "string" ? first : "";
    })
    .join("")
    .trim();

  if (!translated) {
    throw new Error("Không đọc được text dịch từ payload");
  }

  return translated;
}

async function translateViaGoogleEndpoint(input: string): Promise<string> {
  const endpoint = new URL("https://translate.googleapis.com/translate_a/single");
  endpoint.searchParams.set("client", "gtx");
  endpoint.searchParams.set("sl", "auto");
  endpoint.searchParams.set("tl", "vi");
  endpoint.searchParams.set("dt", "t");
  endpoint.searchParams.set("q", input);

  const response = await fetch(endpoint, {
    headers: {
      "User-Agent": "swift-docs-vn-companion/1.0",
      Accept: "application/json,text/plain,*/*",
    },
  });

  if (!response.ok) {
    const error: RetryableError = new Error(
      `Google translate endpoint lỗi: ${response.status}`,
    );
    error.retryable = isRetryableStatus(response.status);
    throw error;
  }

  const payload = (await response.json()) as unknown;
  return extractGoogleTranslatedText(payload);
}

async function translateViaGoogleWithRetry(input: string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await translateViaGoogleEndpoint(input);
    } catch (error) {
      lastError = error;
      const retryable =
        typeof error === "object" &&
        error !== null &&
        "retryable" in error &&
        Boolean((error as RetryableError).retryable);

      if (!retryable || attempt === RETRY_ATTEMPTS) {
        break;
      }

      const jitter = Math.floor(Math.random() * 120);
      const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1) + jitter;
      await sleep(delay);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Dịch tự động thất bại sau nhiều lần thử");
}

async function translateTextToVietnamese(input: string): Promise<string> {
  const normalized = input.trim();
  if (!normalized) {
    return input;
  }

  const inMemoryCached = TRANSLATION_CACHE.get(normalized);
  if (inMemoryCached) {
    return inMemoryCached;
  }

  const persistedCached = getCachedTranslation(normalized);
  if (persistedCached) {
    TRANSLATION_CACHE.set(normalized, persistedCached);
    return persistedCached;
  }

  const { protectedText, restores } = protectSegments(normalized);

  try {
    const chunks = chunkLongText(protectedText, MAX_TRANSLATION_CHARS_PER_REQUEST);
    const translatedChunks: string[] = [];

    for (const chunk of chunks) {
      const translatedChunk = await translateViaGoogleWithRetry(chunk);
      translatedChunks.push(translatedChunk);
    }

    const translatedText = translatedChunks.join("\n\n");
    const restored = restoreSegments(translatedText, restores);
    TRANSLATION_CACHE.set(normalized, restored);
    upsertCachedTranslation(normalized, restored);
    return restored;
  } catch {
    const fallback = `⚠️ Chưa dịch được tự động. Bạn vẫn có thể đối chiếu bản EN.\n\n${normalized}`;
    TRANSLATION_CACHE.set(normalized, fallback);
    upsertCachedTranslation(normalized, fallback);
    return fallback;
  }
}

export async function translateBlocks(blocks: ContentBlock[]): Promise<ContentBlock[]> {
  const translated = await Promise.all(
    blocks.map(async (block) => {
      if (!shouldTranslate(block)) {
        return block;
      }

      const vi = await translateTextToVietnamese(block.en);

      return {
        ...block,
        vi,
      };
    }),
  );

  return translated;
}
