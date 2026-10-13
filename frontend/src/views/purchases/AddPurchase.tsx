import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { formatCurrency } from '../../lib/utils';
import { toast } from '../../components/ui/toast';
import { Supplier, PurchaseLineItem } from '../../types';
import {
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  barcode: string | null;
  purchase_price: number;
}

export const AddPurchase = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Formulario Factura
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('credit');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Ítems
  const [lines, setLines] = useState<PurchaseLineItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [inputQuantity, setInputQuantity] = useState<number>(1);
  const [inputCostPrice, setInputCostPrice] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [resSuppliers, resProducts] = await Promise.all([
        api.get('/suppliers'),
        api.get('/products?limit=200'),
      ]);
      if (resSuppliers.data?.success) setSuppliers(resSuppliers.data.data);
      if (resProducts.data?.success) setProducts(resProducts.data.data.data);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al cargar proveedores y catálogo.';
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setInputCostPrice(Number(prod.purchase_price) || 0);
    }
  };

  const handleAddLine = () => {
    if (!selectedProductId || inputQuantity <= 0 || inputCostPrice <= 0) {
      toast.info('Por favor selecciona un producto, cantidad mayor a 0 y costo unitario.');
      return;
    }
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const lineTotal = inputQuantity * inputCostPrice;
    setLines([
      ...lines,
      {
        id: prod.id,
        product_name: prod.name,
        quantity: inputQuantity,
        cost_price: inputCostPrice,
        subtotal: lineTotal,
      },
    ]);

    setSelectedProductId('');
    setInputQuantity(1);
    setInputCostPrice(0);
  };

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, idx) => idx !== index));
  };

  const total = lines.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !invoiceNumber.trim() || lines.length === 0) {
      toast.error('Por favor completa el proveedor, número de factura y agrega al menos un producto.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      supplier_id: supplierId,
      invoice_number: invoiceNumber.trim(),
      purchase_date: purchaseDate,
      due_date: paymentType === 'credit' ? dueDate : null,
      payment_type: paymentType,
      paid_amount: paymentType === 'cash' ? total : paidAmount,
      notes: notes,
      items: lines.map((l) => ({
        product_id: l.id,
        quantity: l.quantity,
        cost_price: l.cost_price,
      })),
    };

    try {
      const res = await api.post('/purchases', payload);
      if (res.data?.success) {
        toast.success(`Factura "${invoiceNumber}" registrada e inventario actualizado.`);
        navigate('/dashboard/compras');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar la factura de compra.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto w-full">
      {/* Botón Volver & Título */}
      <div className="flex items-center gap-3 pb-5 border-b border-stone-200/80">
        <button
          onClick={() => navigate('/dashboard/compras')}
          aria-label="Volver a compras"
          className="min-h-11 min-w-11 flex items-center justify-center p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-xl @2xl:text-2xl font-bold text-stone-900 tracking-tight">
            Ingresar Factura de Mercancía
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Facturas de Compra — ingresa la mercancía recibida y sus costos
          </p>
        </div>
      </div>

      {/* Estado de Error con Reintentar */}
      {fetchError && !loading && (
        <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
          <div className="size-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-6" />
          </div>
          <p className="text-sm font-bold text-stone-800">{fetchError}</p>
          <button
            type="button"
            onClick={loadData}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>Reintentar carga de proveedores</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading && (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <RefreshCw className="size-6 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Cargando catálogo y proveedores...</p>
        </div>
      )}

      {!loading && !fetchError && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Paso 1: Datos de la Factura y Proveedor */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              1. Datos del Proveedor y Factura
            </h2>

            <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  ¿Qué proveedor nos entregó la mercancía? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(Number(e.target.value))}
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 bg-white text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="">-- Seleccionar Proveedor --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.phone ? `(${s.phone})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Número de Factura del Proveedor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. FAC-99120"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Fecha de la Factura
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Condición de Pago
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 bg-white font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="credit">A Crédito (Nos dieron plazo)</option>
                  <option value="cash">Al Contado (Pagada hoy completa)</option>
                </select>
              </div>

              {paymentType === 'credit' && (
                <div>
                  <label className="text-xs font-bold text-amber-900 block mb-1">
                    Fecha Límite para Pagar
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full min-h-11 text-xs border border-amber-300 bg-amber-50 rounded-xl px-3 text-amber-950 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Paso 2: Productos que llegaron */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              2. Artículos que llegaron en el pedido
            </h2>

            <div className="grid grid-cols-1 @md:grid-cols-12 gap-3 items-end bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="@md:col-span-5">
                <label className="text-xs font-bold text-stone-700 block mb-1">Producto</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleSelectProduct(Number(e.target.value))}
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="">-- Buscar producto del catálogo --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.barcode ? `(${p.barcode})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="@md:col-span-3">
                <label className="text-xs font-bold text-stone-700 block mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={inputQuantity}
                  onChange={(e) => setInputQuantity(Number(e.target.value))}
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 bg-white font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 tabular-nums"
                />
              </div>

              <div className="@md:col-span-3">
                <label className="text-xs font-bold text-stone-700 block mb-1">Costo Unitario ($)</label>
                <input
                  type="number"
                  min="0"
                  value={inputCostPrice || ''}
                  onChange={(e) => setInputCostPrice(Number(e.target.value))}
                  placeholder="0"
                  className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 bg-white font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 tabular-nums"
                />
              </div>

              <div className="@md:col-span-1">
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="w-full min-h-11 bg-stone-900 hover:bg-stone-800 text-white rounded-xl flex items-center justify-center transition-colors shadow-2xs font-bold"
                  title="Agregar artículo"
                  aria-label="Agregar artículo a la factura"
                >
                  <Plus className="size-5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Lista de Artículos Agregados (Tarjetas en Móvil, Tabla en Desktop) */}
            {lines.length > 0 && (
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                {/* Contenedor Angosto (< @3xl) */}
                <div className="@3xl:hidden divide-y divide-stone-100 bg-white">
                  {lines.map((l, idx) => (
                    <div key={idx} className="p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-stone-900">{l.product_name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="min-h-10 min-w-10 flex items-center justify-center text-stone-400 hover:text-rose-600 -mr-2 -mt-2"
                          aria-label={`Eliminar ${l.product_name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span>Cantidad: <strong className="text-stone-900">+{l.quantity}</strong></span>
                        <span>Unitario: <strong className="tabular-nums">{formatCurrency(l.cost_price)}</strong></span>
                        <span>Subtotal: <strong className="text-stone-900 tabular-nums font-bold">{formatCurrency(l.subtotal)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contenedor Amplio (@3xl:) */}
                <div className="hidden @3xl:block overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4 text-center">Cantidad</th>
                        <th className="py-3 px-4 text-right">Costo Unitario</th>
                        <th className="py-3 px-4 text-right">Subtotal</th>
                        <th className="py-3 px-4 text-center">Quitar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {lines.map((l, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/60">
                          <td className="py-3 px-4 font-semibold text-stone-800">{l.product_name}</td>
                          <td className="py-3 px-4 text-center font-bold text-stone-900">+{l.quantity}</td>
                          <td className="py-3 px-4 text-right text-stone-600 tabular-nums">{formatCurrency(l.cost_price)}</td>
                          <td className="py-3 px-4 text-right font-black text-stone-900 tabular-nums">{formatCurrency(l.subtotal)}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(idx)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                              aria-label={`Quitar ${l.product_name}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-sm font-bold">
                  <span className="text-stone-600">Total de la Factura:</span>
                  <span className="text-xl font-black text-stone-900 tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Botón Final */}
          <button
            type="submit"
            disabled={isSubmitting || lines.length === 0}
            className="w-full min-h-12 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle className="size-5 text-amber-400" />
            <span>{isSubmitting ? 'Guardando e incrementando stock...' : 'Guardar Factura e Ingresar al Inventario'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
