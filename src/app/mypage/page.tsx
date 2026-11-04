import { redirect } from "next/navigation";

import { LEARNED_STATUS_ID } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

import { MyPageClient } from "./MyPageClient";

export default async function MyPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/signin");

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [user, monthlyCount, totalCount, sets] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    }),
    prisma.sentence.count({
      where: {
        userId,
        statusId: LEARNED_STATUS_ID,
        statusUpdatedAt: { gte: oneMonthAgo },
      },
    }),
    prisma.sentence.count({
      where: { userId, statusId: LEARNED_STATUS_ID },
    }),
    prisma.flashcardSet.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, _count: { select: { sentences: true } } },
    }),
  ]);

  if (!user) redirect("/signin");

  return (
    <MyPageClient
      username={user.username}
      stats={{ monthlyCount, totalCount }}
      initialSets={sets.map((set) => ({
        id: set.id,
        name: set.name,
        sentenceCount: set._count.sentences,
      }))}
    />
  );
}
