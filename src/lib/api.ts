import type { z } from "zod";

import { type FieldErrors, getFieldErrors } from "@/lib/schemas";

// API ルートで使う共通処理。

export function errorResponse(
  message: string,
  status: number,
  fieldErrors?: FieldErrors,
) {
  return Response.json({ message, fieldErrors }, { status });
}

export function unauthorizedResponse() {
  return errorResponse("ログインしてください。", 401);
}

/** リクエストの JSON をスキーマで検証する。失敗時はそのまま返せる Response を返す。 */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ data: T; error?: never } | { data?: never; error: Response }> {
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      error: errorResponse(
        "入力内容を確認してください。",
        400,
        getFieldErrors(result.error),
      ),
    };
  }

  return { data: result.data };
}
