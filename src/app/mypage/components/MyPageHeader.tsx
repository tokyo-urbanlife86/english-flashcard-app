"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { StudyStats } from "@/types/flashcard";

import { CharacterStatus } from "./CharacterStatus";

type MyPageHeaderProps = {
  username: string;
  stats: StudyStats;
};

export function MyPageHeader({ username, stats }: MyPageHeaderProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/signin");
  }

  return (
    <div className="mb-6 flex select-none flex-col gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-start">
      <div>
        <h1 className="text-2xl font-bold text-sky-900">マイページ</h1>
        <p className="mt-2 text-sm text-sky-800">{username}さん</p>
        <Link
          href="/editmyinfo"
          className="mt-3 inline-flex rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm transition-colors hover:bg-sky-50"
        >
          アカウント
        </Link>
        <dl className="mt-4 space-y-1 text-sky-800">
          <div className="flex items-baseline gap-1">
            <dt>1ヶ月以内に暗唱した数：</dt>
            <dd className="text-xl font-bold leading-none text-sky-900">
              {stats.monthlyCount}
            </dd>
          </div>
          <div className="flex items-baseline gap-1">
            <dt>これまでに暗唱した数：</dt>
            <dd className="text-xl font-bold leading-none text-sky-900">
              {stats.totalCount}
            </dd>
          </div>
        </dl>
      </div>

      <CharacterStatus count={stats.monthlyCount} />

      <div className="flex justify-start md:justify-end">
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-sky-700"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
