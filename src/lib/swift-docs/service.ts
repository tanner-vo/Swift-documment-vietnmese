import { buildChapterDataUrl, buildChapterUrl, getChapterBySlug } from "./chapters";
import { getManualOverridesForChapter } from "@/lib/db/sqlite";
import { parseSwiftChapterDocJson, parseSwiftChapterHtml } from "./parse";
import { translateBlocks } from "./translate";
import { ChapterContent } from "./types";

export async function getChapterContent(slug: string): Promise<ChapterContent> {
  const chapter = getChapterBySlug(slug);
  if (!chapter) {
    throw new Error(`Không tìm thấy chapter: ${slug}`);
  }

  const sourceUrl = buildChapterUrl(slug);
  const dataUrl = buildChapterDataUrl(slug);

  let parsed = {
    title: chapter.title,
    blocks: [] as ChapterContent["blocks"],
  };

  const docResponse = await fetch(dataUrl, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (docResponse.ok) {
    const docJson = (await docResponse.json()) as unknown;
    parsed = parseSwiftChapterDocJson(docJson);
  }

  if (parsed.blocks.length === 0) {
    const htmlResponse = await fetch(sourceUrl, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!htmlResponse.ok) {
      throw new Error(`Không thể tải chapter từ nguồn: ${sourceUrl}`);
    }

    const html = await htmlResponse.text();
    parsed = parseSwiftChapterHtml(html);

    if (parsed.blocks.length === 0) {
      throw new Error(
        `Không trích xuất được nội dung chapter từ cả DocC JSON lẫn HTML: ${slug}`,
      );
    }
  }

  const translatedBlocks = await translateBlocks(parsed.blocks);
  const manualOverrides = getManualOverridesForChapter(slug);

  const mergedBlocks = translatedBlocks.map((block) => {
    const autoVi = block.vi;
    const manualVi = manualOverrides.get(block.id);

    if (manualVi && block.type !== "code") {
      return {
        ...block,
        autoVi,
        vi: manualVi,
        translationSource: "manual" as const,
      };
    }

    return {
      ...block,
      autoVi,
      translationSource: "auto" as const,
    };
  });

  const content: ChapterContent = {
    slug,
    sourceUrl,
    title: parsed.title,
    blocks: mergedBlocks,
  };

  return content;
}
