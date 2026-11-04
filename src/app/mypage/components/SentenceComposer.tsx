"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { TextAreaField } from "@/components/TextField";
import {
  type FieldErrors,
  getFieldErrors,
  type SentenceInput,
  sentenceSchema,
} from "@/lib/schemas";

type SentenceComposerProps = {
  onSave: (rows: SentenceInput[]) => Promise<boolean>;
  canSave: boolean;
};

const emptyRow: SentenceInput = { content: "", translation: "" };

function isEmptyRow(row: SentenceInput) {
  return !row.content.trim() && !row.translation.trim();
}

/** 英文と日本語訳を複数行まとめて入力・保存する。 */
export function SentenceComposer({ onSave, canSave }: SentenceComposerProps) {
  const [rows, setRows] = useState([emptyRow]);
  const [rowErrors, setRowErrors] = useState<FieldErrors[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  function updateRow(index: number, key: keyof SentenceInput, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  }

  async function handleSave() {
    // 空の行は無視し、入力のある行だけ検証する
    const results = rows.map((row) =>
      isEmptyRow(row) ? null : sentenceSchema.safeParse(row),
    );
    setRowErrors(
      results.map((result) =>
        result && !result.success ? getFieldErrors(result.error) : {},
      ),
    );

    if (results.some((result) => result && !result.success)) return;

    const validRows = results.flatMap((result) =>
      result?.success ? [result.data] : [],
    );

    if (validRows.length === 0) {
      setRowErrors([{ content: ["英文と日本語訳を入力してください"] }]);
      return;
    }

    setIsSaving(true);

    if (await onSave(validRows)) {
      setRows([emptyRow]);
      setRowErrors([]);
    }

    setIsSaving(false);
  }

  return (
    <section>
      <h2 className="mb-4 text-base font-bold">文章入力</h2>

      <div className="flex flex-col gap-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 md:grid-cols-2"
          >
            <TextAreaField
              label="英文"
              value={row.content}
              onChange={(event) =>
                updateRow(index, "content", event.target.value)
              }
              placeholder="例: I've been looking forward to meeting you."
              error={rowErrors[index]?.content?.[0]}
            />
            <TextAreaField
              label="日本語訳"
              value={row.translation}
              onChange={(event) =>
                updateRow(index, "translation", event.target.value)
              }
              placeholder="例: お会いできるのを楽しみにしていました。"
              maxLength={200}
              error={rowErrors[index]?.translation?.[0]}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setRows((current) => [...current, emptyRow])}
        >
          ＋ 行を追加
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !canSave}>
          {isSaving ? "保存中..." : "保存"}
        </Button>
      </div>
    </section>
  );
}
