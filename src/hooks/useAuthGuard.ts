"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { StudyStats, UserInfo } from "@/types/flashcard";

type UseAuthGuardOptions = {
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string | null;
  loadStats?: boolean;
};

/**
 * ログイン状態を確認し、指定に応じてリダイレクトする。
 * デフォルトでは未ログインなら /signin へ誘導し、学習統計も取得する。
 */
export function useAuthGuard({
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo = "/signin",
  loadStats = true,
}: UseAuthGuardOptions = {}) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<StudyStats>({
    monthlyCount: 0,
    totalCount: 0,
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      try {
        const [meResponse, statsResponse] = await Promise.all([
          fetch("/api/me"),
          loadStats ? fetch("/api/sentence-stats") : Promise.resolve(null),
        ]);

        if (ignore) return;

        if (!meResponse.ok) {
          if (redirectUnauthenticatedTo) {
            setIsRedirecting(true);
            router.replace(redirectUnauthenticatedTo);
          }
          return;
        }

        const meData = await meResponse.json();

        if (redirectAuthenticatedTo) {
          setIsRedirecting(true);
          router.replace(redirectAuthenticatedTo);
          return;
        }

        setUser(meData.user);

        if (statsResponse?.ok) {
          const statsData = await statsResponse.json();

          setStats({
            monthlyCount: Number(
              statsData.monthlyCount ?? statsData.count ?? 0,
            ),
            totalCount: Number(statsData.totalCount ?? 0),
          });
        }
      } catch {
        if (!ignore && redirectUnauthenticatedTo) {
          setIsRedirecting(true);
          router.replace(redirectUnauthenticatedTo);
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
  }, [loadStats, redirectAuthenticatedTo, redirectUnauthenticatedTo, router]);

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/signin");
  }, [router]);

  return {
    user,
    stats,
    isCheckingAuth: isCheckingAuth || isRedirecting,
    logout,
  };
}
