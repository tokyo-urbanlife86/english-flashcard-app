import type { NextRequest } from "next/server";

import { errorResponse, parseBody, unauthorizedResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createSentencesSchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

const sentenceSelect = {
  id: true,
  content: true,
  translation: true,
  statusId: true,
} as const;

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const setId = request.nextUrl.searchParams.get("setId");

  if (!setId) {
    return errorResponse("セットを指定してください。", 400);
  }

  const sentences = await prisma.sentence.findMany({
    where: { userId, flashcardSetId: setId },
    orderBy: { createdAt: "desc" },
    select: sentenceSelect,
  });

  return Response.json({ sentences });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { data, error } = await parseBody(request, createSentencesSchema);
  if (error) return error;

  const set = await prisma.flashcardSet.findFirst({
    where: { id: data.setId, userId },
    select: { id: true },
  });

  if (!set) {
    return errorResponse("保存先のセットが見つかりません。", 404);
  }

  const sentences = await prisma.sentence.createManyAndReturn({
    data: data.sentences.map((sentence) => ({
      ...sentence,
      userId,
      flashcardSetId: set.id,
    })),
    select: sentenceSelect,
  });

  return Response.json({ sentences }, { status: 201 });
}
