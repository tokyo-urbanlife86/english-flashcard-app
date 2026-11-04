import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const sessionCookieName = "pf_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

function sign(value: string) {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function createSessionToken(userId: string) {
  const payload = {
    userId,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

/** トークンが正しく期限内ならユーザーIDを返す。それ以外は null。 */
export function verifySessionToken(token: string | undefined) {
  const [encodedPayload, signature] = token?.split(".") ?? [];

  if (!encodedPayload || !signature) {
    return null;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(sign(encodedPayload));

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );

    if (typeof payload.userId !== "string" || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload.userId as string;
  } catch {
    return null;
  }
}

/** ページ・API ルートの両方から使える、ログイン中ユーザーIDの取得。 */
export async function getCurrentUserId() {
  const cookieStore = await cookies();

  return verifySessionToken(cookieStore.get(sessionCookieName)?.value);
}

function setCookie(response: NextResponse, value: string, maxAge: number) {
  response.cookies.set({
    name: sessionCookieName,
    value,
    maxAge,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function setSessionCookie(response: NextResponse, userId: string) {
  setCookie(response, createSessionToken(userId), sessionMaxAgeSeconds);
}

export function clearSessionCookie(response: NextResponse) {
  setCookie(response, "", 0);
}
