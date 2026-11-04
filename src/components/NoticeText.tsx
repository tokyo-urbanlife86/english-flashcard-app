import type { Notice } from "@/types/flashcard";

/** 成功は緑、エラーは赤で表示する一行メッセージ。 */
export function NoticeText({ notice }: { notice: Notice }) {
  if (!notice) return null;

  return (
    <p
      role={notice.isError ? "alert" : "status"}
      className={`text-sm ${notice.isError ? "text-red-500" : "text-emerald-600"}`}
    >
      {notice.text}
    </p>
  );
}
