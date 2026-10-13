import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { PackagePlus } from 'lucide-react';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (productData: {
    name: string;
    barcode: string;
    purchase_price: number;
    profit_percentage: number;
    sale_price: number;
    stock: number;
    min_stock: number;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  isSubmitting,
}) => {
  const [form, setForm] = useState({
    name: '',
    barcode: '',
    purchase_price: 0,
    profit_percentage: 30,
    sale_price: 0,
    stock: 0,
    min_stock: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    setForm({
      name: '',
      barcode: '',
      purchase_price: 0,
      profit_percentage: 30,
      sale_price: 0,
      stock: 0,
      min_stock: 5,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <PackagePlus className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                Registrar Producto Individual
              </DialogTitle>
              <p className="text-xs text-stone-500">
                Ingresa los datos para agregar el artículo al inventario
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Nombre del Producto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Bolígrafo BIC Cristal Negro"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full min-h-11 text-xs sm:text-sm border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Código de Barras (opcional)
            </label>
            <input
              type="text"
              placeholder="Escanee o escriba el código..."
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Precio Compra (Costo)
              </label>
              <input
                type="number"
                min="0"
                value={form.purchase_price || ''}
                onChange={(e) => {
                  const cost = Number(e.target.value);
                  const margin = form.profit_percentage;
                  const sale = Math.round(cost * (1 + margin / 100));
                  setForm({ ...form, purchase_price: cost, sale_price: sale });
                }}
                placeholder="0"
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Precio Venta Público <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.sale_price || ''}
                onChange={(e) => setForm({ ...form, sale_price: Number(e.target.value) })}
                placeholder="0"
                className="w-full min-h-11 text-xs font-bold text-emerald-700 border border-stone-300 rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Cantidad Inicial (Stock)
              </label>
              <input
                type="number"
                min="0"
                value={form.stock || ''}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                placeholder="0"
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Stock Mínimo (Alerta)
              </label>
              <input
                type="number"
                min="0"
                value={form.min_stock || ''}
                onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })}
                placeholder="5"
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 tabular-nums"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-h-11 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 px-5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar en Catálogo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
