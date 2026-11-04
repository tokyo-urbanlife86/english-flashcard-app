import type { StatusId } from "@/lib/schemas";

// API・サーバーコンポーネントから受け取るデータの型。入力の型は lib/schemas.ts の z.infer を使う。

export type UserInfo = {
  id: string;
  username: string;
  email: string;
};

export type StudyStats = {
  monthlyCount: number;
  totalCount: number;
};

export type FlashcardSet = {
  id: string;
  name: string;
  sentenceCount: number;
};

export type SavedSentence = {
  id: string;
  content: string;
  translation: string;
  statusId: StatusId;
};

/** 画面に表示するメッセージ。isError で色を変える。 */
export type Notice = { text: string; isError: boolean } | null;
