import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/toast';
import { CreditSaleItem } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DollarSign,
  Calendar,
  RefreshCw,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export const Credits = () => {
  const [credits, setCredits] = useState<CreditSaleItem[]>([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal registrar abono
  const [selectedCredit, setSelectedCredit] = useState<CreditSaleItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sales/credits-summary');
      if (res.data?.success) {
        setCredits(res.data.data.credits || []);
        setTotalOwed(res.data.data.total_owed || 0);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al cargar las cuentas por cobrar.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentModal = (credit: CreditSaleItem) => {
    setSelectedCredit(credit);
    setPaymentAmount(credit.balance_due);
    setPaymentNotes('');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCredit || paymentAmount <= 0) return;

    setIsSubmitting(true);

    try {
      const res = await api.post(`/sales/${selectedCredit.id}/payment`, {
        amount: paymentAmount,
        payment_method: paymentMethod,
        notes: paymentNotes,
      });

      if (res.data?.success) {
        toast.success(`¡Abono de ${formatCurrency(paymentAmount)} registrado con éxito!`);
        setSelectedCredit(null);
        fetchCredits();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al registrar el abono del cliente.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Cabecera */}
      <div className="flex flex-col @2xl:flex-row justify-between items-start @2xl:items-center gap-4 pb-5 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl @2xl:text-2xl font-bold tracking-tight text-stone-900">
              Cuaderno de Fiados
            </h1>
            <span className="hidden @2xl:inline-block text-[11px] font-mono font-bold bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded">
              F3
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Fiados — lo que te deben tus clientes y cuentas por cobrar
          </p>
        </div>

        {/* Tarjeta Resumen Total Fiado */}
        <div className="bg-white border border-stone-200/90 rounded-2xl px-4 @sm:px-5 py-3 text-left @2xl:text-right shadow-xs w-full @2xl:w-auto min-w-0">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Total en la Calle por Cobrar
          </span>
          <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-amber-700 tabular-nums block truncate">
            {formatCurrency(totalOwed)}
          </span>
        </div>
      </div>

      {/* Estado de Error con Reintentar */}
      {error && !loading && (
        <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
          <div className="size-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-6" />
          </div>
          <p className="text-sm font-bold text-stone-800">{error}</p>
          <button
            type="button"
            onClick={fetchCredits}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>Reintentar carga de créditos</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading && (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <RefreshCw className="size-6 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Cargando créditos activos...</p>
        </div>
      )}

      {/* Estado Vacío */}
      {!loading && !error && credits.length === 0 && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <BookOpen className="size-6" />
          </div>
          <p className="text-sm font-bold text-stone-800">
            ¡No hay ningún crédito pendiente!
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Todas las cuentas de los clientes están al día. Cuando registres una venta a crédito aparecerá aquí.
          </p>
        </div>
      )}

      {/* Tabla Responsiva con Tarjetas Móviles y Tabla Desktop */}
      {!loading && !error && credits.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          {/* Vista Contenedor Angosto (< @4xl) */}
          <div className="@4xl:hidden divide-y divide-stone-100">
            {credits.map((c) => {
              const isOverdue = c.due_date && new Date(c.due_date) < new Date();
              return (
                <div key={c.id} className="p-4 space-y-3 bg-white hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {c.invoice_number}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(c.created_at).toLocaleDateString('es-CO')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {c.customer ? `${c.customer.name} ${c.customer.last_name || ''}`.trim() : 'Cliente sin nombre'}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                      {c.customer?.phone && <span>Tel: {c.customer.phone}</span>}
                      {c.due_date && (
                        <span className={`flex items-center gap-1 font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-stone-700'}`}>
                          <Calendar className="size-3" />
                          {new Date(c.due_date).toLocaleDateString('es-CO')}
                          {isOverdue && ' (Vencido)'}
                        </span>
                      )}
                    </div>
                    {c.notes && (
                      <p className="text-[11px] text-stone-500 italic mt-1 bg-stone-50 p-2 rounded-lg">
                        {c.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <div>
                      <span className="text-[11px] text-stone-400 block">Total Cuenta:</span>
                      <span className="font-semibold text-stone-600 tabular-nums">
                        {formatCurrency(c.total_amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-400 block">Abonado:</span>
                      <span className="font-semibold text-emerald-700 tabular-nums">
                        {formatCurrency(c.amount_paid)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-stone-400 block">Saldo Deudor:</span>
                      <span className="font-black text-amber-800 text-sm tabular-nums">
                        {formatCurrency(c.balance_due)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenPaymentModal(c)}
                      className="w-full min-h-11 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                    >
                      <DollarSign className="size-4" />
                      <span>Registrar Abono a este Fiado</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista Contenedor Amplio (@4xl:) */}
          <div className="hidden @4xl:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ticket / Fecha</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4">Vencimiento</th>
                  <th className="py-3.5 px-4 text-right">Total Cuenta</th>
                  <th className="py-3.5 px-4 text-right">Abonado</th>
                  <th className="py-3.5 px-4 text-right">Saldo Deudor</th>
                  <th className="py-3.5 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {credits.map((c) => {
                  const isOverdue = c.due_date && new Date(c.due_date) < new Date();
                  return (
                    <tr key={c.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{c.invoice_number}</span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(c.created_at).toLocaleDateString('es-CO')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {c.customer ? `${c.customer.name} ${c.customer.last_name || ''}`.trim() : 'Cliente sin nombre'}
                        {c.notes && (
                          <span className="block text-[11px] font-normal text-stone-500 italic mt-0.5">
                            {c.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {c.customer?.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {c.due_date ? (
                          <span className={`font-semibold flex items-center gap-1 ${isOverdue ? 'text-rose-600 font-bold' : 'text-stone-700'}`}>
                            <Calendar className="size-3.5" />
                            {new Date(c.due_date).toLocaleDateString('es-CO')}
                          </span>
                        ) : (
                          'Sin fecha'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-stone-500 tabular-nums">
                        {formatCurrency(c.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold tabular-nums">
                        {formatCurrency(c.amount_paid)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-amber-800 text-sm tabular-nums">
                        {formatCurrency(c.balance_due)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          variant="amber"
                          size="sm"
                          onClick={() => handleOpenPaymentModal(c)}
                          className="min-h-9 rounded-xl px-3 bg-amber-600 hover:bg-amber-700 text-xs font-bold"
                        >
                          <DollarSign className="size-3.5 mr-1" />
                          <span>Abonar</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR ABONO */}
      <Dialog open={!!selectedCredit} onOpenChange={() => setSelectedCredit(null)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <DollarSign className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-stone-900">
                  Registrar Abono de Fiado
                </DialogTitle>
                <p className="text-xs text-stone-500">
                  Ingresa el dinero recibido para abonar al saldo del cliente
                </p>
              </div>
            </div>
          </DialogHeader>

          {selectedCredit && (
            <form onSubmit={handleSubmitPayment} className="space-y-4 pt-1">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs space-y-1">
                <p><strong>Cliente:</strong> {selectedCredit.customer ? `${selectedCredit.customer.name} ${selectedCredit.customer.last_name || ''}`.trim() : 'Cliente sin nombre'}</p>
                <p><strong>Ticket:</strong> {selectedCredit.invoice_number}</p>
                <p className="text-amber-800 font-bold tabular-nums">
                  <strong>Saldo pendiente:</strong> {formatCurrency(selectedCredit.balance_due)}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Monto a Abonar ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="100"
                  max={selectedCredit.balance_due}
                  required
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full min-h-11 text-lg font-bold text-emerald-700 border border-stone-300 rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Medio de Pago</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`min-h-11 py-2 text-xs font-bold rounded-xl border transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`min-h-11 py-2 text-xs font-bold rounded-xl border transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Nequi / Transferencia
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Comentario (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Abona parte en efectivo..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCredit(null)}
                  className="min-h-11 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  disabled={isSubmitting || paymentAmount <= 0}
                  className="min-h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20"
                >
                  {isSubmitting ? 'Guardando Abono...' : 'Confirmar y Guardar Abono'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
