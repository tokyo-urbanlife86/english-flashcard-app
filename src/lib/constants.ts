import type { RewriteTone, StatusId } from "@/lib/schemas";

export const DEFAULT_SET_NAME = "マイセット";

/** 習得状況。フラッシュカードの評価ボタンもこの順に並ぶ。 */
export const STATUSES: { id: StatusId; label: string; className: string }[] = [
  { id: "2", label: "覚えてない", className: "bg-rose-500 hover:bg-rose-600" },
  { id: "1", label: "怪しい", className: "bg-amber-500 hover:bg-amber-600" },
  {
    id: "0",
    label: "覚えた",
    className: "bg-emerald-500 hover:bg-emerald-600",
  },
];

export const LEARNED_STATUS_ID: StatusId = "0";

export const REWRITE_TONE_LABELS: Record<RewriteTone, string> = {
  casual: "カジュアル",
  formal: "フォーマル",
};

/** 1ヶ月に覚えた数（min 以上）で決まるキャラクターのレベル。 */
export const LEVELS = [
  { min: 0, title: "落ち武者", image: "/img/poor.png" },
  { min: 5, title: "堅牢な戦士", image: "/img/ordinary.png" },
  { min: 11, title: "地方の貴族", image: "/img/aristocracy.png" },
  { min: 21, title: "王族", image: "/img/queen.png" },
  { min: 50, title: "神", image: "/img/god.png" },
];
