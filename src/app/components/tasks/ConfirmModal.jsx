'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  // Allow modal to close with `Esc`
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onCancel) onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {message && <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 active:scale-95 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
