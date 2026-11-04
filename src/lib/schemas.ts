import { z } from "zod";

// クライアントとサーバーで同じスキーマを使い、エラーメッセージをそろえる。

const usernameField = z
  .string()
  .trim()
  .min(1, "ユーザー名は必須です")
  .max(15, "ユーザー名は15文字以内で入力してください");

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("メールアドレスの形式が正しくありません"));

const contentField = z
  .string()
  .trim()
  .min(1, "英文を入力してください")
  .refine((value) => value.split(/\s+/).length <= 100, {
    message: "英文は100語以内で入力してください",
  });

const translationField = z
  .string()
  .trim()
  .min(1, "日本語訳を入力してください")
  .max(200, "日本語訳は200文字以内で入力してください");

export const statusIdSchema = z.enum(["0", "1", "2"]);

export const signinSchema = z.object({
  id: z.string().trim().min(1, "IDは必須です"),
  password: z.string().min(1, "パスワードは必須です"),
});

export const signupSchema = z.object({
  id: z
    .string()
    .trim()
    .min(8, "IDは8文字以上で入力してください")
    .regex(/^[a-zA-Z0-9]+$/, "IDは英数字だけで入力してください"),
  username: usernameField,
  email: emailField,
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export const updateMeSchema = z
  .object({
    username: usernameField,
    email: emailField,
    currentPassword: z.string(),
    newPassword: z.string(),
  })
  .superRefine((value, context) => {
    if (!value.newPassword) return;

    if (value.newPassword.length < 8) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "新しいパスワードは8文字以上で入力してください",
      });
    }

    if (!value.currentPassword) {
      context.addIssue({
        code: "custom",
        path: ["currentPassword"],
        message: "パスワードを変更するには現在のパスワードを入力してください",
      });
    }
  });

export const sentenceSchema = z.object({
  content: contentField,
  translation: translationField,
});

export const createSentencesSchema = z.object({
  setId: z.uuid(),
  sentences: z.array(sentenceSchema).min(1),
});

export const updateSentenceSchema = z
  .object({
    content: contentField.optional(),
    translation: translationField.optional(),
    statusId: statusIdSchema.optional(),
  })
  .refine(
    (value) => value.content || value.translation || value.statusId,
    "更新する内容を入力してください。",
  );

export const setNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "セット名を入力してください")
    .max(30, "セット名は30文字以内で入力してください"),
});

export const rewriteToneSchema = z.enum(["casual", "formal"]);

export const rewriteSchema = z.object({
  tone: rewriteToneSchema,
});

export const flashcardQuerySchema = z.object({
  setId: z.string().optional(),
  status: statusIdSchema.optional().catch(undefined),
  sort: z.enum(["newest", "oldest", "random"]).catch("newest"),
});

export type StatusId = z.infer<typeof statusIdSchema>;
export type RewriteTone = z.infer<typeof rewriteToneSchema>;
export type SentenceInput = z.infer<typeof sentenceSchema>;
export type SortOrder = z.infer<typeof flashcardQuerySchema>["sort"];

export type FieldErrors = Record<string, string[] | undefined>;

/** Zod のエラーを { フィールド名: [メッセージ] } の形にする。 */
export function getFieldErrors(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors as FieldErrors;
}
