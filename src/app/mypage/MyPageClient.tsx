"use client";

import { useState } from "react";

import { ConfirmModal } from "@/components/ConfirmModal";
import { useFlashcardSets } from "@/hooks/useFlashcardSets";
import { useSentences } from "@/hooks/useSentences";
import type { FlashcardSet, StudyStats } from "@/types/flashcard";

import { FlashcardSetControls } from "./components/FlashcardSetControls";
import { FlashcardSettingsModal } from "./components/FlashcardSettingsModal";
import { MyPageHeader } from "./components/MyPageHeader";
import { SavedSentenceList } from "./components/SavedSentenceList";
import { SentenceComposer } from "./components/SentenceComposer";

type MyPageClientProps = {
  username: string;
  stats: StudyStats;
  initialSets: FlashcardSet[];
};

export function MyPageClient({
  username,
  stats,
  initialSets,
}: MyPageClientProps) {
  const flashcardSets = useFlashcardSets(initialSets);
  const sentences = useSentences(
    flashcardSets.selectedSetId,
    flashcardSets.changeSentenceCount,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteSetOpen, setIsDeleteSetOpen] = useState(false);

  const { selectedSet } = flashcardSets;

  return (
    <div className="min-h-screen bg-sky-300 p-4 md:p-8">
      <div className="mx-auto w-full max-w-md md:max-w-5xl">
        <MyPageHeader username={username} stats={stats} />

        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-xl bg-white px-10 py-4 text-lg font-bold text-sky-700 shadow-md transition-colors hover:bg-sky-50"
          >
            フラッシュカードへ
          </button>
        </div>

        <div className="rounded-lg border border-sky-100 bg-white p-5 shadow-sm">
          <FlashcardSetControls
            sets={flashcardSets.sets}
            selectedSetId={flashcardSets.selectedSetId}
            onSelectSet={flashcardSets.setSelectedSetId}
            onCreateSet={flashcardSets.createSet}
            notice={flashcardSets.notice}
          />

          <div className="grid gap-6 pt-5 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <SentenceComposer
              onSave={sentences.createSentences}
              canSave={Boolean(selectedSet)}
            />

            {selectedSet && (
              <SavedSentenceList
                set={selectedSet}
                canDeleteSet={flashcardSets.sets.length > 1}
                onRenameSet={(name) =>
                  flashcardSets.renameSet(selectedSet.id, name)
                }
                onRequestDeleteSet={() => setIsDeleteSetOpen(true)}
                sentences={sentences}
              />
            )}
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <FlashcardSettingsModal
          sets={flashcardSets.sets}
          initialSetId={flashcardSets.selectedSetId}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isDeleteSetOpen && selectedSet && (
        <ConfirmModal
          message={`セット「${selectedSet.name}」を削除すると、登録された文章も削除されますがよろしいですか？`}
          onCancel={() => setIsDeleteSetOpen(false)}
          onConfirm={() => {
            setIsDeleteSetOpen(false);
            flashcardSets.deleteSet(selectedSet.id);
          }}
        />
      )}
    </div>
  );
}
