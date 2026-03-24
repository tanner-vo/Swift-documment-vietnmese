import { removeManualOverride, setManualOverride } from "@/lib/db/sqlite";
import { z } from "zod";

export const runtime = "nodejs";

const upsertSchema = z.object({
  chapterSlug: z.string().min(1),
  blockId: z.string().min(1),
  translatedText: z.string().min(1),
});

const deleteSchema = z.object({
  chapterSlug: z.string().min(1),
  blockId: z.string().min(1),
});

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const parsed = upsertSchema.parse(payload);

    setManualOverride(parsed.chapterSlug, parsed.blockId, parsed.translatedText.trim());

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Bad request",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await request.json();
    const parsed = deleteSchema.parse(payload);

    removeManualOverride(parsed.chapterSlug, parsed.blockId);

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Bad request",
      },
      { status: 400 },
    );
  }
}
