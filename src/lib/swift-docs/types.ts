export type ChapterLink = {
  slug: string;
  title: string;
  description: string;
  section: ChapterSection;
};

export type ChapterSection =
  | "welcome"
  | "languageGuide"
  | "languageReference"
  | "revisionHistory";

export type ContentBlockType = "heading" | "paragraph" | "list" | "code" | "quote";

export type ContentBlock = {
  id: string;
  type: ContentBlockType;
  en: string;
  vi: string;
  autoVi?: string;
  translationSource?: "auto" | "manual";
  headingLevel?: number;
};

export type ChapterContent = {
  slug: string;
  title: string;
  sourceUrl: string;
  blocks: ContentBlock[];
};
