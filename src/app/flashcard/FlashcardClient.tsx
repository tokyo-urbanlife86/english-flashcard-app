"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { STATUSES } from "@/lib/constants";
import { fetchJson } from "@/lib/fetch-json";
import type { StatusId } from "@/lib/schemas";

type Card = {
  id: string;
  content: string;
  translation: string;
};

const emptyTally: Record<StatusId, number> = { "0": 0, "1": 0, "2": 0 };

/** 英文をブラウザの音声合成で読み上げる。 */
function speak(text: string) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

/** カードがないとき・終わったときに表示する画面。 */
function MessageScreen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="mt-3 text-sm leading-6 text-slate-500">{children}</div>
        <Link
          href="/mypage"
          className="mt-6 inline-block rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-sky-600"
        >
          マイページへ戻る
        </Link>
      </div>
    </main>
  );
}

export function FlashcardClient({ sentences }: { sentences: Card[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isQuitConfirmOpen, setIsQuitConfirmOpen] = useState(false);
  // 今回のセッションで付けた評価の件数
  const [tally, setTally] = useState(emptyTally);

  const card = sentences[currentIndex];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space" || isQuitConfirmOpen || isUpdating) return;

      event.preventDefault();
      setIsFlipped((current) => !current);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQuitConfirmOpen, isUpdating]);

  async function rate(statusId: StatusId) {
    setIsUpdating(true);
    setErrorMessage("");

    const result = await fetchJson(`/api/sentences/${card.id}`, {
      method: "PATCH",
      body: { statusId },
    });

    setIsUpdating(false);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setTally((current) => ({ ...current, [statusId]: current[statusId] + 1 }));
    setIsFlipped(false);
    setCurrentIndex((current) => current + 1);
  }

  function handleSpeak() {
    if (!("speechSynthesis" in window)) {
      setErrorMessage("このブラウザは音声読み上げに対応していません。");
      return;
    }

    speak(card.content);
  }

  if (sentences.length === 0) {
    return (
      <MessageScreen title="カードがありません">
        条件に合うカードがありません。マイページで英文と日本語訳を登録するか、フィルターを変えてください。
      </MessageScreen>
    );
  }

  if (!card) {
    return (
      <MessageScreen title="お疲れさまでした！">
        <p>{sentences.length}枚のカードをすべて確認しました。</p>
        <ul className="mt-4 flex justify-center gap-4 font-semibold">
          {STATUSES.map((status) => (
            <li key={status.id}>
              {status.label}：{tally[status.id]}枚
            </li>
          ))}
        </ul>
      </MessageScreen>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Button
        variant="danger"
        onClick={() => setIsQuitConfirmOpen(true)}
        className="fixed right-6 top-6 z-40"
      >
        キャンセル
      </Button>

      <div className="w-full max-w-xl">
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <p>
            {currentIndex + 1} / {sentences.length}
          </p>
          <p>{isFlipped ? "日本語訳" : "英文"}</p>
          <Button size="sm" variant="secondary" onClick={handleSpeak}>
            🔊 読み上げ
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped((current) => !current)}
          disabled={isUpdating}
          className="h-80 w-full [perspective:1000px] disabled:cursor-not-allowed"
          aria-label="フラッシュカードを裏返す"
        >
          <div
            className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <section className="absolute inset-0 flex items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg [backface-visibility:hidden]">
              <p className="text-2xl font-semibold leading-relaxed">
                {card.content}
              </p>
            </section>
            <section className="absolute inset-0 flex items-center justify-center rounded-lg bg-indigo-600 p-8 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-2xl font-semibold leading-relaxed text-white">
                {card.translation}
              </p>
            </section>
          </div>
        </button>

        {/* 答えを確認してから評価できるよう、裏返した後にだけボタンを出す */}
        {isFlipped ? (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {STATUSES.map((status) => (
              <button
                key={status.id}
                type="button"
                onClick={() => rate(status.id)}
                disabled={isUpdating}
                className={`rounded-lg px-4 py-3 font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${status.className}`}
              >
                {status.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-6 py-3 text-center text-sm text-slate-500">
            カードをクリック、または Space キーで答えを表示
          </p>
        )}

        {errorMessage && (
          <p className="mt-3 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>

      {isQuitConfirmOpen && (
        <ConfirmModal
          message="マイページに戻りますか？（ここまでの進捗状況は保存されています）"
          confirmLabel="はい"
          cancelLabel="いいえ"
          onConfirm={() => router.push("/mypage")}
          onCancel={() => setIsQuitConfirmOpen(false)}
        />
      )}
    </main>
  );
}
