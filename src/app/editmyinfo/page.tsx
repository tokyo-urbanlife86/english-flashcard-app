import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

import { EditMyInfoForm } from "./EditMyInfoForm";

export default async function EditMyInfoPage() {
  const userId = await getCurrentUserId();
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, email: true },
      })
    : null;

  if (!user) redirect("/signin");

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:max-w-2xl md:p-8">
        <h1 className="mb-8 border-b border-slate-100 pb-4 text-xl font-bold">
          ユーザー情報編集
        </h1>
        <EditMyInfoForm user={user} />
      </div>
    </div>
  );
}
