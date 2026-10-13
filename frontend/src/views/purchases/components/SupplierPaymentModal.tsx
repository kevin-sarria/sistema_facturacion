import React, { useState, useEffect } from 'react';
import { PurchaseRecord } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { DollarSign } from 'lucide-react';

interface SupplierPaymentModalProps {
  purchase: PurchaseRecord | null;
  onClose: () => void;
  onSubmitPayment: (data: {
    amount: number;
    payment_date: string;
    payment_method: 'transfer' | 'cash' | 'check';
    reference: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const SupplierPaymentModal: React.FC<SupplierPaymentModalProps> = ({
  purchase,
  onClose,
  onSubmitPayment,
  isSubmitting,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<'transfer' | 'cash' | 'check'>('transfer');
  const [reference, setReference] = useState<string>('');

  useEffect(() => {
    if (purchase) {
      setAmount(purchase.balance_due);
      setReference('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [purchase]);

  if (!purchase) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    await onSubmitPayment({
      amount,
      payment_date: date,
      payment_method: method,
      reference,
    });
  };

  return (
    <Dialog open={!!purchase} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <DollarSign className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                Abonar a Factura de Proveedor
              </DialogTitle>
              <p className="text-xs text-stone-500">
                Registra el pago realizado al distribuidor
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs space-y-1">
            <p><strong>Proveedor:</strong> {purchase.supplier?.name}</p>
            <p><strong>Factura:</strong> {purchase.invoice_number}</p>
            <p className="text-rose-700 font-bold tabular-nums">
              <strong>Saldo pendiente:</strong> {formatCurrency(purchase.balance_due)}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Monto a Pagar ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="100"
              max={purchase.balance_due}
              required
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full min-h-11 text-lg font-bold text-rose-700 border border-stone-300 rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 tabular-nums"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Fecha de Pago</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Medio de Pago</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
              >
                <option value="transfer">Transferencia / Nequi</option>
                <option value="cash">Efectivo</option>
                <option value="check">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Comprobante / Referencia
            </label>
            <input
              type="text"
              placeholder="Ej. Transferencia Bancolombia #8921"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="min-h-11 px-5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              {isSubmitting ? 'Guardando Pago...' : 'Confirmar Pago a Proveedor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
