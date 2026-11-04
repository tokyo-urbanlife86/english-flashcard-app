"use client";

import { useEffect, useRef } from "react";

type ModalProps = {
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
};

/**
 * ネイティブの <dialog> を使ったモーダル。
 * Esc キーで閉じる・フォーカス移動・背面の操作無効化はブラウザが行う。
 */
export function Modal({
  onClose,
  className = "max-w-sm",
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // 背景（dialog 自身）をクリックしたときだけ閉じる
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={`m-auto w-full rounded-lg bg-white shadow-xl backdrop:bg-slate-950/50 ${className}`}
    >
      <div className="p-6">{children}</div>
    </dialog>
  );
}
