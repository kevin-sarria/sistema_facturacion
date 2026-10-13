import React, { useState, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  parseExcelFile,
  parseCsvFile,
  ParsedProductRow,
} from '../../../lib/excelHelper';
import {
  FileSpreadsheet,
  FileText,
  X,
  RefreshCw,
  Eye,
  FileUp,
  CheckCircle,
} from 'lucide-react';

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
  onImport: (rows: ParsedProductRow[]) => Promise<{ imported: number; updated: number }>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  open,
  onOpenChange,
  onImportSuccess,
  onImport,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedProductRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ imported: number; updated: number } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setSelectedFile(file);
    setUploadError('');
    setUploadResult(null);
    setIsParsing(true);
    setParsedRows([]);

    try {
      const fileName = file.name.toLowerCase();
      let rows: ParsedProductRow[] = [];

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        rows = await parseExcelFile(file);
      } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        rows = await parseCsvFile(file);
      } else {
        throw new Error('Formato no compatible. Sube un archivo Excel (.xlsx, .xls) o CSV (.csv).');
      }

      if (rows.length === 0) {
        throw new Error('No se detectaron productos válidos con nombre en el archivo.');
      }

      setParsedRows(rows);
    } catch (err: any) {
      setUploadError(err.message || 'Error al procesar el archivo.');
      setSelectedFile(null);
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setUploadError('');
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedRows.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const result = await onImport(parsedRows);
      setUploadResult(result);
      onImportSuccess();
    } catch (err: any) {
      setUploadError(err.message || 'Error al importar los productos.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <DialogTitle>Importación Masiva de Productos</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <p className="text-xs text-stone-500">
            Soporta archivos <strong>Excel (.xlsx, .xls)</strong> y <strong>CSV (.csv)</strong>. El sistema procesa miles de productos, auto-registra categorías y actualiza inventarios existentes.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-amber-500 bg-amber-50/70 scale-[0.99] ring-4 ring-amber-500/10'
                  : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="size-11 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileSpreadsheet className="size-6" />
                </div>
                <div className="size-11 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-700">
                  <FileText className="size-6" />
                </div>
              </div>

              <p className="text-xs font-bold text-stone-800">
                {dragActive ? '¡Suelta tu archivo aquí ahora!' : 'Arrastra tu archivo Excel o CSV aquí'}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                o haz clic para explorar en tu computadora
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] bg-white border border-stone-200 text-stone-600 font-semibold px-2 py-0.5 rounded">
                  .XLSX
                </span>
                <span className="text-[10px] bg-white border border-stone-200 text-stone-600 font-semibold px-2 py-0.5 rounded">
                  .XLS
                </span>
                <span className="text-[10px] bg-white border border-stone-200 text-stone-600 font-semibold px-2 py-0.5 rounded">
                  .CSV
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    {selectedFile.name.endsWith('.csv') ? (
                      <FileText className="size-5" />
                    ) : (
                      <FileSpreadsheet className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.name.endsWith('.csv') ? 'Archivo CSV' : 'Libro de Excel'}
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleClearSelectedFile}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-200/50 rounded-lg transition-colors"
                    title="Quitar archivo"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {isParsing && (
                <div className="py-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <RefreshCw className="size-4 animate-spin text-amber-600" />
                  <span>Leyendo y validando columnas del archivo...</span>
                </div>
              )}

              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <Eye className="size-3.5 text-stone-400" />
                      Vista previa de datos ({parsedRows.length} productos detectados)
                    </span>
                  </div>

                  <div className="max-h-36 overflow-y-auto border border-stone-200 rounded-xl text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-stone-100 text-stone-600 sticky top-0">
                        <tr>
                          <th className="py-1.5 px-2.5 font-bold">Código</th>
                          <th className="py-1.5 px-2.5 font-bold">Nombre</th>
                          <th className="py-1.5 px-2.5 font-bold">Categoría</th>
                          <th className="py-1.5 px-2.5 text-right font-bold">Venta</th>
                          <th className="py-1.5 px-2.5 text-center font-bold">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {parsedRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="py-1 px-2.5 font-mono text-[10px] text-stone-500">{row.barcode || '—'}</td>
                            <td className="py-1 px-2.5 font-medium text-stone-900 truncate max-w-[140px]">{row.name}</td>
                            <td className="py-1 px-2.5 text-stone-500 truncate max-w-[90px]">{row.category}</td>
                            <td className="py-1 px-2.5 text-right font-mono">${row.sale_price.toLocaleString('es-CO')}</td>
                            <td className="py-1 px-2.5 text-center font-mono">{row.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              {uploadError}
            </div>
          )}

          {uploadResult && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle className="size-4 text-emerald-600" /> ¡Importación completada con éxito!
              </p>
              <p className="text-emerald-700">
                {uploadResult.imported} productos nuevos registrados · {uploadResult.updated} productos existentes actualizados.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={parsedRows.length === 0 || isUploading || isParsing}
              className="w-full min-h-11 py-2.5 bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin text-amber-400" />
                  <span>Importando al catálogo de base de datos...</span>
                </>
              ) : (
                <>
                  <FileUp className="size-3.5 text-amber-400" />
                  <span>
                    {parsedRows.length > 0
                      ? `Importar ${parsedRows.length} Productos Ahora`
                      : 'Selecciona o arrastra un archivo'}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
