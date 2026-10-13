import React from 'react';
import { formatCurrency } from '../../../lib/utils';
import { PaginadorTabla } from '../../../components/table/PaginadorTabla';
import { Package, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export interface ProductItem {
  id: number;
  barcode: string | null;
  sku: string | null;
  name: string;
  category?: { name: string } | null;
  presentation?: { name: string } | null;
  purchase_price: number;
  profit_percentage: number;
  sale_price: number;
  stock: number;
  min_stock: number;
}

interface ProductTableProps {
  products: ProductItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onNewProduct: () => void;
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  fromRecord: number;
  toRecord: number;
  isFiltered: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  error,
  onRetry,
  onNewProduct,
  page,
  pageSize,
  totalPages,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  fromRecord,
  toRecord,
  isFiltered,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Estado de Error con Botón Reintentar */}
      {error && !loading && (
        <div className="p-8 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-6" />
          </div>
          <p className="text-sm font-bold text-stone-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>Reintentar cargar catálogo</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading && (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <RefreshCw className="size-6 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Cargando catálogo de inventario...</p>
        </div>
      )}

      {/* Estado Vacío */}
      {!loading && !error && products.length === 0 && (
        <div className="py-16 px-4 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Package className="size-6" />
          </div>
          <p className="text-sm font-bold text-stone-700">
            {isFiltered
              ? 'No se encontraron productos con el filtro aplicado'
              : 'Aún no hay productos en el inventario'}
          </p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {isFiltered
              ? 'Intenta con otro término de búsqueda o desactiva el filtro de stock bajo.'
              : 'Registra tus primeros artículos escolares, útiles o accesorios para comenzar a vender.'}
          </p>
          {!isFiltered && (
            <button
              type="button"
              onClick={onNewProduct}
              className="mt-2 min-h-11 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="size-4 text-amber-400" />
              <span>Agregar el primer producto</span>
            </button>
          )}
        </div>
      )}

      {/* Contenido: Tablas en Desktop (md:) y Tarjetas en Móvil (<md) */}
      {!loading && !error && products.length > 0 && (
        <>
          {/* Vista Contenedor Angosto (< @4xl): Tarjetas Responsivas */}
          <div className="@4xl:hidden divide-y divide-stone-100">
            {products.map((p) => {
              const isLow = p.stock <= p.min_stock;
              return (
                <div key={p.id} className="p-4 space-y-2.5 bg-white hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {p.barcode || p.sku || 'Sin código'}
                    </span>
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                        <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
                        Bajo Stock
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        Disponible
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 leading-snug">{p.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {p.category?.name || 'General'} · {p.presentation?.name || 'Unidad'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <div>
                      <span className="text-[11px] text-stone-400 block">Costo:</span>
                      <span className="font-semibold text-stone-600 tabular-nums">
                        {formatCurrency(p.purchase_price)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-stone-400 block">Precio Venta:</span>
                      <span className="font-bold text-stone-900 text-sm tabular-nums">
                        {formatCurrency(p.sale_price)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-stone-400 block">Existencias:</span>
                      <span
                        className={`font-black text-sm tabular-nums ${
                          isLow ? 'text-rose-600' : 'text-stone-800'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista Contenedor Amplio (@4xl:): Tabla Tradicional */}
          <div className="hidden @4xl:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Código / Barcode</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Presentación</th>
                  <th className="py-3 px-4 text-right">Costo (Compra)</th>
                  <th className="py-3 px-4 text-right">Precio Venta</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  const isLow = p.stock <= p.min_stock;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-stone-700">
                        {p.barcode || p.sku || '—'}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {p.category?.name || 'General'}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {p.presentation?.name || 'Unidad'}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-stone-600">
                        {formatCurrency(p.purchase_price)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-stone-900">
                        {formatCurrency(p.sale_price)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold tabular-nums">
                        <span
                          className={
                            isLow
                              ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200'
                              : 'text-stone-700'
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isLow ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            Bajo Stock
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Disponible
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Paginador común conservado */}
      {totalRecords > 0 && !error && (
        <PaginadorTabla
          pagina={page}
          totalPaginas={totalPages}
          onPagina={onPageChange}
          tamano={pageSize}
          onTamano={onPageSizeChange}
          desde={fromRecord}
          hasta={toRecord}
          total={totalRecords}
        />
      )}
    </div>
  );
};
