"use client";

import Link from "next/link";

import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { signinSchema } from "@/lib/schemas";

import { useAuthForm } from "../useAuthForm";

export default function SigninPage() {
  const { errors, message, isSubmitting, handleSubmit } = useAuthForm(
    signinSchema,
    "/api/signin",
  );

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-bold">ようこそ</h1>
        <p className="text-sm text-slate-500">
          ログインして学習を再開しましょう。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          label="ID"
          name="id"
          placeholder="あなたのIDを入力"
          autoComplete="username"
          error={errors.id?.[0]}
        />
        <TextField
          label="パスワード"
          name="password"
          type="password"
          placeholder="パスワードを入力"
          autoComplete="current-password"
          error={errors.password?.[0]}
        />

        {message && <p className="text-sm text-red-500">{message}</p>}

        <Button type="submit" disabled={isSubmitting} className="mt-2 py-3.5">
          {isSubmitting ? "ログイン中..." : "ログインする"}
        </Button>

        <p className="mt-4 text-center text-xs text-slate-400">
          アカウントをお持ちでない方
        </p>
        <Link
          href="/signup"
          className="block rounded-lg border border-sky-100 bg-sky-50 py-3 text-center text-sm font-bold text-sky-700 transition-colors hover:bg-sky-100"
        >
          新しくアカウントを作る
        </Link>
      </form>
    </>
  );
}
