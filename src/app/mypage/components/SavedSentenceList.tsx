import { NoticeText } from "@/components/NoticeText";
import type { useSentences } from "@/hooks/useSentences";
import type { FlashcardSet } from "@/types/flashcard";

import { EditableSetName } from "./EditableSetName";
import { SavedSentenceItem } from "./SavedSentenceItem";

type SavedSentenceListProps = {
  set: FlashcardSet;
  canDeleteSet: boolean;
  onRenameSet: (name: string) => void;
  onRequestDeleteSet: () => void;
  sentences: ReturnType<typeof useSentences>;
};

export function SavedSentenceList({
  set,
  canDeleteSet,
  onRenameSet,
  onRequestDeleteSet,
  sentences,
}: SavedSentenceListProps) {
  return (
    <section className="border-t border-slate-100 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
      <div className="mb-4 flex items-center gap-2">
        <EditableSetName name={set.name} onRename={onRenameSet} />
        <p className="shrink-0 text-sm font-semibold text-sky-600">
          {set.sentenceCount}件
        </p>
        <button
          type="button"
          onClick={onRequestDeleteSet}
          disabled={!canDeleteSet}
          title={canDeleteSet ? undefined : "最後のセットは削除できません"}
          className="shrink-0 rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          セット削除
        </button>
      </div>

      <div className="mb-3">
        <NoticeText notice={sentences.notice} />
      </div>

      {sentences.isLoading ? (
        <p className="text-sm text-slate-500">読み込み中...</p>
      ) : sentences.sentences.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm leading-6 text-slate-500">
          このセットにはまだカードがありません。
        </p>
      ) : (
        <ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {sentences.sentences.map((sentence) => (
            <SavedSentenceItem
              key={sentence.id}
              sentence={sentence}
              onUpdate={sentences.updateSentence}
              onDelete={sentences.deleteSentence}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
