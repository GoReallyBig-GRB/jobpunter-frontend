import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ActionConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">{title}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">User Confirmation Required</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">
          {description}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 rounded-lg border border-zinc-300 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer shadow-xs ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-700' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
