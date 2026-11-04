"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { NoticeText } from "@/components/NoticeText";
import type { FlashcardSet, Notice } from "@/types/flashcard";

import { SetSelect } from "./SetSelect";

type FlashcardSetControlsProps = {
  sets: FlashcardSet[];
  selectedSetId: string;
  onSelectSet: (setId: string) => void;
  onCreateSet: (name: string) => Promise<boolean>;
  notice: Notice;
};

export function FlashcardSetControls({
  sets,
  selectedSetId,
  onSelectSet,
  onCreateSet,
  notice,
}: FlashcardSetControlsProps) {
  const [newSetName, setNewSetName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);

    if (await onCreateSet(newSetName)) {
      setNewSetName("");
    }

    setIsCreating(false);
  }

  return (
    <div className="border-b border-slate-100 pb-5">
      <div className="grid gap-4 md:grid-cols-2">
        <SetSelect
          label="保存先セット"
          sets={sets}
          value={selectedSetId}
          onChange={onSelectSet}
        />

        <form onSubmit={handleCreate}>
          <label
            htmlFor="new-set-name"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            新しいセット
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="new-set-name"
              value={newSetName}
              onChange={(event) => setNewSetName(event.target.value)}
              placeholder="例: 旅行英会話"
              maxLength={30}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
            />
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "作成中..." : "セット作成"}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-3">
        <NoticeText notice={notice} />
      </div>
    </div>
  );
}
