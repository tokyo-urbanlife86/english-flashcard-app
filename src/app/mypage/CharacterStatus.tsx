import Image from "next/image";

function getCharacterSrc(count: number): string {
  if (count >= 50) return "/img/god.png";
  if (count >= 21) return "/img/queen.png";
  if (count >= 11) return "/img/aristocracy.png";
  if (count >= 5) return "/img/ordinary.png";
  return "/img/poor.png";
}

function getCharacterLevel(count: number): number {
  if (count >= 50) return 5;
  if (count >= 21) return 4;
  if (count >= 11) return 3;
  if (count >= 5) return 2;
  return 1;
}

const levelTitles: Record<number, string> = {
  1: "落ち武者",
  2: "堅牢な戦士",
  3: "地方の貴族",
  4: "王族",
  5: "神",
};

type CharacterStatusProps = {
  /** 過去1ヶ月に暗唱した数（親が /api/sentence-stats から取得済みの値を渡す） */
  count: number;
};

export function CharacterStatus({ count }: CharacterStatusProps) {
  const level = getCharacterLevel(count);

  return (
    <div className="flex select-none items-center gap-4 md:flex-col md:gap-2">
      <p className="cursor-default rounded-lg bg-white/95 px-4 py-2 text-base font-bold text-slate-700 shadow-sm ring-1 ring-sky-100">
        レベル{level}：{levelTitles[level]}
      </p>
      <div className="flex h-36 w-56 items-center justify-center md:h-40 md:w-64">
        <Image
          src={getCharacterSrc(count)}
          alt="キャラクター"
          width={260}
          height={142}
          className="h-auto max-h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
