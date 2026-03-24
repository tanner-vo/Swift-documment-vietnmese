import { Cheerio, load } from "cheerio";
import { AnyNode, Element } from "domhandler";
import { ContentBlock } from "./types";

const IGNORED_TEXTS = new Set([
  "Additional Links",
  "Skip Navigation",
  "Color scheme preference",
]);

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function formatListItems(items: string[], isOrdered: boolean): string {
  if (isOrdered) {
    return items.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
  }

  return items.map((item) => `• ${item}`).join("\n");
}

type DoccReference = {
  title?: string;
  url?: string;
  titleInlineContent?: unknown[];
};

type DoccReferences = Record<string, DoccReference>;

function buildReferenceMap(rawReferences: unknown): DoccReferences {
  if (!isRecord(rawReferences)) {
    return {};
  }

  return Object.entries(rawReferences).reduce<DoccReferences>((acc, [key, raw]) => {
    if (!isRecord(raw)) {
      return acc;
    }

    acc[key] = {
      title: asString(raw.title),
      url: asString(raw.url),
      titleInlineContent: asArray(raw.titleInlineContent),
    };

    return acc;
  }, {});
}

function inlineContentToText(inlineContent: unknown, references: DoccReferences): string {
  const nodes = asArray(inlineContent);
  const parts: string[] = [];

  nodes.forEach((node) => {
    if (!isRecord(node)) {
      return;
    }

    const type = asString(node.type);

    if (type === "text") {
      parts.push(asString(node.text));
      return;
    }

    if (type === "codeVoice") {
      const code = asString(node.code);
      if (code) {
        parts.push(`\`${code}\``);
      }
      return;
    }

    if (type === "reference") {
      const identifier = asString(node.identifier);
      const reference = references[identifier];

      if (reference?.titleInlineContent && reference.titleInlineContent.length > 0) {
        parts.push(inlineContentToText(reference.titleInlineContent, references));
        return;
      }

      if (reference?.title) {
        parts.push(reference.title);
        return;
      }

      if (reference?.url) {
        parts.push(reference.url);
      }

      return;
    }

    const nestedInline = asArray(node.inlineContent);
    if (nestedInline.length > 0) {
      parts.push(inlineContentToText(nestedInline, references));
    }
  });

  return normalizeWhitespace(parts.join(" "));
}

function contentNodeToText(node: unknown, references: DoccReferences): string {
  if (!isRecord(node)) {
    return "";
  }

  const type = asString(node.type);

  if (type === "paragraph") {
    return inlineContentToText(node.inlineContent, references);
  }

  if (type === "heading") {
    return normalizeWhitespace(asString(node.text));
  }

  if (type === "codeListing") {
    const codeLines = asArray(node.code)
      .map((line) => asString(line))
      .filter(Boolean);
    return codeLines.join("\n");
  }

  if (type === "unorderedList" || type === "orderedList") {
    const itemTexts = asArray(node.items)
      .map((item) => {
        if (!isRecord(item)) {
          return "";
        }

        const parts = asArray(item.content)
          .map((itemNode) => contentNodeToText(itemNode, references))
          .filter(Boolean);

        return normalizeWhitespace(parts.join(" "));
      })
      .filter(Boolean);

    return formatListItems(itemTexts, type === "orderedList");
  }

  if (type === "termList") {
    const termItems = asArray(node.items)
      .map((item) => {
        if (!isRecord(item)) {
          return "";
        }

        const term = inlineContentToText(isRecord(item.term) ? item.term.inlineContent : [], references);
        const definition = asArray(isRecord(item.definition) ? item.definition.content : [])
          .map((defNode) => contentNodeToText(defNode, references))
          .filter(Boolean)
          .join(" ");

        if (!term && !definition) {
          return "";
        }

        if (!definition) {
          return term;
        }

        if (!term) {
          return definition;
        }

        return `${term}: ${definition}`;
      })
      .filter(Boolean);

    return formatListItems(termItems, false);
  }

  if (type === "table") {
    const rows = asArray(node.rows)
      .map((row) =>
        asArray(row).map((cell) => {
          const cellText = asArray(cell)
            .map((cellNode) => contentNodeToText(cellNode, references))
            .filter(Boolean)
            .join(" ");

          return normalizeWhitespace(cellText).replace(/\|/g, "\\|");
        }),
      )
      .filter((row) => row.length > 0);

    if (rows.length === 0) {
      return "";
    }

    const maxCols = Math.max(...rows.map((row) => row.length));
    const normalizedRows = rows.map((row) => {
      const filled = [...row];
      while (filled.length < maxCols) {
        filled.push("");
      }
      return filled;
    });

    const header = normalizedRows[0];
    const divider = Array.from({ length: maxCols }, () => "---");
    const body = normalizedRows.slice(1);

    const lines = [
      `| ${header.join(" | ")} |`,
      `| ${divider.join(" | ")} |`,
      ...body.map((row) => `| ${row.join(" | ")} |`),
    ];

    return lines.join("\n");
  }

  if (type === "aside") {
    const asideName = normalizeWhitespace(asString(node.name));
    const content = asArray(node.content)
      .map((itemNode) => contentNodeToText(itemNode, references))
      .filter(Boolean)
      .join("\n\n");

    if (!content) {
      return "";
    }

    if (!asideName) {
      return content;
    }

    return `${asideName}: ${content}`;
  }

  return "";
}

function collectPrimaryContentNodes(rawSections: unknown): unknown[] {
  const sections = asArray(rawSections);
  const collected: unknown[] = [];

  sections.forEach((section) => {
    if (!isRecord(section)) {
      return;
    }

    const content = asArray(section.content);
    if (content.length > 0) {
      collected.push(...content);
    }

    const nestedSections = asArray(section.sections);
    if (nestedSections.length > 0) {
      collected.push(...collectPrimaryContentNodes(nestedSections));
    }
  });

  return collected;
}

export function parseSwiftChapterDocJson(docJson: unknown): {
  title: string;
  blocks: ContentBlock[];
} {
  const root = isRecord(docJson) ? docJson : {};
  const metadata = isRecord(root.metadata) ? root.metadata : {};
  const references = buildReferenceMap(root.references);

  const title = normalizeWhitespace(asString(metadata.title) || "Swift Chapter");
  const blocks: ContentBlock[] = [];
  let blockIndex = 0;

  const pushBlock = (block: Omit<ContentBlock, "id">) => {
    const text = normalizeWhitespace(block.en);
    if (shouldSkipText(text) && block.type !== "code") {
      return;
    }

    if (!block.en.trim()) {
      return;
    }

    blocks.push({
      id: `b-${blockIndex}`,
      ...block,
    });
    blockIndex += 1;
  };

  const abstractText = inlineContentToText(root.abstract, references);
  if (abstractText) {
    pushBlock({
      type: "paragraph",
      en: abstractText,
      vi: abstractText,
    });
  }

  const contentNodes = collectPrimaryContentNodes(root.primaryContentSections);

  contentNodes.forEach((node) => {
    if (!isRecord(node)) {
      return;
    }

    const type = asString(node.type);

    if (type === "heading") {
      const text = normalizeWhitespace(asString(node.text));
      if (!text) {
        return;
      }

      const levelValue = Number(node.level);
      const headingLevel = Number.isFinite(levelValue) ? levelValue : 2;

      pushBlock({
        type: "heading",
        en: text,
        vi: text,
        headingLevel,
      });
      return;
    }

    if (type === "paragraph") {
      const text = inlineContentToText(node.inlineContent, references);
      if (!text) {
        return;
      }

      pushBlock({
        type: "paragraph",
        en: text,
        vi: text,
      });
      return;
    }

    if (type === "codeListing") {
      const code = asArray(node.code)
        .map((line) => asString(line))
        .join("\n")
        .replace(/\s+$/g, "");

      if (!code.trim()) {
        return;
      }

      pushBlock({
        type: "code",
        en: code,
        vi: code,
      });
      return;
    }

    if (type === "unorderedList" || type === "orderedList") {
      const listItems = asArray(node.items)
        .map((item) => {
          if (!isRecord(item)) {
            return "";
          }

          const itemText = asArray(item.content)
            .map((itemNode) => contentNodeToText(itemNode, references))
            .filter(Boolean)
            .join(" ");

          return normalizeWhitespace(itemText);
        })
        .filter(Boolean);

      if (listItems.length === 0) {
        return;
      }

      const listText = formatListItems(listItems, type === "orderedList");
      pushBlock({
        type: "list",
        en: listText,
        vi: listText,
      });
      return;
    }

    if (type === "termList" || type === "table") {
      const listLikeText = contentNodeToText(node, references);
      if (!listLikeText) {
        return;
      }

      pushBlock({
        type: "list",
        en: listLikeText,
        vi: listLikeText,
      });
      return;
    }

    if (type === "aside") {
      const quoteText = contentNodeToText(node, references);
      if (!quoteText) {
        return;
      }

      pushBlock({
        type: "quote",
        en: quoteText,
        vi: quoteText,
      });
    }
  });

  return {
    title,
    blocks,
  };
}

function toInlineCodeAwareText($: ReturnType<typeof load>, el: Element): string {
  const parts: string[] = [];

  function walk(node: AnyNode) {
    const nodeType = node.type;

    if (nodeType === "text") {
      if ("data" in node && node.data) {
        parts.push(node.data);
      }
      return;
    }

    if (nodeType !== "tag") {
      return;
    }

    const parentName =
      node.parent && "name" in node.parent ? node.parent.name : undefined;

    if (node.name === "code" && parentName !== "pre") {
      const codeText = normalizeWhitespace($(node).text());
      if (codeText.length > 0) {
        parts.push(`\`${codeText}\``);
      }
      return;
    }

    node.children.forEach((child) => {
      if (child.type === "text") {
        if ("data" in child && child.data) {
          parts.push(child.data);
        }
        return;
      }

      if (child.type === "tag") {
        walk(child);
      }
    });
  }

  walk(el);

  return normalizeWhitespace(parts.join(" "));
}

function parseHeadingLevel(tagName: string): number | undefined {
  const maybeLevel = Number(tagName.replace("h", ""));
  if (Number.isNaN(maybeLevel)) {
    return undefined;
  }

  if (maybeLevel < 1 || maybeLevel > 6) {
    return undefined;
  }

  return maybeLevel;
}

function shouldSkipText(text: string): boolean {
  if (!text) {
    return true;
  }

  if (IGNORED_TEXTS.has(text)) {
    return true;
  }

  if (text.startsWith("Copyright ©")) {
    return true;
  }

  return false;
}

function elementToBlock(
  $: ReturnType<typeof load>,
  el: Element,
  index: number,
): ContentBlock | null {
  const tag = el.tagName.toLowerCase();

  if (tag === "pre") {
    const code = $(el).text().replace(/\s+$/g, "");

    if (!code.trim()) {
      return null;
    }

    return {
      id: `b-${index}`,
      type: "code",
      en: code,
      vi: code,
    };
  }

  if (tag === "ul" || tag === "ol") {
    const listItems = $(el)
      .find("li")
      .toArray()
      .map((item) => normalizeWhitespace(toInlineCodeAwareText($, item)))
      .filter(Boolean);

    if (listItems.length === 0) {
      return null;
    }

    const listText = listItems.map((item) => `• ${item}`).join("\n");
    return {
      id: `b-${index}`,
      type: "list",
      en: listText,
      vi: listText,
    };
  }

  if (tag === "blockquote") {
    const quoteText = normalizeWhitespace(toInlineCodeAwareText($, el));

    if (shouldSkipText(quoteText)) {
      return null;
    }

    return {
      id: `b-${index}`,
      type: "quote",
      en: quoteText,
      vi: quoteText,
    };
  }

  if (tag === "p" || tag.startsWith("h")) {
    const text = normalizeWhitespace(toInlineCodeAwareText($, el));

    if (shouldSkipText(text)) {
      return null;
    }

    return {
      id: `b-${index}`,
      type: tag.startsWith("h") ? "heading" : "paragraph",
      en: text,
      vi: text,
      headingLevel: parseHeadingLevel(tag),
    };
  }

  return null;
}

function pickContentRoot($: ReturnType<typeof load>): Cheerio<Element> {
  const primary = $("main article");
  if (primary.length > 0) {
    return primary.first();
  }

  const secondary = $("main");
  if (secondary.length > 0) {
    return secondary.first();
  }

  return $("body").first();
}

export function parseSwiftChapterHtml(html: string): {
  title: string;
  blocks: ContentBlock[];
} {
  const $ = load(html);
  const root = pickContentRoot($);

  root.find("script,style,nav,footer,aside").remove();

  const title = normalizeWhitespace(
    root.find("h1").first().text() || $("h1").first().text() || "Swift Chapter",
  );

  const candidates = root.find("h1,h2,h3,h4,p,pre,ul,ol,blockquote").toArray();
  const blocks: ContentBlock[] = [];

  candidates.forEach((el, index) => {
    const block = elementToBlock($, el, index);
    if (!block) {
      return;
    }

    blocks.push(block);
  });

  return {
    title,
    blocks,
  };
}
