import { errorResponse, parseBody, unauthorizedResponse } from "@/lib/api";
import { isNotFoundError, prisma } from "@/lib/prisma";
import { updateSentenceSchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { data, error } = await parseBody(request, updateSentenceSchema);
  if (error) return error;

  const { id } = await params;

  try {
    const sentence = await prisma.sentence.update({
      where: { id, userId },
      data: {
        content: data.content,
        translation: data.translation,
        ...(data.statusId && {
          statusId: data.statusId,
          statusUpdatedAt: new Date(),
        }),
      },
      select: { id: true, content: true, translation: true, statusId: true },
    });

    return Response.json({ sentence });
  } catch (error) {
    if (isNotFoundError(error)) {
      return errorResponse("指定された暗唱文が見つかりません。", 404);
    }

    console.error(error);
    return errorResponse("暗唱文の更新に失敗しました。", 500);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { id } = await params;

  try {
    await prisma.sentence.delete({ where: { id, userId } });

    return Response.json({ ok: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return errorResponse("指定された暗唱文が見つかりません。", 404);
    }

    console.error(error);
    return errorResponse("削除に失敗しました。", 500);
  }
}
