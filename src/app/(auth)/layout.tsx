/** ログイン・新規登録ページ共通のカード枠。 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        {children}
      </div>
    </div>
  );
}
