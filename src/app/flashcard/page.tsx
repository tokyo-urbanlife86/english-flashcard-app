import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { flashcardQuerySchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

import { FlashcardClient } from "./FlashcardClient";

type FlashcardPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

/** 配列をランダムに並べ替える（Fisher–Yates）。 */
function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export default async function FlashcardPage({
  searchParams,
}: FlashcardPageProps) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/signin");

  const query = flashcardQuerySchema.parse(await searchParams);

  const sentences = await prisma.sentence.findMany({
    where: {
      userId,
      flashcardSetId: query.setId,
      statusId: query.status,
    },
    orderBy: { createdAt: query.sort === "oldest" ? "asc" : "desc" },
    select: { id: true, content: true, translation: true },
  });

  return (
    <FlashcardClient
      sentences={query.sort === "random" ? shuffle(sentences) : sentences}
    />
  );
}
