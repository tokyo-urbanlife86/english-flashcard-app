"use client";

import { useState } from "react";

type EditableSetNameProps = {
  name: string;
  onRename: (name: string) => void;
};

/**
 * セット名。「名前変更」ボタンかダブルクリックで編集でき、
 * Enter かフォーカスが外れたときに保存する（Esc で取り消し）。
 */
export function EditableSetName({ name, onRename }: EditableSetNameProps) {
  const [draft, setDraft] = useState<string | null>(null);

  if (draft !== null) {
    return (
      <input
        value={draft}
        maxLength={30}
        autoFocus
        onFocus={(event) => event.target.select()}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          setDraft(null);
          onRename(draft);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") setDraft(null);
        }}
        className="min-w-0 flex-1 rounded-md border border-sky-300 bg-white px-2 py-1 text-base font-bold focus:outline-none focus:ring-4 focus:ring-sky-100"
        aria-label="セット名を編集"
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      <h2
        onDoubleClick={() => setDraft(name)}
        title="ダブルクリックで名前を変更"
        className="min-w-0 truncate text-base font-bold"
      >
        {name}
      </h2>
      <button
        type="button"
        onClick={() => setDraft(name)}
        className="shrink-0 rounded px-1.5 py-0.5 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        名前変更
      </button>
    </div>
  );
}
