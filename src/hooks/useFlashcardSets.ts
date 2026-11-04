"use client";

import { useState } from "react";

import { fetchJson } from "@/lib/fetch-json";
import { setNameSchema } from "@/lib/schemas";
import type { FlashcardSet, Notice } from "@/types/flashcard";

/** セット一覧の選択・作成・名前変更・削除を扱う。初期データはサーバーから受け取る。 */
export function useFlashcardSets(initialSets: FlashcardSet[]) {
  const [sets, setSets] = useState(initialSets);
  const [selectedSetId, setSelectedSetId] = useState(initialSets[0]?.id ?? "");
  const [notice, setNotice] = useState<Notice>(null);

  const selectedSet = sets.find((set) => set.id === selectedSetId);

  function showError(text: string) {
    setNotice({ text, isError: true });
  }

  async function createSet(name: string) {
    const parsed = setNameSchema.safeParse({ name });

    if (!parsed.success) {
      showError(parsed.error.issues[0].message);
      return false;
    }

    const result = await fetchJson<{ set: FlashcardSet }>(
      "/api/flashcard-sets",
      { method: "POST", body: parsed.data },
    );

    if (!result.ok) {
      showError(result.fieldErrors.name?.[0] ?? result.message);
      return false;
    }

    setSets((current) => [...current, result.data.set]);
    setSelectedSetId(result.data.set.id);
    setNotice({ text: "セットを作成しました。", isError: false });
    return true;
  }

  async function renameSet(setId: string, name: string) {
    const parsed = setNameSchema.safeParse({ name });
    const target = sets.find((set) => set.id === setId);

    if (!parsed.success) {
      showError(parsed.error.issues[0].message);
      return;
    }

    if (!target || target.name === parsed.data.name) return;

    const result = await fetchJson(`/api/flashcard-sets/${setId}`, {
      method: "PATCH",
      body: parsed.data,
    });

    if (!result.ok) {
      showError(result.message);
      return;
    }

    setSets((current) =>
      current.map((set) =>
        set.id === setId ? { ...set, name: parsed.data.name } : set,
      ),
    );
    setNotice({ text: "セット名を変更しました。", isError: false });
  }

  async function deleteSet(setId: string) {
    const result = await fetchJson(`/api/flashcard-sets/${setId}`, {
      method: "DELETE",
    });

    if (!result.ok) {
      showError(result.message);
      return;
    }

    const remainingSets = sets.filter((set) => set.id !== setId);
    setSets(remainingSets);
    setSelectedSetId(remainingSets[0]?.id ?? "");
    setNotice({ text: "セットを削除しました。", isError: false });
  }

  /** 文章の追加・削除に合わせて、セットのカード数を更新する。 */
  function changeSentenceCount(setId: string, diff: number) {
    setSets((current) =>
      current.map((set) =>
        set.id === setId
          ? { ...set, sentenceCount: set.sentenceCount + diff }
          : set,
      ),
    );
  }

  return {
    sets,
    selectedSet,
    selectedSetId,
    setSelectedSetId,
    notice,
    createSet,
    renameSet,
    deleteSet,
    changeSentenceCount,
  };
}
