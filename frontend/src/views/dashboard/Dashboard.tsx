import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { formatCurrency } from '../../lib/utils';
import { toast } from '../../components/ui/toast';
import {
  DashboardSalesSummary,
  DashboardCreditsSummary,
  RecentSaleRecord,
} from '../../types';
import {
  ShoppingCart,
  BookOpen,
  Coins,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Package,
} from 'lucide-react';

interface LowStockItem {
  id: number;
  name: string;
  stock: number;
  min_stock: number;
}

export const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSalesSummary | null>(null);
  const [creditsSummary, setCreditsSummary] = useState<DashboardCreditsSummary | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockItem[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSaleRecord[]>([]);
  const [cashShift, setCashShift] = useState<{ is_open: boolean; shift?: { starting_amount: number; opened_at: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resSummary, resCredits, resProducts, resSales, resShift] = await Promise.all([
        api.get('/sales/summary-today'),
        api.get('/sales/credits-summary'),
        api.get('/products?low_stock=true&limit=5'),
        api.get('/sales?limit=6'),
        api.get('/cash-shift/current'),
      ]);

      if (resSummary.data?.success) setSummary(resSummary.data.data);
      if (resCredits.data?.success) setCreditsSummary(resCredits.data.data);
      if (resProducts.data?.success) setLowStockProducts(resProducts.data.data.data || []);
      if (resSales.data?.success) setRecentSales(resSales.data.data.data || []);
      if (resShift.data?.success) setCashShift(resShift.data);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al cargar las métricas del mostrador.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Cabecera Principal */}
      <div className="flex flex-col @2xl:flex-row @2xl:items-center @2xl:justify-between gap-4 pb-5 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl @2xl:text-2xl font-bold tracking-tight text-stone-900">
              Resumen General
            </h1>
            <span className="hidden @2xl:inline-block text-[11px] font-mono font-bold bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded">
              F7
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 capitalize font-medium">
            {todayFormatted} · Cifras operativas y estado de caja al instante
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full @md:w-auto">
          <Link
            to="/dashboard/caja"
            className="min-h-11 px-4 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors shadow-2xs inline-flex items-center gap-2"
          >
            <Coins className="size-4 text-stone-600" />
            <span>Arqueo de Caja</span>
          </Link>
          <Link
            to="/dashboard/pos"
            className="min-h-11 px-4 sm:px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 active:scale-95 rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
          >
            <ShoppingCart className="size-4 text-amber-400" />
            <span>Cobrar en Mostrador (F1)</span>
          </Link>
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
            onClick={fetchDashboardData}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>Reintentar carga de métricas</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading && (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <RefreshCw className="size-6 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Calculando ventas y resumen operativo...</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Métrica Principal Hero: Ventas de Hoy */}
          <div className="bg-stone-900 text-white rounded-3xl p-5 @sm:p-7 shadow-md border border-stone-800 flex flex-col @2xl:flex-row @2xl:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="size-4" />
                Métrica Principal · Ventas Facturadas Hoy
              </span>
              <div className="pt-1">
                <span className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums block">
                  {formatCurrency(summary?.total_amount || 0)}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium pt-1">
                {summary?.sales_count || 0} {summary?.sales_count === 1 ? 'ticket cobrado en mostrador' : 'tickets cobrados en mostrador hoy'}
              </p>
            </div>

            <div className="flex flex-col @sm:flex-row gap-3 min-w-0">
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3.5 @sm:p-4 min-w-[160px]">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  En Efectivo
                </span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
                  {formatCurrency(summary?.cash_amount || 0)}
                </span>
              </div>
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3.5 @sm:p-4 min-w-[160px]">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Nequi / Transferencia
                </span>
                <span className="text-lg sm:text-xl font-bold text-amber-300 tabular-nums">
                  {formatCurrency(summary?.electronic_amount || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjetas Secundarias Proporcionadas */}
          <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-3 @sm:gap-4">
            {/* 1. Efectivo en Turno */}
            <div className="rounded-2xl @sm:rounded-3xl border border-stone-200/90 bg-white p-4.5 @sm:p-5 shadow-xs flex flex-col justify-between min-w-0">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
                Efectivo en Caja
              </span>
              <div className="my-2">
                <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black tabular-nums text-stone-900 block tracking-tight truncate">
                  {formatCurrency(summary?.cash_amount || 0)}
                </span>
              </div>
              <span className="text-xs text-stone-500 font-medium truncate">
                Transferencias: {formatCurrency(summary?.electronic_amount || 0)}
              </span>
            </div>

            {/* 2. Cartera / Fiados Pendientes */}
            <div className="rounded-2xl @sm:rounded-3xl border border-stone-200/90 bg-white p-4.5 @sm:p-5 shadow-xs flex flex-col justify-between min-w-0">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
                Fiado por Cobrar
              </span>
              <div className="my-2">
                <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black tabular-nums text-amber-700 block tracking-tight truncate">
                  {formatCurrency(creditsSummary?.total_owed || 0)}
                </span>
              </div>
              <span className="text-xs text-stone-500 font-medium truncate">
                {creditsSummary?.credits_count || 0} {creditsSummary?.credits_count === 1 ? 'cuenta activa' : 'cuentas activas'}
              </span>
            </div>

            {/* 3. Estado de Existencias */}
            <div className="rounded-2xl @sm:rounded-3xl border border-stone-200/90 bg-white p-4.5 @sm:p-5 shadow-xs flex flex-col justify-between min-w-0">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
                Stock Crítico
              </span>
              <div className="my-2">
                <span className={`text-[clamp(1.25rem,5cqi,1.875rem)] font-black tabular-nums block tracking-tight truncate ${
                  lowStockProducts.length > 0 ? 'text-rose-600' : 'text-stone-900'
                }`}>
                  {lowStockProducts.length} {lowStockProducts.length === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>
              <span className="text-xs text-stone-500 font-medium truncate">
                {lowStockProducts.length > 0 ? 'Requieren nuevo pedido a proveedor' : 'Inventario disponible al día'}
              </span>
            </div>
          </div>

          {/* Grid de Dos Columnas: Estado de Turno & Operaciones Recientes */}
          <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-6 items-start">
            {/* Columna Izquierda: Estado de Turno & Cartera */}
            <div className="space-y-5">
              {/* Alerta de Turno de Caja */}
              {!cashShift?.is_open ? (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                      <Coins className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-amber-950">
                        Caja Cerrada sin Base Registrada
                      </h3>
                      <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                        Para registrar las ventas del día con precisión en el arqueo, abre el turno con tu fondo de cambio en efectivo.
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/dashboard/caja"
                      className="min-h-11 inline-flex items-center gap-2 px-4 py-2 bg-amber-900 text-amber-50 hover:bg-amber-950 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                      <span>Abrir Turno con Base</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Turno de Caja Actual
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Caja Abierta
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs text-stone-600">Base inicial registrada</span>
                    <span className="font-bold text-stone-900 tabular-nums text-sm">
                      {formatCurrency(cashShift?.shift?.starting_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-stone-100 pt-2">
                    <span className="text-xs text-stone-500">Abierto a las</span>
                    <span className="text-xs font-semibold text-stone-800">
                      {cashShift?.shift?.opened_at ? new Date(cashShift.shift.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                </div>
              )}

              {/* Cuaderno de Fiados Inmediato */}
              <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4.5 text-stone-700" />
                    <h3 className="text-sm font-bold text-stone-900">
                      Cuentas por Cobrar (Fiados)
                    </h3>
                  </div>
                  <Link
                    to="/dashboard/creditos"
                    className="min-h-9 px-2 text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Ver todas</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>

                {creditsSummary?.credits && creditsSummary.credits.length > 0 ? (
                  <div className="divide-y divide-stone-100">
                    {creditsSummary.credits.slice(0, 4).map((credit) => (
                      <div key={credit.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between min-h-[44px]">
                        <div className="min-w-0 pr-3">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {credit.customer ? `${credit.customer.name} ${credit.customer.last_name || ''}`.trim() : 'Cliente sin registrar'}
                          </p>
                          <p className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                            <span>Ticket #{credit.ticket_number || credit.invoice_number}</span>
                            {credit.customer?.phone && (
                              <span className="font-mono">· {credit.customer.phone}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-stone-900 tabular-nums text-xs block">
                            {formatCurrency(credit.balance_due)}
                          </span>
                          <Link
                            to="/dashboard/creditos"
                            className="text-xs font-bold text-amber-700 hover:text-amber-900 underline"
                          >
                            Abonar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-stone-500">
                    No hay fiados pendientes en este momento. Todas las cuentas están al día.
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Últimas Operaciones Realizadas en Caja */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-stone-900">
                    Operaciones Recientes
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Últimos tickets emitidos en el mostrador
                  </p>
                </div>
                <Link
                  to="/dashboard/pos"
                  className="min-h-9 px-2 text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors inline-flex items-center gap-1"
                >
                  <span>Abrir POS</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>

              {recentSales.length > 0 ? (
                <>
                  {/* Vista Contenedor Angosto (< @3xl): Tarjetas */}
                  <div className="@3xl:hidden divide-y divide-stone-100">
                    {recentSales.map((sale) => (
                      <div key={sale.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-stone-900">
                            #{sale.ticket_number}
                          </span>
                          <span className="font-bold text-stone-900 tabular-nums text-sm">
                            {formatCurrency(sale.total_amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-stone-500">
                          <span>{sale.customer?.name || 'Consumidor Final'}</span>
                          <span className="font-mono text-[11px]">
                            {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div>
                          {sale.payment_type === 'credit' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Fiado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                              {sale.payment_method === 'cash' ? 'Efectivo' : 'Transf.'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista Contenedor Amplio (@3xl:): Tabla */}
                  <div className="hidden @3xl:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                          <th className="pb-2.5">Ticket</th>
                          <th className="pb-2.5">Cliente</th>
                          <th className="pb-2.5">Pago</th>
                          <th className="pb-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {recentSales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-2.5 font-mono font-bold text-stone-900">
                              {sale.ticket_number}
                              <span className="block text-xs text-stone-400 font-sans font-normal">
                                {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span className="font-semibold text-stone-900 block truncate max-w-[130px]">
                                {sale.customer?.name || 'Mostrador'}
                              </span>
                              <span className="text-[11px] text-stone-500 block">
                                {sale.items?.length || 1} {sale.items?.length === 1 ? 'artículo' : 'artículos'}
                              </span>
                            </td>
                            <td className="py-2.5">
                              {sale.payment_type === 'credit' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  Fiado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                                  {sale.payment_method === 'cash' ? 'Efectivo' : 'Transf.'}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-right font-black text-stone-900 tabular-nums text-xs">
                              {formatCurrency(sale.total_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-stone-500 space-y-2">
                  <Package className="size-7 mx-auto text-stone-300 stroke-1" />
                  <p className="text-xs">Aún no hay ventas registradas el día de hoy.</p>
                  <Link
                    to="/dashboard/pos"
                    className="inline-block text-xs font-bold text-stone-900 underline mt-1"
                  >
                    Realizar primera venta en caja
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
