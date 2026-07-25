import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button.js';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmVariant?: 'primary' | 'destructive' | 'secondary';
  isLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  isLoading = false,
}) => {
  // Prevent background scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-slate-950/80"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>

            {/* Body */}
            {children && <div className="my-4">{children}</div>}

            {/* Footer / Actions */}
            {(confirmText || cancelText) && (
              <div className="mt-6 flex justify-end gap-3">
                {cancelText && (
                  <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    {cancelText}
                  </Button>
                )}
                {confirmText && onConfirm && (
                  <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                    isLoading={isLoading}
                  >
                    {confirmText}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
