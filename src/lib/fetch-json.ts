import type { FieldErrors } from "@/lib/schemas";

type FetchJsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors: FieldErrors };

/**
 * クライアントから API を呼ぶ共通関数。
 * 401 のときはログイン画面へ移動し、失敗時は表示用のメッセージを返す。
 */
export async function fetchJson<T>(
  url: string,
  options: { method?: string; body?: unknown } = {},
): Promise<FetchJsonResult<T>> {
  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers:
        options.body === undefined
          ? undefined
          : { "Content-Type": "application/json" },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const data = await response.json().catch(() => ({}));

    // ログイン画面での認証失敗は、そのままエラーメッセージを表示する
    if (response.status === 401 && window.location.pathname !== "/signin") {
      window.location.assign("/signin");
    }

    if (!response.ok) {
      return {
        ok: false,
        message: data.message ?? "処理に失敗しました。",
        fieldErrors: data.fieldErrors ?? {},
      };
    }

    return { ok: true, data };
  } catch {
    return {
      ok: false,
      message: "通信に失敗しました。時間をおいてもう一度試してください。",
      fieldErrors: {},
    };
  }
}
