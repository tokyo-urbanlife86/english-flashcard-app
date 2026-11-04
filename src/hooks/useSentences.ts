"use client";

import { useEffect, useState } from "react";

import { fetchJson } from "@/lib/fetch-json";
import type { SentenceInput } from "@/lib/schemas";
import type { Notice, SavedSentence } from "@/types/flashcard";

/**
 * 選択中セットの文章一覧と、その追加・更新・削除を扱う。
 * 各関数は成功したかどうかを返し、結果のメッセージは notice に入る。
 */
export function useSentences(
  setId: string,
  onCountChange: (setId: string, diff: number) => void,
) {
  const [sentences, setSentences] = useState<SavedSentence[]>([]);
  const [loadedSetId, setLoadedSetId] = useState("");
  const [notice, setNotice] = useState<Notice>(null);

  const isLoading = loadedSetId !== setId;

  useEffect(() => {
    let ignore = false;

    fetchJson<{ sentences: SavedSentence[] }>(
      `/api/sentences?setId=${encodeURIComponent(setId)}`,
    ).then((result) => {
      // 読み込み中に別のセットへ切り替えた場合は結果を捨てる
      if (ignore) return;

      if (result.ok) {
        setSentences(result.data.sentences);
      } else {
        setSentences([]);
        setNotice({ text: result.message, isError: true });
      }
      setLoadedSetId(setId);
    });

    return () => {
      ignore = true;
    };
  }, [setId]);

  function showError(text: string) {
    setNotice({ text, isError: true });
  }

  async function createSentences(rows: SentenceInput[]) {
    const result = await fetchJson<{ sentences: SavedSentence[] }>(
      "/api/sentences",
      { method: "POST", body: { setId, sentences: rows } },
    );

    if (!result.ok) {
      showError(result.message);
      return false;
    }

    const created = result.data.sentences;
    setSentences((current) => [...created, ...current]);
    setNotice({ text: `${created.length}件保存しました。`, isError: false });
    onCountChange(setId, created.length);
    return true;
  }

  async function updateSentence(
    sentenceId: string,
    patch: Partial<SentenceInput>,
  ) {
    const result = await fetchJson<{ sentence: SavedSentence }>(
      `/api/sentences/${sentenceId}`,
      { method: "PATCH", body: patch },
    );

    if (!result.ok) {
      showError(result.message);
      return false;
    }

    setSentences((current) =>
      current.map((sentence) =>
        sentence.id === sentenceId ? result.data.sentence : sentence,
      ),
    );
    setNotice({ text: "カードを更新しました。", isError: false });
    return true;
  }

  async function deleteSentence(sentenceId: string) {
    const result = await fetchJson(`/api/sentences/${sentenceId}`, {
      method: "DELETE",
    });

    if (!result.ok) {
      showError(result.message);
      return;
    }

    setSentences((current) =>
      current.filter((sentence) => sentence.id !== sentenceId),
    );
    setNotice({ text: "カードを削除しました。", isError: false });
    onCountChange(setId, -1);
  }

  return {
    sentences,
    isLoading,
    notice,
    createSentences,
    updateSentence,
    deleteSentence,
  };
}
