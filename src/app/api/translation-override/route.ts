import { removeManualOverride, setManualOverride } from "@/lib/db/sqlite";
import { authorizeMaintainerRequest } from "@/lib/security/maintainer-auth";
import { z } from "zod";

export const runtime = "nodejs";

const upsertSchema = z.object({
  chapterSlug: z.string().regex(/^[a-z0-9-]+$/).max(100),
  blockId: z.string().regex(/^b-\d+$/).max(40),
  translatedText: z.string().trim().min(1).max(20_000),
});

const deleteSchema = z.object({
  chapterSlug: z.string().regex(/^[a-z0-9-]+$/).max(100),
  blockId: z.string().regex(/^b-\d+$/).max(40),
});

function authorize(request: Request): Response | null {
  const authorization = authorizeMaintainerRequest(request);
  if (authorization.ok) {
    return null;
  }

  return Response.json(
    { ok: false, error: authorization.message },
    { status: authorization.status },
  );
}

function mutationErrorResponse(error: unknown): Response {
  const isValidationError = error instanceof z.ZodError;

  return Response.json(
    {
      ok: false,
      error: isValidationError
        ? "Dữ liệu bản dịch không hợp lệ."
        : "Không thể cập nhật bản dịch.",
    },
    { status: isValidationError ? 400 : 500 },
  );
}

export async function PUT(request: Request) {
  const authorizationError = authorize(request);
  if (authorizationError) {
    return authorizationError;
  }

  try {
    const payload = await request.json();
    const parsed = upsertSchema.parse(payload);

    setManualOverride(parsed.chapterSlug, parsed.blockId, parsed.translatedText);

    return Response.json({ ok: true });
  } catch (error) {
    return mutationErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  const authorizationError = authorize(request);
  if (authorizationError) {
    return authorizationError;
  }

  try {
    const payload = await request.json();
    const parsed = deleteSchema.parse(payload);

    removeManualOverride(parsed.chapterSlug, parsed.blockId);

    return Response.json({ ok: true });
  } catch (error) {
    return mutationErrorResponse(error);
  }
}
