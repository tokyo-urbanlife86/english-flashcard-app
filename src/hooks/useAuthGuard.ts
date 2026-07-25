"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { StudyStats, UserInfo } from "@/types/flashcard";

/**
 * ログイン状態を確認し、未ログインなら /signin へ誘導する。
 * あわせて学習統計（暗唱数）も取得する。他ページでも使い回せる。
 */
export function useAuthGuard() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<StudyStats>({
    monthlyCount: 0,
    totalCount: 0,
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      try {
        // /api/me と /api/characters は互いに独立なので並列に取得する。
        const [meResponse, statsResponse] = await Promise.all([
          fetch("/api/me"),
          fetch("/api/characters"),
        ]);

        if (ignore) return;

        if (!meResponse.ok) {
          router.replace("/signin");
          return;
        }

        const meData = await meResponse.json();
        setUser(meData.user);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();

          setStats({
            monthlyCount: Number(statsData.monthlyCount ?? statsData.count ?? 0),
            totalCount: Number(statsData.totalCount ?? 0),
          });
        }
      } catch {
        if (!ignore) {
          router.replace("/signin");
        }
      } finally {
        if (!ignore) {
          setIsCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      ignore = true;
    };
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/signin");
  }, [router]);

  return { user, stats, isCheckingAuth, logout };
}
