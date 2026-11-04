"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/Button";
import { NoticeText } from "@/components/NoticeText";
import { TextField } from "@/components/TextField";
import { fetchJson } from "@/lib/fetch-json";
import {
  type FieldErrors,
  getFieldErrors,
  updateMeSchema,
} from "@/lib/schemas";
import type { Notice, UserInfo } from "@/types/flashcard";

export function EditMyInfoForm({ user }: { user: UserInfo }) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const form = event.currentTarget;
    const parsed = updateMeSchema.safeParse(
      Object.fromEntries(new FormData(form)),
    );

    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setIsSaving(true);

    const result = await fetchJson("/api/me", {
      method: "PATCH",
      body: parsed.data,
    });

    setIsSaving(false);

    if (!result.ok) {
      setErrors(result.fieldErrors);
      setNotice({ text: result.message, isError: true });
      return;
    }

    // パスワード欄だけ空に戻す
    form.currentPassword.value = "";
    form.newPassword.value = "";
    setNotice({ text: "ユーザー情報を更新しました。", isError: false });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <TextField
        label="ID"
        value={user.id}
        readOnly
        hint="※IDは変更できません"
      />
      <TextField
        label="ユーザー名"
        name="username"
        defaultValue={user.username}
        error={errors.username?.[0]}
      />
      <TextField
        label="メールアドレス"
        name="email"
        type="email"
        defaultValue={user.email}
        error={errors.email?.[0]}
      />
      <TextField
        label="現在のパスワード"
        name="currentPassword"
        type="password"
        placeholder="パスワード変更時のみ入力"
        autoComplete="current-password"
        error={errors.currentPassword?.[0]}
      />
      <TextField
        label="新しいパスワード"
        name="newPassword"
        type="password"
        placeholder="8文字以上"
        autoComplete="new-password"
        error={errors.newPassword?.[0]}
      />

      <NoticeText notice={notice} />

      <div className="mt-2 flex flex-col gap-3 md:flex-row">
        <Button type="submit" disabled={isSaving} className="px-10">
          {isSaving ? "更新中..." : "更新する"}
        </Button>
        <Link
          href="/mypage"
          className="rounded-lg border border-slate-200 bg-white px-10 py-2.5 text-center font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          マイページに戻る
        </Link>
      </div>
    </form>
  );
}
