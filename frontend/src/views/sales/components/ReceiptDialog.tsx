import React from 'react';
import { formatCurrency } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
} from '../../../components/ui/dialog';
import { CheckCircle, Printer, Plus } from 'lucide-react';

interface ReceiptDialogProps {
  sale: any | null;
  onClose: () => void;
}

export const ReceiptDialog: React.FC<ReceiptDialogProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  return (
    <Dialog open={!!sale} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center p-6">
        <div className="mx-auto size-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
          <CheckCircle className="size-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900">¡Venta Registrada con Éxito!</h3>
        <p className="text-xs text-stone-500 mb-4">
          Comprobante: <strong>{sale.invoice_number}</strong>
        </p>

        {/* Simulación de Ticket Térmico (80mm) */}
        <div className="p-4 bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-left text-xs space-y-1 font-mono">
          <p className="font-bold text-center text-stone-900">PAPELERÍA UNIVERSAL</p>
          <p className="text-center text-stone-400 text-[10px]">Nit: 900.000.000-1</p>
          <div className="border-b border-dashed border-stone-300 my-2" />
          <p>Fecha: {new Date().toLocaleDateString('es-CO')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p>
            Cliente:{' '}
            {sale.customer
              ? `${sale.customer.name} ${sale.customer.last_name || ''}`.trim()
              : 'Consumidor Final'}
          </p>
          <div className="border-b border-dashed border-stone-300 my-2" />
          {sale.items?.map((it: any) => (
            <div key={it.id} className="flex justify-between">
              <span className="truncate pr-2">{it.quantity}x {it.product_name}</span>
              <span className="tabular-nums shrink-0">{formatCurrency(it.subtotal)}</span>
            </div>
          ))}
          <div className="border-b border-dashed border-stone-300 my-2" />
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL:</span>
            <span className="tabular-nums">{formatCurrency(sale.total_amount)}</span>
          </div>
          {sale.payment_type === 'cash' ? (
            <>
              <div className="flex justify-between text-stone-500">
                <span>Recibido:</span>
                <span className="tabular-nums">{formatCurrency(sale.amount_paid)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Cambio:</span>
                <span className="tabular-nums">{formatCurrency(sale.change_given)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between font-bold text-amber-700">
              <span>Saldo Pendiente:</span>
              <span className="tabular-nums">{formatCurrency(sale.balance_due)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => window.print()}
            className="flex-1 min-h-11 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
          >
            <Printer className="size-4 mr-1.5" />
            <span>Imprimir Ticket</span>
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 min-h-11 py-2.5 rounded-xl text-xs font-bold"
          >
            <Plus className="size-4 mr-1.5" />
            <span>Nueva Venta</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
