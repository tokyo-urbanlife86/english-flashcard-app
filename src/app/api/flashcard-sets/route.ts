import { errorResponse, parseBody, unauthorizedResponse } from "@/lib/api";
import { isUniqueError, prisma } from "@/lib/prisma";
import { setNameSchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { data, error } = await parseBody(request, setNameSchema);
  if (error) return error;

  try {
    const set = await prisma.flashcardSet.create({
      data: { name: data.name, userId },
      select: { id: true, name: true },
    });

    return Response.json(
      { set: { ...set, sentenceCount: 0 } },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueError(error)) {
      return errorResponse("入力内容を確認してください。", 409, {
        name: ["同じ名前のセットがすでにあります"],
      });
    }

    console.error(error);
    return errorResponse("セットの作成に失敗しました。", 500);
  }
}
