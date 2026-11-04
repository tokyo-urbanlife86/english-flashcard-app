"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";

import { fetchJson } from "@/lib/fetch-json";
import { type FieldErrors, getFieldErrors } from "@/lib/schemas";

/** フォームの値をスキーマで検証して API に送り、成功したらマイページへ移動する。 */
export function useAuthForm(schema: z.ZodType, url: string) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const result = await fetchJson(url, { method: "POST", body: parsed.data });

    if (!result.ok) {
      setErrors(result.fieldErrors);
      setMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/mypage");
  }

  return { errors, message, isSubmitting, handleSubmit };
}
