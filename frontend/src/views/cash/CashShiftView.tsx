import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/toast';
import { CashShiftData } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Lock,
  Unlock,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  Coins,
} from 'lucide-react';

export const CashShiftView = () => {
  const [shift, setShift] = useState<CashShiftData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal abrir caja
  const [isOpenModalActive, setIsOpenModalActive] = useState(false);
  const [initialCash, setInitialCash] = useState(50000);
  const [isOpeningShift, setIsOpeningShift] = useState(false);

  // Modal cerrar caja (arqueo)
  const [isCloseModalActive, setIsCloseModalActive] = useState(false);
  const [actualCash, setActualCash] = useState(0);
  const [closeNotes, setCloseNotes] = useState('');
  const [closedResult, setClosedResult] = useState<CashShiftData | null>(null);
  const [isClosingShift, setIsClosingShift] = useState(false);

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  const fetchCurrentShift = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/cash-shift/current');
      if (res.data?.success) {
        setIsOpen(res.data.is_open);
        setShift(res.data.data);
        if (res.data.data) {
          setActualCash(res.data.data.expected_cash);
        }
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al consultar el estado de la caja.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpeningShift(true);
    try {
      const res = await api.post('/cash-shift/open', {
        initial_cash: initialCash,
      });
      if (res.data?.success) {
        setIsOpenModalActive(false);
        toast.success(`Caja abierta con base de ${formatCurrency(initialCash)}.`);
        fetchCurrentShift();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al abrir la caja.';
      toast.error(msg);
    } finally {
      setIsOpeningShift(false);
    }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClosingShift(true);
    try {
      const res = await api.post('/cash-shift/close', {
        actual_cash: actualCash,
        notes: closeNotes,
      });
      if (res.data?.success) {
        setClosedResult(res.data.data);
        setIsCloseModalActive(false);
        toast.success('¡Arqueo y cierre de caja finalizado exitosamente!');
        fetchCurrentShift();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al cerrar la caja y realizar el arqueo.';
      toast.error(msg);
    } finally {
      setIsClosingShift(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto w-full">
      {/* Cabecera */}
      <div className="flex flex-col @2xl:flex-row justify-between items-start @2xl:items-center gap-4 pb-5 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl @2xl:text-2xl font-bold tracking-tight text-stone-900">
              Arqueo de Caja
            </h1>
            <span className="hidden @2xl:inline-block text-[11px] font-mono font-bold bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded">
              F4
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Arqueo de Caja — cuenta el dinero al cerrar el día y verifica ventas
          </p>
        </div>

        <div className="w-full @md:w-auto">
          {isOpen ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsCloseModalActive(true)}
              className="w-full @md:w-auto min-h-11 rounded-xl font-bold text-xs px-4 shadow-sm"
            >
              <Lock className="size-4 mr-1.5" />
              <span>Cuadrar & Cerrar Turno</span>
            </Button>
          ) : (
            <Button
              variant="amber"
              size="sm"
              onClick={() => setIsOpenModalActive(true)}
              className="w-full @md:w-auto min-h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 shadow-sm"
            >
              <Unlock className="size-4 mr-1.5 text-amber-400" />
              <span>Abrir Caja del Día</span>
            </Button>
          )}
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
            onClick={fetchCurrentShift}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>Reintentar consulta de turno</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading && (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <RefreshCw className="size-6 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Verificando estado de caja...</p>
        </div>
      )}

      {/* Estado Actual de la Caja */}
      {!loading && !error && (
        <>
          {isOpen && shift ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-3 @sm:gap-4">
                <div className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs min-w-0">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
                    Base Inicial (Apertura)
                  </span>
                  <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-stone-800 tabular-nums block truncate">
                    {formatCurrency(shift.initial_cash)}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-1 truncate">
                    Abierto: {new Date(shift.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs min-w-0">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
                    Ventas en Efectivo
                  </span>
                  <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-emerald-700 tabular-nums block truncate">
                    {formatCurrency(shift.total_cash_sales)}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-1 truncate">Dinero ingresado al cajón</p>
                </div>

                <div className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs min-w-0">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
                    Ventas Nequi / Tarjetas
                  </span>
                  <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-amber-700 tabular-nums block truncate">
                    {formatCurrency(shift.total_electronic_sales)}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-1 truncate">Pagos electrónicos verificados</p>
                </div>
              </div>

              <div className="bg-stone-900 text-white rounded-3xl p-6 text-center shadow-md">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Efectivo Esperado en el Cajón Físico
                </span>
                <span className="text-[clamp(1.75rem,6cqi,2.5rem)] font-black text-white tracking-tight tabular-nums block truncate">
                  {formatCurrency(shift.expected_cash)}
                </span>
                <p className="text-xs text-stone-400 mt-2">
                  (Base inicial en efectivo + Ventas en efectivo de hoy)
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-xs text-center space-y-4">
              <div className="size-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Lock className="size-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800">La caja se encuentra cerrada</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Para empezar a facturar en el mostrador e ingresar dinero al cajón, abre el turno con tu base de cambio.
                </p>
              </div>
              <Button
                variant="amber"
                onClick={() => setIsOpenModalActive(true)}
                className="min-h-11 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20"
              >
                <Unlock className="size-4 mr-2" />
                <span>Iniciar Turno con Base en Efectivo</span>
              </Button>
            </div>
          )}

          {/* Resultado de arqueo cerrado */}
          {closedResult && (
            <div className="p-6 bg-stone-900 text-white rounded-3xl shadow-xl space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-emerald-400">
                <CheckCircle className="size-5" />
                <span>Arqueo de Caja Finalizado</span>
              </h3>
              <div className="grid grid-cols-1 @md:grid-cols-3 gap-3 text-xs border-t border-stone-800 pt-3">
                <div>
                  <span className="text-stone-400 block">Efectivo Esperado:</span>
                  <strong className="text-sm tabular-nums text-white">
                    {formatCurrency(closedResult.expected_cash)}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Efectivo Contado:</span>
                  <strong className="text-sm tabular-nums text-white">
                    {formatCurrency(closedResult.actual_cash || 0)}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Diferencia:</span>
                  <strong
                    className={`text-sm tabular-nums ${
                      (closedResult.difference || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {(closedResult.difference || 0) === 0
                      ? 'Caja cuadrada exactamente ($0)'
                      : `${(closedResult.difference || 0) > 0 ? 'Sobrante ' : 'Faltante '} ${formatCurrency(Math.abs(closedResult.difference || 0))}`}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL ABRIR CAJA */}
      <Dialog open={isOpenModalActive} onOpenChange={setIsOpenModalActive}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Coins className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-stone-900">
                  Apertura de Caja Diaria
                </DialogTitle>
                <p className="text-xs text-stone-500">
                  Ingresa el saldo de cambio para iniciar el día
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleOpenShift} className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Base Inicial en Efectivo ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={initialCash || ''}
                onChange={(e) => setInitialCash(Number(e.target.value))}
                placeholder="Ej. 50000"
                className="w-full min-h-11 text-xl font-black text-stone-900 border border-stone-300 rounded-xl px-3 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Monedas y billetes dejados en el cajón para dar cambio.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsOpenModalActive(false)}
                className="min-h-11 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                disabled={isOpeningShift}
                className="min-h-11 px-5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20"
              >
                {isOpeningShift ? 'Abriendo Turno...' : 'Confirmar y Abrir Turno'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL CERRAR CAJA / ARQUEO */}
      <Dialog open={isCloseModalActive} onOpenChange={setIsCloseModalActive}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="size-10 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center font-bold shrink-0">
                <Lock className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-stone-900">
                  Arqueo y Cierre de Caja
                </DialogTitle>
                <p className="text-xs text-stone-500">
                  Cuenta los billetes y monedas físicos en el cajón
                </p>
              </div>
            </div>
          </DialogHeader>

          {shift && (
            <form onSubmit={handleCloseShift} className="space-y-4 pt-1">
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 text-xs space-y-1">
                <p>Efectivo esperado por el sistema: <strong className="tabular-nums text-stone-900">{formatCurrency(shift.expected_cash)}</strong></p>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  ¿Cuánto dinero físico contaste en el cajón? ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={actualCash || ''}
                  onChange={(e) => setActualCash(Number(e.target.value))}
                  placeholder="0"
                  className="w-full min-h-11 text-xl font-black text-stone-900 border border-stone-300 rounded-xl px-3 tabular-nums focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              {actualCash > 0 && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    actualCash - shift.expected_cash === 0
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : actualCash - shift.expected_cash > 0
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  Diferencia:{' '}
                  {actualCash - shift.expected_cash === 0
                    ? 'Caja cuadrada exactamente ($0)'
                    : `${actualCash - shift.expected_cash > 0 ? 'Sobra: ' : 'Falta: '} ${formatCurrency(Math.abs(actualCash - shift.expected_cash))}`}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Observaciones de cierre (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Se pagó taxi o insumos menores..."
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCloseModalActive(false)}
                  className="min-h-11 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isClosingShift}
                  className="min-h-11 px-5 font-bold rounded-xl text-xs shadow-md"
                >
                  {isClosingShift ? 'Cerrando Turno...' : 'Finalizar y Guardar Arqueo'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
