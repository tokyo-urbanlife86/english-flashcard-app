import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "外国語暗唱アプリ",
  description: "暗唱文をフラッシュカードで覚える学習アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
