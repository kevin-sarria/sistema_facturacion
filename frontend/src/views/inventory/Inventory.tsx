import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/toast';
import {
  ProductTable,
  ProductItem,
  ProductFormDialog,
  ImportModal,
} from './components';
import {
  downloadExcelTemplate,
  downloadCsvTemplate,
  ParsedProductRow,
} from '../../lib/excelHelper';
import {
  Search,
  Upload,
  Download,
  Plus,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from 'lucide-react';

export const Inventory = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Menús desplegables
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const downloadMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const importMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  // Modales
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, onlyLowStock, page, pageSize]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: pageSize };
      if (search) params.search = search;
      if (onlyLowStock) params.low_stock = true;

      const res = await api.get('/products', { params });
      if (res.data?.success) {
        setProducts(res.data.data.data);
        setTotalPages(res.data.data.last_page);
        setTotalRecords(res.data.data.total);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al cargar el catálogo de productos.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMouseEnter = () => {
    if (downloadMenuTimeout.current) clearTimeout(downloadMenuTimeout.current);
    setIsDownloadMenuOpen(true);
  };
  const handleDownloadMouseLeave = () => {
    downloadMenuTimeout.current = setTimeout(() => setIsDownloadMenuOpen(false), 200);
  };

  const handleImportMouseEnter = () => {
    if (importMenuTimeout.current) clearTimeout(importMenuTimeout.current);
    setIsImportMenuOpen(true);
  };
  const handleImportMouseLeave = () => {
    importMenuTimeout.current = setTimeout(() => setIsImportMenuOpen(false), 200);
  };

  const handleSaveProduct = async (productForm: {
    name: string;
    barcode: string;
    purchase_price: number;
    profit_percentage: number;
    sale_price: number;
    stock: number;
    min_stock: number;
  }) => {
    setIsSavingProduct(true);
    try {
      const res = await api.post('/products', productForm);
      if (res.data?.success) {
        setIsProductModalOpen(false);
        toast.success(`Producto "${productForm.name}" registrado correctamente.`);
        fetchProducts();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar el producto en el catálogo.';
      toast.error(msg);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleImportRows = async (rows: ParsedProductRow[]) => {
    try {
      const res = await api.post('/products/import-json', {
        products: rows,
      });
      if (res.data?.success) {
        toast.success('¡Importación masiva completada exitosamente!');
        fetchProducts();
        return res.data.data;
      }
      throw new Error(res.data?.message || 'Error en la importación');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al importar los productos.';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const fromRecord = totalRecords > 0 ? (page - 1) * pageSize + 1 : 0;
  const toRecord = Math.min(page * pageSize, totalRecords);

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Cabecera y Botones de Acción */}
      <div className="flex flex-col @2xl:flex-row justify-between items-start @2xl:items-center gap-4 pb-5 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl @2xl:text-2xl font-bold tracking-tight text-stone-900">
              Catálogo & Inventario
            </h1>
            <span className="hidden @2xl:inline-block text-[11px] font-mono font-bold bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded">
              F2
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Catálogo de Productos — busca por nombre o código de barras
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full @md:w-auto">
          {/* Botón Descargar Plantilla */}
          <div
            className="relative"
            onMouseEnter={handleDownloadMouseEnter}
            onMouseLeave={handleDownloadMouseLeave}
          >
            <button
              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
              className="min-h-11 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors shadow-2xs"
            >
              <Download className="size-4 text-stone-600" />
              <span>Plantilla</span>
              <ChevronDown className={`size-3.5 text-stone-400 transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDownloadMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Formato de plantilla
                  </span>
                </div>
                <button
                  onClick={() => {
                    downloadExcelTemplate();
                    setIsDownloadMenuOpen(false);
                    toast.info('Descargando plantilla de Excel...');
                  }}
                  className="w-full px-3 py-2.5 text-left text-xs flex items-center justify-between hover:bg-emerald-50 text-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="size-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-stone-900">Plantilla Excel (.xlsx)</p>
                      <p className="text-[10px] text-stone-400">Con celdas y ejemplos listos</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    downloadCsvTemplate();
                    setIsDownloadMenuOpen(false);
                    toast.info('Descargando plantilla CSV...');
                  }}
                  className="w-full px-3 py-2.5 text-left text-xs flex items-center justify-between hover:bg-stone-50 text-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-stone-600" />
                    <div>
                      <p className="font-semibold text-stone-900">Plantilla CSV (.csv)</p>
                      <p className="text-[10px] text-stone-400">Delimitado por comas</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Botón Carga Masiva */}
          <div
            className="relative"
            onMouseEnter={handleImportMouseEnter}
            onMouseLeave={handleImportMouseLeave}
          >
            <button
              onClick={() => {
                setIsImportModalOpen(true);
                setIsImportMenuOpen(false);
              }}
              className="min-h-11 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors shadow-2xs"
            >
              <Upload className="size-4 text-stone-700" />
              <span>Carga Masiva</span>
              <ChevronDown className={`size-3.5 text-stone-400 transition-transform ${isImportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isImportMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50">
                <button
                  onClick={() => {
                    setIsImportModalOpen(true);
                    setIsImportMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 text-left text-xs flex items-center gap-2.5 hover:bg-emerald-50 text-stone-700 transition-colors"
                >
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-stone-900">Subir Archivo Excel o CSV</p>
                    <p className="text-[10px] text-stone-400">Arrastrar o seleccionar archivo</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Botón Nuevo Producto (Acción Principal) */}
          <Button
            size="sm"
            onClick={() => setIsProductModalOpen(true)}
            className="min-h-11 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-xs"
          >
            <Plus className="size-4 mr-1 text-amber-400" />
            <span>Nuevo Producto</span>
          </Button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col @md:flex-row gap-3 @md:gap-4 justify-between items-center bg-white p-3.5 @md:p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative w-full @md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o referencia..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full min-h-11 pl-10 pr-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full @md:w-auto justify-between @md:justify-end">
          <button
            onClick={() => {
              setOnlyLowStock(!onlyLowStock);
              setPage(1);
            }}
            className={`min-h-11 px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-colors ${
              onlyLowStock
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <AlertTriangle className="size-4" />
            <span>Sólo Stock Bajo</span>
          </button>
          <span className="text-xs text-stone-500 font-semibold tabular-nums">
            Total: <strong>{totalRecords}</strong>
          </span>
        </div>
      </div>

      {/* Tabla Responsiva con Tarjetas Móviles y Paginador */}
      <ProductTable
        products={products}
        loading={loading}
        error={error}
        onRetry={fetchProducts}
        onNewProduct={() => setIsProductModalOpen(true)}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        fromRecord={fromRecord}
        toRecord={toRecord}
        isFiltered={!!search || onlyLowStock}
      />

      {/* Modal Carga Masiva */}
      <ImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImportSuccess={() => setIsImportModalOpen(false)}
        onImport={handleImportRows}
      />

      {/* Modal Nuevo Producto */}
      <ProductFormDialog
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        onSave={handleSaveProduct}
        isSubmitting={isSavingProduct}
      />
    </div>
  );
};
