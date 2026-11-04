import { errorResponse, parseBody, unauthorizedResponse } from "@/lib/api";
import { isNotFoundError, isUniqueError, prisma } from "@/lib/prisma";
import { setNameSchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { data, error } = await parseBody(request, setNameSchema);
  if (error) return error;

  const { id } = await params;

  try {
    const set = await prisma.flashcardSet.update({
      where: { id, userId },
      data: { name: data.name },
      select: { id: true, name: true },
    });

    return Response.json({ set });
  } catch (error) {
    if (isNotFoundError(error)) {
      return errorResponse("指定されたセットが見つかりません。", 404);
    }

    if (isUniqueError(error)) {
      return errorResponse("同じ名前のセットがすでにあります", 409);
    }

    console.error(error);
    return errorResponse("セット名の変更に失敗しました。", 500);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { id } = await params;
  const setCount = await prisma.flashcardSet.count({ where: { userId } });

  if (setCount <= 1) {
    return errorResponse("最後のセットは削除できません。", 400);
  }

  try {
    // セット内の文章は onDelete: Cascade で一緒に削除される
    await prisma.flashcardSet.delete({ where: { id, userId } });

    return Response.json({ ok: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return errorResponse("指定されたセットが見つかりません。", 404);
    }

    console.error(error);
    return errorResponse("セットの削除に失敗しました。", 500);
  }
}
