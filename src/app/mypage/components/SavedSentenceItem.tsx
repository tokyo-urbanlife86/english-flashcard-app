"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TextAreaField } from "@/components/TextField";
import { REWRITE_TONE_LABELS, STATUSES } from "@/lib/constants";
import { fetchJson } from "@/lib/fetch-json";
import {
  type FieldErrors,
  getFieldErrors,
  type RewriteTone,
  type SentenceInput,
  sentenceSchema,
} from "@/lib/schemas";
import type { SavedSentence } from "@/types/flashcard";

type SavedSentenceItemProps = {
  sentence: SavedSentence;
  onUpdate: (id: string, patch: Partial<SentenceInput>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
};

type Suggestion = { tone: RewriteTone; text: string };

/** 保存済みカード1枚。編集・削除・AI添削の状態はこのカードの中だけで持つ。 */
export function SavedSentenceItem({
  sentence,
  onUpdate,
  onDelete,
}: SavedSentenceItemProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // 編集
  const [draft, setDraft] = useState<SentenceInput | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  // AI添削
  const [rewritingTone, setRewritingTone] = useState<RewriteTone | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [rewriteError, setRewriteError] = useState("");

  const statusLabel = STATUSES.find((s) => s.id === sentence.statusId)?.label;

  async function saveDraft() {
    const parsed = sentenceSchema.safeParse(draft);

    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setIsBusy(true);
    if (await onUpdate(sentence.id, parsed.data)) {
      setDraft(null);
      setErrors({});
    }
    setIsBusy(false);
  }

  async function requestRewrite(tone: RewriteTone) {
    setRewritingTone(tone);
    setRewriteError("");

    const result = await fetchJson<{ suggestion: string }>(
      `/api/sentences/${sentence.id}/rewrite`,
      { method: "POST", body: { tone } },
    );

    setRewritingTone(null);

    if (result.ok) {
      setSuggestion({ tone, text: result.data.suggestion });
    } else {
      setRewriteError(result.message);
    }
  }

  async function applySuggestion(text: string) {
    setIsBusy(true);
    if (await onUpdate(sentence.id, { content: text })) {
      setSuggestion(null);
    }
    setIsBusy(false);
  }

  async function handleDelete() {
    setIsConfirmingDelete(false);
    setIsBusy(true);
    await onDelete(sentence.id);
    setIsBusy(false);
  }

  if (draft) {
    return (
      <li className="space-y-3 rounded-lg border border-sky-200 bg-slate-50 p-3">
        <TextAreaField
          label="英文"
          value={draft.content}
          onChange={(event) =>
            setDraft({ ...draft, content: event.target.value })
          }
          error={errors.content?.[0]}
        />
        <TextAreaField
          label="日本語訳"
          value={draft.translation}
          onChange={(event) =>
            setDraft({ ...draft, translation: event.target.value })
          }
          maxLength={200}
          error={errors.translation?.[0]}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={saveDraft} disabled={isBusy}>
            {isBusy ? "保存中..." : "保存"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setDraft(null);
              setErrors({});
            }}
            disabled={isBusy}
          >
            キャンセル
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold leading-6">{sentence.content}</p>

      {suggestion && (
        <div className="mt-2 rounded-lg border border-sky-100 bg-white p-3">
          <p className="text-xs font-bold text-sky-600">
            AI添削：{REWRITE_TONE_LABELS[suggestion.tone]}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6">
            {suggestion.text}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => applySuggestion(suggestion.text)}
              disabled={isBusy || rewritingTone !== null}
            >
              {isBusy ? "変更中..." : "この文に変更"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => requestRewrite(suggestion.tone)}
              disabled={isBusy || rewritingTone !== null}
            >
              {rewritingTone ? "生成中..." : "もう一回"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSuggestion(null)}
              disabled={isBusy}
            >
              閉じる
            </Button>
          </div>
        </div>
      )}

      {rewriteError && (
        <p className="mt-2 text-sm text-red-500">{rewriteError}</p>
      )}

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {sentence.translation}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-sky-600">{statusLabel}</p>
        <div className="flex flex-wrap gap-2">
          {(["casual", "formal"] as const).map((tone) => (
            <Button
              key={tone}
              size="sm"
              variant="secondary"
              onClick={() => requestRewrite(tone)}
              disabled={isBusy || rewritingTone !== null}
            >
              {rewritingTone === tone
                ? "生成中..."
                : `${REWRITE_TONE_LABELS[tone]}に`}
            </Button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              setDraft({
                content: sentence.content,
                translation: sentence.translation,
              })
            }
            disabled={isBusy}
          >
            編集
          </Button>
          <Button
            size="sm"
            variant="dangerOutline"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isBusy}
          >
            削除
          </Button>
        </div>
      </div>

      {isConfirmingDelete && (
        <ConfirmModal
          message="このフラッシュカードを削除しますか？"
          confirmLabel="削除する"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </li>
  );
}
