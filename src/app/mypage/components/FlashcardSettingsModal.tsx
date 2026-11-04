"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { STATUSES } from "@/lib/constants";
import type { SortOrder, StatusId } from "@/lib/schemas";
import type { FlashcardSet } from "@/types/flashcard";

import { SetSelect } from "./SetSelect";

type FlashcardSettingsModalProps = {
  sets: FlashcardSet[];
  initialSetId: string;
  onClose: () => void;
};

const statusOptions: { label: string; value: StatusId | "all" }[] = [
  { label: "すべて", value: "all" },
  ...STATUSES.map((status) => ({ label: status.label, value: status.id })),
];

const sortOptions: { label: string; value: SortOrder }[] = [
  { label: "新しい順", value: "newest" },
  { label: "古い順", value: "oldest" },
  { label: "ランダム", value: "random" },
];

/** 選択肢をボタンで並べる。選ばれているものを青くする。 */
function OptionButtons<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2 text-sm font-semibold text-slate-700">
        {label}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              value === option.value
                ? "border-sky-500 bg-sky-500 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function FlashcardSettingsModal({
  sets,
  initialSetId,
  onClose,
}: FlashcardSettingsModalProps) {
  const router = useRouter();
  const [setId, setSetId] = useState(initialSetId);
  const [status, setStatus] = useState<StatusId | "all">("all");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [isStarting, setIsStarting] = useState(false);

  const selectedSet = sets.find((set) => set.id === setId);
  const canStart = Boolean(selectedSet?.sentenceCount) && !isStarting;

  function start() {
    const params = new URLSearchParams({ setId, sort });

    if (status !== "all") {
      params.set("status", status);
    }

    setIsStarting(true);
    router.push(`/flashcard?${params}`);
  }

  return (
    <Modal onClose={onClose} className="max-w-md">
      <h2 className="text-xl font-bold">フラッシュカード設定</h2>

      <div className="mt-6">
        <SetSelect
          label="セット"
          sets={sets}
          value={setId}
          onChange={setSetId}
        />
        {selectedSet?.sentenceCount === 0 && (
          <p className="mt-2 text-sm text-red-500">
            このセットにはまだカードがありません。
          </p>
        )}
      </div>

      <OptionButtons
        label="フィルター"
        options={statusOptions}
        value={status}
        onChange={setStatus}
      />
      <OptionButtons
        label="並び順"
        options={sortOptions}
        value={sort}
        onChange={setSort}
      />

      <div className="mt-7 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isStarting}>
          キャンセル
        </Button>
        <Button onClick={start} disabled={!canStart}>
          {isStarting ? "読み込み中..." : "スタート"}
        </Button>
      </div>
    </Modal>
  );
}
