import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

type TranslationCacheRow = {
  translated_text: string;
};

type ManualOverrideRow = {
  block_id: string;
  translated_text: string;
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "swift-docs.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS translation_cache (
    source_text TEXT PRIMARY KEY,
    translated_text TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS manual_translation_overrides (
    chapter_slug TEXT NOT NULL,
    block_id TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chapter_slug, block_id)
  );
`);

const selectTranslationStmt = db.prepare(
  `SELECT translated_text FROM translation_cache WHERE source_text = ?`,
);

const upsertTranslationStmt = db.prepare(`
  INSERT INTO translation_cache (source_text, translated_text, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(source_text)
  DO UPDATE SET
    translated_text = excluded.translated_text,
    updated_at = CURRENT_TIMESTAMP
`);

const selectOverridesStmt = db.prepare(
  `SELECT block_id, translated_text FROM manual_translation_overrides WHERE chapter_slug = ?`,
);

const upsertOverrideStmt = db.prepare(`
  INSERT INTO manual_translation_overrides (chapter_slug, block_id, translated_text, updated_at)
  VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(chapter_slug, block_id)
  DO UPDATE SET
    translated_text = excluded.translated_text,
    updated_at = CURRENT_TIMESTAMP
`);

const deleteOverrideStmt = db.prepare(
  `DELETE FROM manual_translation_overrides WHERE chapter_slug = ? AND block_id = ?`,
);

export function getCachedTranslation(sourceText: string): string | null {
  const row = selectTranslationStmt.get(sourceText) as TranslationCacheRow | undefined;
  return row?.translated_text ?? null;
}

export function upsertCachedTranslation(sourceText: string, translatedText: string) {
  upsertTranslationStmt.run(sourceText, translatedText);
}

export function getManualOverridesForChapter(chapterSlug: string): Map<string, string> {
  const rows = selectOverridesStmt.all(chapterSlug) as ManualOverrideRow[];
  return new Map(rows.map((row) => [row.block_id, row.translated_text]));
}

export function setManualOverride(chapterSlug: string, blockId: string, translatedText: string) {
  upsertOverrideStmt.run(chapterSlug, blockId, translatedText);
}

export function removeManualOverride(chapterSlug: string, blockId: string) {
  deleteOverrideStmt.run(chapterSlug, blockId);
}
