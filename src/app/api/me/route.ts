import { errorResponse, parseBody, unauthorizedResponse } from "@/lib/api";
import { createPasswordHash, isPasswordCorrect } from "@/lib/password";
import { isUniqueError, prisma } from "@/lib/prisma";
import { updateMeSchema } from "@/lib/schemas";
import { getCurrentUserId } from "@/lib/session";

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorizedResponse();

  const { data, error } = await parseBody(request, updateMeSchema);
  if (error) return error;

  const { username, email, currentPassword, newPassword } = data;

  if (newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user || !isPasswordCorrect(currentPassword, user.passwordHash)) {
      return errorResponse("入力内容を確認してください。", 400, {
        currentPassword: ["現在のパスワードが正しくありません"],
      });
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        ...(newPassword && { passwordHash: createPasswordHash(newPassword) }),
      },
      select: { id: true, username: true, email: true },
    });

    return Response.json({ user });
  } catch (error) {
    if (isUniqueError(error)) {
      return errorResponse("入力内容を確認してください。", 409, {
        email: ["このメールアドレスはすでに使われています"],
      });
    }

    console.error(error);
    return errorResponse("ユーザー情報の更新に失敗しました。", 500);
  }
}
