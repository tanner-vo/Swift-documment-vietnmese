# Swift Docs VN Companion — AI agent instructions

## Project context
- This is a Next.js 16 App Router app (`src/app`) for bilingual Swift docs reading (EN ↔ VI), not a generic CRUD app.
- Keep in mind `AGENTS.md`: **Next.js behavior may differ from older assumptions**; check `node_modules/next/dist/docs/` when touching framework APIs.
- UI copy is intentionally Vietnamese-first for learner UX.

## Core architecture and data flow
- Chapter page flow: `src/app/chapter/[slug]/page.tsx` → `getChapterContent` in `src/lib/swift-docs/service.ts`.
- `getChapterContent` pipeline:
  1. Resolve chapter metadata from `src/lib/swift-docs/chapters.ts`
  2. Fetch DocC JSON (`.../data/.../<slug>.json`) first
  3. Fallback to HTML parse if DocC yields no blocks
  4. Translate blocks EN→VI (skip code blocks)
  5. Merge manual overrides from SQLite
- Parsing logic lives in `src/lib/swift-docs/parse.ts`:
  - Prefer `parseSwiftChapterDocJson`
  - Fallback `parseSwiftChapterHtml`
  - Supports headings, paragraphs, code, ordered/unordered lists, term lists, tables, asides.

## Persistence, caching, and runtime boundaries
- SQLite is required (`better-sqlite3`) in `src/lib/db/sqlite.ts`; DB file is `data/swift-docs.db`.
- There are two cache layers for translations:
  - In-memory map (`TRANSLATION_CACHE` in `translate.ts`)
  - Persistent `translation_cache` table in SQLite
- Manual edits are stored in `manual_translation_overrides` and merged in `service.ts`.
- Keep server routes/pages that touch SQLite on Node runtime (`export const runtime = "nodejs"`), as done in:
  - `src/app/chapter/[slug]/page.tsx`
  - `src/app/api/translation-override/route.ts`

## Project-specific coding patterns
- Use shared block model from `src/lib/swift-docs/types.ts` (`ContentBlock`, `translationSource`, optional `autoVi`).
- Preserve block IDs (`b-<index>`) when modifying parsers; manual overrides key by `chapter_slug + block_id`.
- Do not auto-translate code blocks (`type === "code"`), and preserve inline code/glossary protection behavior in `translate.ts`.
- API payload validation uses Zod in route handlers.
- Use `@/*` path alias (configured in `tsconfig.json`) instead of deep relative imports.

## Developer workflows
- Install/run: `npm install`, `npm run dev`.
- Production: `npm run build`, `npm run start`.
- Lint: `npm run lint` (ESLint 9 + `eslint-config-next`).
- No test suite is currently defined in `package.json`; prefer validating via lint + manual route checks.

## External integrations and debugging cues
- Upstream sources:
  - Swift docs DocC JSON/HTML (`docs.swift.org`)
  - Google translate endpoint (`translate.googleapis.com`) in `translate.ts`
- If chapter content is empty, debug in this order:
  1. Check slug exists in `CHAPTERS`
  2. Verify DocC JSON endpoint response
  3. Verify HTML fallback parse still yields blocks
- If translations look stale/wrong, inspect/clear `data/swift-docs.db` caches and manual overrides before changing translation logic.
