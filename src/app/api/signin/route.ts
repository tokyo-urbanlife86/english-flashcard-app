import { NextResponse } from "next/server";

import { errorResponse, parseBody } from "@/lib/api";
import { isPasswordCorrect } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { signinSchema } from "@/lib/schemas";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, signinSchema);
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: data.id },
    select: { id: true, passwordHash: true },
  });

  if (!user || !isPasswordCorrect(data.password, user.passwordHash)) {
    return errorResponse("IDまたはパスワードが正しくありません", 401);
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, user.id);

  return response;
}
