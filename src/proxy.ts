import { NextResponse, type NextRequest } from "next/server";

import { sessionCookieName, verifySessionToken } from "@/lib/session";

const guestOnlyPaths = ["/signin", "/signup"];

/** ログイン状態に応じてページを振り分ける。API ルートは各ルートで確認する。 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = Boolean(
    verifySessionToken(request.cookies.get(sessionCookieName)?.value),
  );
  const isGuestOnly = guestOnlyPaths.includes(pathname);

  if (isLoggedIn && isGuestOnly) {
    return NextResponse.redirect(new URL("/mypage", request.url));
  }

  if (!isLoggedIn && !isGuestOnly) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage", "/flashcard", "/editmyinfo", "/signin", "/signup"],
};
