import React from 'react';
import { formatCurrency } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { CheckCircle, DollarSign, Wallet } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  change: number;
  balanceDue: number;
  paymentType: 'cash' | 'credit';
  paymentMethod: 'cash' | 'transfer' | 'card';
  onPaymentMethodChange: (method: 'cash' | 'transfer' | 'card') => void;
  amountPaid: number;
  onAmountPaidChange: (amount: number) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  isSubmitting: boolean;
  errorMessage: string;
  onConfirmSale: () => void;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  total,
  change,
  balanceDue,
  paymentType,
  paymentMethod,
  onPaymentMethodChange,
  amountPaid,
  onAmountPaidChange,
  notes,
  onNotesChange,
  isSubmitting,
  errorMessage,
  onConfirmSale,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Wallet className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                {paymentType === 'credit' ? 'Registrar Venta a Crédito (Fiado)' : 'Finalizar y Cobrar Venta'}
              </DialogTitle>
              <p className="text-xs text-stone-500">
                {paymentType === 'credit'
                  ? 'Registra el abono inicial si aplica'
                  : 'Ingresa el monto recibido para calcular el cambio'}
              </p>
            </div>
          </div>
        </DialogHeader>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4 pt-1">
          {/* Total Destacado */}
          <div className="flex justify-between items-center py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-stone-600 text-xs font-semibold">Total a Cobrar:</span>
            <span className="text-2xl font-black text-stone-900 tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Medio de Pago */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Medio de Pago Recibido
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'Efectivo' },
                { id: 'transfer', label: 'Nequi / Davi' },
                { id: 'card', label: 'Tarjeta' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPaymentMethodChange(m.id as any)}
                  className={`min-h-11 py-2 text-xs font-bold rounded-xl border transition-all ${
                    paymentMethod === m.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Con cuánto paga el cliente */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              {paymentType === 'credit'
                ? 'Abono inicial del cliente ($0 si no abona nada):'
                : '¿Con cuánto dinero paga el cliente?'}
            </label>
            <div className="relative">
              <DollarSign className="size-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="0"
                value={amountPaid || ''}
                onChange={(e) => onAmountPaidChange(Number(e.target.value))}
                placeholder="Ej. 20000"
                className="w-full min-h-11 text-lg font-bold text-stone-900 border border-stone-300 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>
          </div>

          {/* Cálculo de Vueltas / Saldo Deudor */}
          {paymentType === 'cash' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Cambio / Vueltas al Cliente
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 tabular-nums">
                {formatCurrency(change)}
              </span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Saldo que queda debiendo el cliente
              </span>
              <span className="text-2xl font-black text-amber-900 tabular-nums">
                {formatCurrency(balanceDue)}
              </span>
            </div>
          )}

          {/* Nota Opcional */}
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">
              Nota o detalle (opcional):
            </label>
            <input
              type="text"
              placeholder="Ej. Estudiante, entrega de recibo..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {/* Botón de Confirmación Principal */}
          <Button
            onClick={onConfirmSale}
            disabled={isSubmitting}
            className="w-full min-h-12 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-700/20"
          >
            <CheckCircle className="size-4 mr-2" />
            <span>{isSubmitting ? 'Procesando venta...' : 'Confirmar e Imprimir Recibo'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
