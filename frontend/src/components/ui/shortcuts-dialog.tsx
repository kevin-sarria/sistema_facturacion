import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { SHORTCUTS } from '../../lib/shortcuts';
import { Keyboard } from 'lucide-react';

interface ShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
              <Keyboard className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                Atajos de Teclado del Mostrador
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500 mt-0.5">
                Usa las teclas de función (F1 - F10) para agilizar la atención a clientes sin tocar el mouse.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Sección Global */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Navegación Rápida (Cualquier Pantalla)
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
              {SHORTCUTS.filter((s) => s.scope === 'global').map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-stone-50 transition-colors text-xs"
                >
                  <div className="pr-3">
                    <p className="font-semibold text-stone-900">{s.label}</p>
                    <p className="text-[11px] text-stone-500">{s.description}</p>
                  </div>
                  <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-stone-700 bg-stone-100 border border-stone-300 rounded-md shadow-2xs shrink-0">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Sección POS */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Punto de Venta / Caja Mostrador
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
              {SHORTCUTS.filter((s) => s.scope === 'pos').map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-stone-50 transition-colors text-xs"
                >
                  <div className="pr-3">
                    <p className="font-semibold text-stone-900">{s.label}</p>
                    <p className="text-[11px] text-stone-500">{s.description}</p>
                  </div>
                  <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-md shadow-2xs shrink-0">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600">
            <strong>Consejo:</strong> La tecla <strong>F5</strong> no se intercepta y conserva la recarga estándar del navegador. Los atajos funcionan incluso si estás escribiendo en una casilla de búsqueda.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
