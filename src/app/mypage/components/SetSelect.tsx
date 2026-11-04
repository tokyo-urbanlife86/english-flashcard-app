import { useId } from "react";

import type { FlashcardSet } from "@/types/flashcard";

type SetSelectProps = {
  label: string;
  sets: FlashcardSet[];
  value: string;
  onChange: (setId: string) => void;
};

/** セット選択のプルダウン（マイページとフラッシュカード設定で共用）。 */
export function SetSelect({ label, sets, value, onChange }: SetSelectProps) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
      >
        {sets.map((set) => (
          <option key={set.id} value={set.id}>
            {set.name}（{set.sentenceCount}件）
          </option>
        ))}
      </select>
    </div>
  );
}
