import React, { useState } from 'react';
import { CartItem } from '../../../stores/usePosStore';
import { formatCurrency } from '../../../lib/utils';
import { ShoppingBag, Plus, Minus, Trash2, Search } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/confirm-dialog';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onFocusSearch: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onFocusSearch,
}) => {
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  return (
    <>
      <ConfirmDialog
        open={isConfirmClearOpen}
        onOpenChange={setIsConfirmClearOpen}
        title="¿Vaciar la venta actual?"
        description="Se eliminarán todos los artículos agregados al carrito de compra."
        confirmText="Sí, vaciar venta"
        cancelText="Continuar cobro"
        onConfirm={() => {
          onClearCart();
          setIsConfirmClearOpen(false);
        }}
      />

      <div className="@container flex-1 p-3 sm:p-5 overflow-y-auto min-w-0">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 py-12 sm:py-20 text-center">
            <div className="p-4 rounded-3xl bg-stone-100 mb-3 text-stone-300">
              <ShoppingBag className="size-10 stroke-1" />
            </div>
            <p className="text-sm font-bold text-stone-700">Aún no hay productos en la venta</p>
            <p className="text-xs text-stone-400 mt-1 max-w-xs">
              Pasa el lector de código de barras o usa el buscador de productos
            </p>
            <button
              type="button"
              onClick={onFocusSearch}
              className="mt-4 min-h-11 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Search className="size-4 text-amber-400" />
              <span>Buscar producto (F8)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 min-w-0">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 sm:p-3.5 rounded-2xl border border-stone-200/80 bg-white hover:bg-stone-50/60 transition-colors shadow-2xs space-y-2 @sm:space-y-0 @sm:flex @sm:items-center @sm:justify-between min-w-0"
              >
                {/* Detalle del producto */}
                <div className="flex items-start justify-between @sm:flex-1 @sm:pr-3 min-w-0">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-xs sm:text-sm text-stone-900 leading-snug line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {formatCurrency(item.unit_price)}{' '}
                      {item.product.presentation ? `· ${item.product.presentation.name}` : ''}
                    </p>
                  </div>
                  {/* Botón borrar en vista estrecha */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="@sm:hidden min-h-11 min-w-11 flex items-center justify-center text-stone-400 hover:text-rose-600 transition-colors -mr-1 -mt-1 shrink-0"
                    title="Quitar"
                    aria-label={`Quitar ${item.product.name}`}
                  >
                    <Trash2 className="size-4.5" />
                  </button>
                </div>

                {/* Controles y Total */}
                <div className="flex items-center justify-between @sm:justify-end gap-3 sm:gap-4 pt-1.5 @sm:pt-0 border-t border-stone-100 @sm:border-0 min-w-0">
                  {/* Controles de cantidad táctiles >= 44px */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="size-10 @sm:size-9 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center active:scale-95 transition-all shadow-2xs"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-9 @sm:w-8 text-center font-black text-stone-900 text-xs sm:text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="size-10 @sm:size-9 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center active:scale-95 transition-all shadow-2xs"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  {/* Subtotal y Borrar (Vista amplia) */}
                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-900 text-right text-xs sm:text-sm tabular-nums min-w-[75px]">
                      {formatCurrency(item.subtotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="hidden @sm:flex min-h-10 min-w-10 items-center justify-center text-stone-300 hover:text-rose-600 transition-colors rounded-lg"
                      title="Quitar de la lista"
                      aria-label={`Quitar ${item.product.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pie del Carrito */}
      {items.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-stone-200/80 bg-stone-50/80 flex flex-wrap items-center justify-between gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setIsConfirmClearOpen(true)}
            className="min-h-11 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Trash2 className="size-4" />
            <span>Vaciar / Cancelar Venta</span>
          </button>
          <span className="text-xs text-stone-500 font-medium">
            Total Artículos:{' '}
            <strong className="text-stone-900 font-bold tabular-nums">
              {items.reduce((a, b) => a + b.quantity, 0)}
            </strong>
          </span>
        </div>
      )}
    </>
  );
};
