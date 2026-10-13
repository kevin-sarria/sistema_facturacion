import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { usePosStore, PosProduct } from '../../stores/usePosStore';
import { formatCurrency } from '../../lib/utils';
import { useHotkeys } from '../../hooks/useHotkeys';
import { toast } from '../../components/ui/toast';
import {
  Cart,
  CheckoutDialog,
  NewCustomerDialog,
  ReceiptDialog,
} from './components';
import {
  Search,
  Barcode,
  DollarSign,
  User,
  UserPlus,
  ChevronDown,
  Calendar,
} from 'lucide-react';

interface CustomerOption {
  id: number;
  name: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  document_number?: string;
}

export const Sales = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getChange,
    getBalanceDue,
    paymentType,
    setPaymentType,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    customerId,
    setCustomerId,
    dueDate,
    setDueDate,
    notes,
    setNotes,
  } = usePosStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PosProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal para cliente rápido
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [newCustomerError, setNewCustomerError] = useState('');
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStacked, setIsStacked] = useState(true);

  // Detectar layout apilado (columna) cuando el ancho disponible del contenedor es menor a 896px (@4xl)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setIsStacked(el.clientWidth < 896);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setIsStacked(entry.contentRect.width < 896);
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  // Atajos específicos del POS: F8 enfoca buscador, F9 abre diálogo de cobro
  useHotkeys([
    {
      key: 'F8',
      handler: () => {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      },
    },
    {
      key: 'F9',
      handler: () => {
        if (items.length > 0) {
          handleOpenCheckout();
        } else {
          toast.info('Agrega al menos un producto al carrito para cobrar.');
        }
      },
    },
  ]);

  useEffect(() => {
    searchInputRef.current?.focus();
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.get('/customers');
      if (res.data?.success) {
        setCustomers(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Error al cargar la lista de clientes.');
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.data?.success) {
          const results: PosProduct[] = res.data.data;
          if (res.data.exact_match && results.length === 1) {
            addItem(results[0]);
            setSearchQuery('');
            setSearchResults([]);
          } else {
            setSearchResults(results);
          }
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectProduct = (product: PosProduct) => {
    addItem(product);
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleOpenCheckout = () => {
    if (items.length === 0) return;
    setAmountPaid(getTotal());
    setErrorMessage('');
    setIsCheckoutOpen(true);
  };

  const handleConfirmSale = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      customer_id: customerId,
      payment_type: paymentType,
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      due_date: paymentType === 'credit' ? dueDate : null,
      notes: notes,
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })),
    };

    try {
      const res = await api.post('/sales', payload);
      if (res.data?.success) {
        setCompletedSale(res.data.data);
        setIsCheckoutOpen(false);
        clearCart();
        toast.success('¡Venta cobrada con éxito!');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al procesar la venta. Verifique los datos.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateQuickCustomer = async (data: {
    name: string;
    last_name: string;
    phone: string;
    document_number?: string;
    email?: string;
  }) => {
    setIsSavingCustomer(true);
    setNewCustomerError('');
    try {
      const res = await api.post('/customers', data);
      if (res.data?.success) {
        const created = res.data.data;
        setCustomers((prev) => [created, ...prev]);
        setCustomerId(created.id);
        setIsNewCustomerOpen(false);
        toast.success(`Cliente ${created.name} registrado y seleccionado.`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al registrar el cliente.';
      setNewCustomerError(msg);
      toast.error(msg);
    } finally {
      setIsSavingCustomer(false);
    }
  };

  const total = getTotal();
  const change = getChange();
  const balanceDue = getBalanceDue();

  return (
    <div
      ref={containerRef}
      className={`@container flex flex-col @4xl:flex-row gap-4 sm:gap-6 min-h-[calc(100vh-140px)] min-w-0 ${
        isStacked ? 'pb-20' : 'pb-0'
      }`}
    >
      {/* ─── Columna Izquierda: Buscador & Carrito ─── */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-stone-200/80 overflow-hidden min-w-0">
        {/* Cabecera del Mostrador con Atajo F8 */}
        <div className="p-3.5 sm:p-5 bg-stone-900 text-white flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="bg-amber-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-white shadow-md shadow-amber-600/30 shrink-0">
              <Barcode className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight truncate">Caja Mostrador</h2>
                <span className="hidden @md:inline-block text-[10px] font-mono font-bold bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">
                  F1
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">Pasa el lector o escribe el nombre</p>
            </div>
          </div>

          {/* Input Buscador con Indicador F8 */}
          <div className="relative w-full sm:w-80 @2xl:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar o escanear código... (F8)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-11 pl-9 pr-14 py-2 rounded-xl sm:rounded-2xl bg-stone-800 border border-stone-700 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-medium"
            />
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-stone-400 bg-stone-700/60 px-1.5 py-0.5 rounded border border-stone-600 pointer-events-none">
              F8
            </kbd>
            {isSearching && (
              <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[11px] text-amber-400 font-bold animate-pulse">
                Buscando...
              </span>
            )}

            {/* Menú de resultados flotantes */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white text-stone-800 rounded-2xl shadow-2xl border border-stone-200 max-h-72 overflow-y-auto z-50 divide-y divide-stone-100">
                {searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="p-3 hover:bg-amber-50/70 cursor-pointer flex items-center justify-between gap-2 transition-colors min-h-[44px]"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-stone-900 truncate">{prod.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                        {prod.barcode && <span className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-[10px]">{prod.barcode}</span>}
                        <span>Stock: <strong className={prod.stock <= 5 ? 'text-rose-600' : 'text-stone-700'}>{prod.stock}</strong></span>
                        {prod.presentation && <span>({prod.presentation.name})</span>}
                      </div>
                    </div>
                    <span className="font-black text-emerald-700 text-xs sm:text-sm tabular-nums shrink-0">
                      {formatCurrency(prod.sale_price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Componente Modular de Carrito */}
        <Cart
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onFocusSearch={() => {
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          }}
        />
      </div>

      {/* ─── Columna Derecha / Panel de Cobro (En layout fila fija lateral, en columna fija abajo) ─── */}
      <div className="w-full @4xl:w-96 flex flex-col gap-4 min-w-0">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-stone-200/80 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
              Tipo de Venta
            </h3>

            {/* Selector Contado vs Fiado */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => setPaymentType('cash')}
                className={`min-h-11 py-2 text-xs font-bold rounded-xl transition-all ${
                  paymentType === 'cash'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Al Contado
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('credit')}
                className={`min-h-11 py-2 text-xs font-bold rounded-xl transition-all ${
                  paymentType === 'credit'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                A Crédito (Fiado)
              </button>
            </div>

            {/* Si es crédito, selector del cliente */}
            {paymentType === 'credit' && (
              <div className="mb-4 space-y-3 bg-amber-50/50 border border-amber-200/70 rounded-2xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-1">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5 truncate">
                    <User className="size-4 text-amber-600 shrink-0" /> ¿A quién se le fía?
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCustomerError('');
                      setIsNewCustomerOpen(true);
                    }}
                    className="min-h-8 inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
                  >
                    <UserPlus className="size-3.5 text-amber-600" />
                    <span>+ Nuevo</span>
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={customerId || ''}
                    onChange={(e) => setCustomerId(Number(e.target.value))}
                    className="w-full min-h-11 appearance-none text-xs bg-white border border-stone-200 rounded-xl px-3 pr-8 text-stone-800 font-medium hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs cursor-pointer"
                  >
                    <option value="" disabled>
                      Seleccione el cliente...
                    </option>
                    {customers.map((c) => {
                      const fullName = c.full_name || `${c.name} ${c.last_name || ''}`.trim();
                      const details = [
                        c.phone ? `Tel: ${c.phone}` : null,
                        c.document_number ? `CC: ${c.document_number}` : null,
                      ].filter(Boolean).join(' • ');

                      return (
                        <option key={c.id} value={c.id}>
                          {fullName} {details ? `(${details})` : ''}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1">
                    <Calendar className="size-3.5 text-stone-400" /> Fecha límite de pago:
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full min-h-11 text-xs bg-white border border-stone-200 rounded-xl px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs"
                  />
                </div>
              </div>
            )}

            {/* Total a Pagar en Grande */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 mb-4 text-center">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">
                Total a Cobrar
              </span>
              <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight tabular-nums block">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Botón Principal de Cobro en Desktop */}
          <button
            onClick={handleOpenCheckout}
            disabled={items.length === 0}
            className={`w-full min-h-12 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              items.length === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : paymentType === 'credit'
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
            }`}
          >
            <DollarSign className="size-5" />
            <span>{paymentType === 'credit' ? 'REGISTRAR FIADO' : 'COBRAR VENTA'}</span>
            <kbd className="hidden sm:inline-block text-[11px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded ml-1">
              F9
            </kbd>
          </button>
        </div>
      </div>

      {/* ─── Barra Fija Inferior cuando el layout está en columna (isStacked) ─── */}
      {isStacked && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-30 shadow-lg flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Venta
            </span>
            <span className="text-xl font-black text-stone-900 tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            onClick={handleOpenCheckout}
            disabled={items.length === 0}
            className={`min-h-11 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md ${
              items.length === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : paymentType === 'credit'
                ? 'bg-amber-600 text-white shadow-amber-600/25'
                : 'bg-emerald-600 text-white shadow-emerald-600/25'
            }`}
          >
            <DollarSign className="size-4" />
            <span>{paymentType === 'credit' ? 'Cobrar Fiado' : 'Cobrar (F9)'}</span>
          </button>
        </div>
      )}

      {/* Diálogos modulares */}
      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        total={total}
        change={change}
        balanceDue={balanceDue}
        paymentType={paymentType}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        amountPaid={amountPaid}
        onAmountPaidChange={setAmountPaid}
        notes={notes}
        onNotesChange={setNotes}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onConfirmSale={handleConfirmSale}
      />

      <NewCustomerDialog
        open={isNewCustomerOpen}
        onOpenChange={setIsNewCustomerOpen}
        onSaveCustomer={handleCreateQuickCustomer}
        isSaving={isSavingCustomer}
        error={newCustomerError}
      />

      <ReceiptDialog
        sale={completedSale}
        onClose={() => setCompletedSale(null)}
      />
    </div>
  );
};
