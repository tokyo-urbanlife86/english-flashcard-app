import { NextResponse } from "next/server";

import { errorResponse, parseBody } from "@/lib/api";
import { DEFAULT_SET_NAME } from "@/lib/constants";
import { createPasswordHash } from "@/lib/password";
import { isUniqueError, prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/schemas";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, signupSchema);
  if (error) return error;

  try {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
        passwordHash: createPasswordHash(data.password),
        flashcardSets: { create: { name: DEFAULT_SET_NAME } },
      },
      select: { id: true },
    });

    const response = NextResponse.json({ ok: true }, { status: 201 });
    setSessionCookie(response, user.id);

    return response;
  } catch (error) {
    if (isUniqueError(error)) {
      return errorResponse(
        "このIDまたはメールアドレスはすでに使われています",
        409,
      );
    }

    console.error(error);
    return errorResponse(
      "登録に失敗しました。時間をおいてもう一度お試しください。",
      500,
    );
  }
}
