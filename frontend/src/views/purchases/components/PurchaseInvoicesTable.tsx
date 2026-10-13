import React from 'react';
import { PurchaseRecord } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { DollarSign, FileText, Calendar } from 'lucide-react';

interface PurchaseInvoicesTableProps {
  purchases: PurchaseRecord[];
  onOpenPaymentModal: (purchase: PurchaseRecord) => void;
  onNewInvoice: () => void;
}

export const PurchaseInvoicesTable: React.FC<PurchaseInvoicesTableProps> = ({
  purchases,
  onOpenPaymentModal,
  onNewInvoice,
}) => {
  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-3">
        <div className="size-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <FileText className="size-6" />
        </div>
        <p className="text-sm font-bold text-stone-800">
          No hay facturas de compra registradas
        </p>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Registra las facturas de mercancía recibida para llevar el control de tus deudas a distribuidores.
        </p>
        <Button
          onClick={onNewInvoice}
          className="mt-2 min-h-11 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
        >
          Ingresar Primera Factura
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Vista Contenedor Angosto (< @4xl): Tarjetas Responsivas */}
      <div className="@4xl:hidden divide-y divide-stone-100">
        {purchases.map((p) => {
          const isPending = p.payment_status !== 'paid';
          return (
            <div key={p.id} className="p-4 space-y-3 bg-white hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                  {p.invoice_number}
                </span>
                {p.payment_status === 'paid' ? (
                  <Badge variant="success">Pagada</Badge>
                ) : p.payment_status === 'partial' ? (
                  <Badge variant="warning">Abonada</Badge>
                ) : (
                  <Badge variant="danger">Pendiente</Badge>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900">{p.supplier?.name || 'Proveedor'}</h4>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span>Fecha: {new Date(p.purchase_date).toLocaleDateString('es-CO')}</span>
                  {p.due_date && (
                    <span className="flex items-center gap-1 font-semibold text-stone-700">
                      <Calendar className="size-3" />
                      {new Date(p.due_date).toLocaleDateString('es-CO')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-[11px] text-stone-400 block">Total Factura:</span>
                  <span className="font-semibold text-stone-700 tabular-nums">
                    {formatCurrency(p.total_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">Abonado:</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">
                    {formatCurrency(p.paid_amount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Saldo Debemos:</span>
                  <span className="font-black text-rose-600 text-sm tabular-nums">
                    {formatCurrency(p.balance_due)}
                  </span>
                </div>
              </div>

              {isPending && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenPaymentModal(p)}
                    className="w-full min-h-11 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                  >
                    <DollarSign className="size-4 text-amber-400" />
                    <span>Abonar a esta Factura</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vista Contenedor Amplio (@4xl:): Tabla Tradicional */}
      <div className="hidden @4xl:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Factura No.</th>
              <th className="py-3.5 px-4">Proveedor</th>
              <th className="py-3.5 px-4">Fecha Factura</th>
              <th className="py-3.5 px-4">Vencimiento</th>
              <th className="py-3.5 px-4 text-right">Total Factura</th>
              <th className="py-3.5 px-4 text-right">Pagado</th>
              <th className="py-3.5 px-4 text-right">Saldo Debemos</th>
              <th className="py-3.5 px-4 text-center">Estado</th>
              <th className="py-3.5 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {purchases.map((p) => {
              const isPending = p.payment_status !== 'paid';
              return (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    {p.invoice_number}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-800">
                    {p.supplier?.name}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {new Date(p.purchase_date).toLocaleDateString('es-CO')}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.due_date ? (
                      <span className="font-semibold text-stone-700">
                        {new Date(p.due_date).toLocaleDateString('es-CO')}
                      </span>
                    ) : (
                      'Contado'
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right text-stone-500 tabular-nums">
                    {formatCurrency(p.total_amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold tabular-nums">
                    {formatCurrency(p.paid_amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-rose-600 text-sm tabular-nums">
                    {formatCurrency(p.balance_due)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {p.payment_status === 'paid' ? (
                      <Badge variant="success">Pagada</Badge>
                    ) : p.payment_status === 'partial' ? (
                      <Badge variant="warning">Abonada</Badge>
                    ) : (
                      <Badge variant="danger">Pendiente</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {isPending && (
                      <Button
                        size="sm"
                        onClick={() => onOpenPaymentModal(p)}
                        className="min-h-9 rounded-xl px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
                      >
                        Abonar
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
