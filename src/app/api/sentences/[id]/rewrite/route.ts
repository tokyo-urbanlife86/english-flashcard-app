import { errorResponse, parseBody, unauthorizedResponse } from "@/lib/api";
import { rewriteSentence } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { rewriteSchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { data, error } = await parseBody(request, rewriteSchema);
  if (error) return error;

  const { id } = await params;
  const sentence = await prisma.sentence.findFirst({
    where: { id, userId },
    select: { content: true },
  });

  if (!sentence) {
    return errorResponse("指定された暗唱文が見つかりません。", 404);
  }

  try {
    const suggestion = await rewriteSentence(sentence.content, data.tone);

    return Response.json({ suggestion });
  } catch (error) {
    console.error(error);
    return errorResponse(
      "AI添削に失敗しました。時間をおいてもう一度試してください。",
      502,
    );
  }
}
