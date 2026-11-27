import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'error';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  const confirmBtnClass =
    confirmVariant === 'error' ? 'btn btn-error' : 'btn btn-primary';

  return createPortal(
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base-content/80">{message}</p>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={!loading ? onCancel : undefined} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className={confirmBtnClass} onClick={onConfirm} disabled={loading}>
            {loading ? 'Aguarde...' : confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={!loading ? onCancel : undefined} />
    </div>,
    document.body,
  );
}