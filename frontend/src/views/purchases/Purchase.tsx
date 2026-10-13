import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/toast';
import {
  Supplier,
  PurchaseRecord,
  PurchaseAnalysisData,
} from '../../types';
import {
  PurchaseInvoicesTable,
  SupplierList,
  SupplierModal,
  SupplierPaymentModal,
} from './components';
import {
  Plus,
  FileText,
  UserCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const Purchase = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'invoices' | 'suppliers'>('invoices');
  const [analysis, setAnalysis] = useState<PurchaseAnalysisData | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSavingSupplier, setIsSavingSupplier] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resAnalysis, resPurchases, resSuppliers] = await Promise.all([
        api.get('/purchases/analysis'),
        api.get('/purchases'),
        api.get('/suppliers'),
      ]);

      if (resAnalysis.data?.success) setAnalysis(resAnalysis.data.data);
      if (resPurchases.data?.success) setPurchases(resPurchases.data.data.data);
      if (resSuppliers.data?.success) setSuppliers(resSuppliers.data.data);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al cargar los datos de compras y proveedores.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (supplierForm: {
    name: string;
    tax_id: string;
    contact_name: string;
    phone: string;
    contact_phone: string;
    email: string;
    address: string;
    notes: string;
  }) => {
    setIsSavingSupplier(true);
    try {
      const res = await api.post('/suppliers', supplierForm);
      if (res.data?.success) {
        setIsSupplierModalOpen(false);
        toast.success(`Proveedor "${supplierForm.name}" guardado exitosamente.`);
        fetchData();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar el proveedor.';
      toast.error(msg);
    } finally {
      setIsSavingSupplier(false);
    }
  };

  const handleSubmitSupplierPayment = async (data: {
    amount: number;
    payment_date: string;
    payment_method: 'transfer' | 'cash' | 'check';
    reference: string;
  }) => {
    if (!selectedPurchase) return;

    setIsSubmittingPayment(true);
    try {
      const res = await api.post(`/purchases/${selectedPurchase.id}/payment`, data);
      if (res.data?.success) {
        toast.success('¡Abono al proveedor registrado con éxito!');
        setSelectedPurchase(null);
        fetchData();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al registrar el abono al proveedor.';
      toast.error(msg);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Cabecera */}
      <div className="flex flex-col @2xl:flex-row justify-between items-start @2xl:items-center gap-4 pb-5 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl @2xl:text-2xl font-bold tracking-tight text-stone-900">
              Proveedores & Facturas
            </h1>
            <span className="hidden @2xl:inline-block text-[11px] font-mono font-bold bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded">
              F6
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Facturas de Compra — registra lo que compras a proveedores y controla cuentas por pagar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full @md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSupplierModalOpen(true)}
            className="w-full @md:w-auto min-h-11 rounded-xl border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-xs font-semibold"
          >
            <Plus className="size-4 mr-1.5" />
            <span>Nuevo Proveedor</span>
          </Button>
          <Button
            variant="amber"
            size="sm"
            onClick={() => navigate('/dashboard/compras/crear')}
            className="w-full @md:w-auto min-h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs"
          >
            <Plus className="size-4 mr-1.5 text-amber-400" />
            <span>Ingresar Factura</span>
          </Button>
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
            onClick={fetchData}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>Reintentar carga</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading && (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <RefreshCw className="size-6 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Cargando datos de compras y proveedores...</p>
        </div>
      )}

      {/* Tarjetas de Análisis Financiero */}
      {!loading && !error && analysis && (
        <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-3 @sm:gap-4">
          <div className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs min-w-0">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
              Total Adeudado a Proveedores
            </span>
            <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-rose-600 tabular-nums block truncate">
              {formatCurrency(analysis.total_owed)}
            </span>
            <p className="text-xs text-stone-500 mt-1 truncate">
              En <strong>{analysis.pending_invoices_count}</strong> facturas con saldo pendiente
            </p>
          </div>

          <div className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs min-w-0">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
              Próximas a Vencer (7 Días)
            </span>
            <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-amber-600 tabular-nums block truncate">
              {analysis.upcoming_due_invoices?.length || 0} Facturas
            </span>
            <p className="text-xs text-stone-500 mt-1 truncate">
              Pagos prioritarios de esta semana
            </p>
          </div>

          <div className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs min-w-0">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1 line-clamp-2">
              Total Pagado a la Fecha
            </span>
            <span className="text-[clamp(1.25rem,5cqi,1.875rem)] font-black text-emerald-700 tabular-nums block truncate">
              {formatCurrency(analysis.total_paid)}
            </span>
            <p className="text-xs text-stone-500 mt-1 truncate">
              Mercancía y compras saldadas
            </p>
          </div>
        </div>
      )}

      {/* Selector de Pestañas */}
      {!loading && !error && (
        <div className="flex gap-2 border-b border-stone-200 pb-1 overflow-x-auto min-w-0">
          <button
            onClick={() => setTab('invoices')}
            className={`min-h-11 pb-2.5 px-3 @sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              tab === 'invoices'
                ? 'border-stone-900 text-stone-900 font-black'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="size-4 shrink-0" />
            <span className="@3xl:hidden">Facturas</span>
            <span className="hidden @3xl:inline">Facturas de Compra (Créditos)</span>
          </button>
          <button
            onClick={() => setTab('suppliers')}
            className={`min-h-11 pb-2.5 px-3 @sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              tab === 'suppliers'
                ? 'border-stone-900 text-stone-900 font-black'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserCheck className="size-4 shrink-0" />
            <span className="@3xl:hidden">Proveedores</span>
            <span className="hidden @3xl:inline">Directorio de Proveedores & Asesores</span>
          </button>
        </div>
      )}

      {/* Contenido de Pestañas */}
      {!loading && !error && (
        <>
          {tab === 'invoices' ? (
            <PurchaseInvoicesTable
              purchases={purchases}
              onOpenPaymentModal={(p) => setSelectedPurchase(p)}
              onNewInvoice={() => navigate('/dashboard/compras/crear')}
            />
          ) : (
            <SupplierList
              suppliers={suppliers}
              onNewSupplier={() => setIsSupplierModalOpen(true)}
            />
          )}
        </>
      )}

      {/* Modales */}
      <SupplierModal
        open={isSupplierModalOpen}
        onOpenChange={setIsSupplierModalOpen}
        onSave={handleCreateSupplier}
        isSubmitting={isSavingSupplier}
      />

      <SupplierPaymentModal
        purchase={selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        onSubmitPayment={handleSubmitSupplierPayment}
        isSubmitting={isSubmittingPayment}
      />
    </div>
  );
};
