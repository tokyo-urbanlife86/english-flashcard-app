import Image from "next/image";

import { LEVELS } from "@/lib/constants";

type CharacterStatusProps = {
  /** 過去1ヶ月に覚えた数 */
  count: number;
};

export function CharacterStatus({ count }: CharacterStatusProps) {
  // LEVELS は min の小さい順なので、条件を満たす最後のものが現在のレベル
  const levelIndex = LEVELS.findLastIndex((level) => count >= level.min);
  const level = LEVELS[levelIndex];
  const nextLevel = LEVELS[levelIndex + 1];

  return (
    <div className="flex select-none items-center gap-4 md:flex-col md:gap-2">
      <div className="rounded-lg bg-white/95 px-4 py-2 text-center shadow-sm ring-1 ring-sky-100">
        <p className="text-base font-bold text-slate-700">
          レベル{levelIndex + 1}：{level.title}
        </p>
        <p className="text-xs text-slate-500">
          {nextLevel
            ? `次のレベルまであと${nextLevel.min - count}枚`
            : "最高レベルです！"}
        </p>
      </div>
      <div className="flex h-36 w-56 items-center justify-center md:h-40 md:w-64">
        <Image
          src={level.image}
          alt={level.title}
          width={260}
          height={142}
          className="h-auto max-h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
