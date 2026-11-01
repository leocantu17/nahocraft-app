import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen?: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen = true,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-md bg-white shadow-2xl border border-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <h3 id="confirm-dialog-title" className="font-serif text-base">
              Confirmar Acción
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="font-serif text-lg text-neutral-900 font-bold">
            {title}
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer shadow-xs"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
