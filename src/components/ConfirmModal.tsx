"use client";

import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmModalProps = {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  message,
  confirmLabel = "OK",
  cancelLabel = "キャンセル",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onCancel}>
      <p className="text-sm leading-6 text-slate-700">{message}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
