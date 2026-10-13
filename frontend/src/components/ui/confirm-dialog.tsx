import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title = '¿Confirmar eliminación?',
  description = 'Esta acción es permanente y no se puede deshacer.',
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500 mt-0.5">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="min-h-11 px-4 text-xs font-semibold rounded-xl"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className="min-h-11 px-4 text-xs font-semibold rounded-xl"
          >
            {isLoading ? 'Eliminando...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
