"use client";

import Link from "next/link";

import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { signupSchema } from "@/lib/schemas";

import { useAuthForm } from "../useAuthForm";

export default function SignupPage() {
  const { errors, message, isSubmitting, handleSubmit } = useAuthForm(
    signupSchema,
    "/api/signup",
  );

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-bold">新規登録</h1>
        <p className="text-sm text-slate-500">
          アカウントを作成して、暗唱学習を始めましょう！
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          label="ID"
          name="id"
          placeholder="英数字8文字以上"
          autoComplete="username"
          error={errors.id?.[0]}
        />
        <TextField
          label="ユーザー名"
          name="username"
          placeholder="表示名（15文字以内・あとで変更可能）"
          error={errors.username?.[0]}
        />
        <TextField
          label="メールアドレス"
          name="email"
          type="email"
          placeholder="example@mail.com"
          autoComplete="email"
          error={errors.email?.[0]}
        />
        <TextField
          label="パスワード"
          name="password"
          type="password"
          placeholder="8文字以上"
          autoComplete="new-password"
          error={errors.password?.[0]}
        />

        {message && <p className="text-sm text-red-500">{message}</p>}

        <Button type="submit" disabled={isSubmitting} className="mt-2 py-3.5">
          {isSubmitting ? "登録中..." : "新規登録する"}
        </Button>

        <Link
          href="/signin"
          className="py-2 text-center text-sm font-medium text-slate-400 transition-colors hover:text-sky-600"
        >
          すでにアカウントをお持ちの方はこちら
        </Link>
      </form>
    </>
  );
}
