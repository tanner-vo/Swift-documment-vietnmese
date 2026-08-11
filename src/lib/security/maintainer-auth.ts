import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

const MIN_TOKEN_LENGTH = 32;

function constantTimeEqual(left: string, right: string): boolean {
  const leftBuffer = createHash("sha256").update(left).digest();
  const rightBuffer = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

function hasValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  if (!host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export type MaintainerAuthorization =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 503; message: string };

export function authorizeMaintainerRequest(request: Request): MaintainerAuthorization {
  const configuredToken = process.env.MAINTAINER_EDIT_TOKEN?.trim();

  if (!configuredToken || configuredToken.length < MIN_TOKEN_LENGTH) {
    return {
      ok: false,
      status: 503,
      message: "Chỉnh sửa bản dịch chưa được cấu hình.",
    };
  }

  if (!hasValidOrigin(request)) {
    return {
      ok: false,
      status: 403,
      message: "Nguồn yêu cầu không hợp lệ.",
    };
  }

  const providedToken = readBearerToken(request);
  if (!providedToken) {
    return {
      ok: false,
      status: 401,
      message: "Cần mã xác thực maintainer.",
    };
  }

  if (!constantTimeEqual(providedToken, configuredToken)) {
    return {
      ok: false,
      status: 403,
      message: "Mã xác thực maintainer không hợp lệ.",
    };
  }

  return { ok: true };
}
