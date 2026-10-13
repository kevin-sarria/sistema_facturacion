import writeXlsxFile from 'write-excel-file/browser';
import readXlsxFile from 'read-excel-file/browser';

export interface ParsedProductRow {
  barcode?: string;
  name: string;
  category: string;
  presentation: string;
  purchase_price: number;
  sale_price: number;
  stock: number;
  min_stock: number;
}

/**
 * Genera y descarga directamente una plantilla de Excel (.xlsx) con estilos y ejemplos reales
 */
export async function downloadExcelTemplate(): Promise<void> {
  const HEADER_ROW = [
    { value: 'codigo_barras', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'nombre', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'categoria', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'presentacion', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'precio_compra', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'precio_venta', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'stock', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
    { value: 'stock_minimo', fontWeight: 'bold', backgroundColor: '#e2e8f0' },
  ];

  const DATA_ROWS = [
    [
      { type: String, value: '7701025000018' },
      { type: String, value: 'Bolígrafo BIC Cristal Negro' },
      { type: String, value: 'Escritura y Corrección' },
      { type: String, value: 'Unidad' },
      { type: Number, value: 800 },
      { type: Number, value: 1200 },
      { type: Number, value: 100 },
      { type: Number, value: 20 },
    ],
    [
      { type: String, value: '7703056001015' },
      { type: String, value: 'Resma Papel Carta Reprograf' },
      { type: String, value: 'Papeles y Cartulinas' },
      { type: String, value: 'Resma (500 hojas)' },
      { type: Number, value: 15500 },
      { type: Number, value: 20000 },
      { type: Number, value: 25 },
      { type: Number, value: 5 },
    ],
    [
      { type: String, value: '7702111003001' },
      { type: String, value: 'Cuaderno Cuadriculado 100 Hojas Norma' },
      { type: String, value: 'Cuadernos y Libretas' },
      { type: String, value: 'Unidad' },
      { type: Number, value: 4200 },
      { type: Number, value: 6000 },
      { type: Number, value: 40 },
      { type: Number, value: 10 },
    ],
    [
      { type: String, value: '7701234567890' },
      { type: String, value: 'Marcador Permanente Sharpie Negro' },
      { type: String, value: 'Escritura y Corrección' },
      { type: String, value: 'Unidad' },
      { type: Number, value: 2500 },
      { type: Number, value: 3800 },
      { type: Number, value: 30 },
      { type: Number, value: 8 },
    ],
    [
      { type: String, value: '' }, // Sin código de barras
      { type: String, value: 'Borrador de Nata Pelikan' },
      { type: String, value: 'Escritura y Corrección' },
      { type: String, value: 'Unidad' },
      { type: Number, value: 600 },
      { type: Number, value: 1000 },
      { type: Number, value: 60 },
      { type: Number, value: 15 },
    ],
  ];

  const columns = [
    { width: 18 }, // codigo_barras
    { width: 38 }, // nombre
    { width: 26 }, // categoria
    { width: 22 }, // presentacion
    { width: 16 }, // precio_compra
    { width: 16 }, // precio_venta
    { width: 12 }, // stock
    { width: 14 }, // stock_minimo
  ];

  await writeXlsxFile([HEADER_ROW as any, ...DATA_ROWS], {
    columns,
    fileName: 'plantilla_productos_papeleria.xlsx',
  });
}

/**
 * Genera y descarga una plantilla CSV con codificación UTF-8 BOM para soporte de tildes en Excel
 */
export function downloadCsvTemplate(): void {
  const headers = 'codigo_barras,nombre,categoria,presentacion,precio_compra,precio_venta,stock,stock_minimo';
  const rows = [
    '7701025000018,Bolígrafo BIC Cristal Negro,Escritura y Corrección,Unidad,800,1200,100,20',
    '7703056001015,Resma Papel Carta Reprograf,Papeles y Cartulinas,Resma (500 hojas),15500,20000,25,5',
    '7702111003001,Cuaderno Cuadriculado 100 Hojas Norma,Cuadernos y Libretas,Unidad,4200,6000,40,10',
    '7701234567890,Marcador Permanente Sharpie Negro,Escritura y Corrección,Unidad,2500,3800,30,8',
    ',Borrador de Nata Pelikan,Escritura y Corrección,Unidad,600,1000,60,15',
  ];

  const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'plantilla_productos_papeleria.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lee y parsea un archivo Excel (.xlsx, .xls) directamente en el navegador
 */
export async function parseExcelFile(file: File): Promise<ParsedProductRow[]> {
  const rows = await readXlsxFile(file);
  if (!rows || rows.length < 2) {
    throw new Error('El archivo Excel está vacío o no contiene filas de datos.');
  }

  // Primera fila como cabeceras normalizadas
  const rawHeaders: string[] = (rows[0] as any[]).map((h: any) => String(h || '').trim().toLowerCase());
  const headerMap: Record<string, number> = {};

  rawHeaders.forEach((header: string, index: number) => {
    const cleanHeader = header
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '_');

    if (cleanHeader.includes('barcode') || cleanHeader.includes('codigo')) headerMap.barcode = index;
    if (cleanHeader.includes('nombre') || cleanHeader.includes('name') || cleanHeader.includes('producto')) headerMap.name = index;
    if (cleanHeader.includes('categoria') || cleanHeader.includes('category')) headerMap.category = index;
    if (cleanHeader.includes('presentacion') || cleanHeader.includes('presentation') || cleanHeader.includes('unidad')) headerMap.presentation = index;
    if (cleanHeader.includes('compra') || cleanHeader.includes('costo') || cleanHeader.includes('purchase')) headerMap.purchase_price = index;
    if (cleanHeader.includes('venta') || cleanHeader.includes('precio') || cleanHeader.includes('sale')) headerMap.sale_price = index;
    if (cleanHeader.includes('stock') || cleanHeader.includes('cantidad')) headerMap.stock = index;
    if (cleanHeader.includes('minimo') || cleanHeader.includes('min_stock')) headerMap.min_stock = index;
  });

  if (headerMap.name === undefined) {
    throw new Error('No se encontró la columna obligatoria "nombre" o "producto" en el archivo Excel.');
  }

  const products: ParsedProductRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const nameVal = headerMap.name !== undefined ? String(row[headerMap.name] || '').trim() : '';
    if (!nameVal) continue; // Saltar filas sin nombre

    const barcodeVal = headerMap.barcode !== undefined ? String(row[headerMap.barcode] || '').trim() : '';
    const categoryVal = headerMap.category !== undefined ? String(row[headerMap.category] || '').trim() : 'Miscelánea';
    const presentationVal = headerMap.presentation !== undefined ? String(row[headerMap.presentation] || '').trim() : 'Unidad';

    const parseNum = (val: any, fallback = 0) => {
      if (val === null || val === undefined || val === '') return fallback;
      const num = Number(String(val).replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? fallback : num;
    };

    const purchasePrice = headerMap.purchase_price !== undefined ? parseNum(row[headerMap.purchase_price], 0) : 0;
    const salePrice = headerMap.sale_price !== undefined ? parseNum(row[headerMap.sale_price], 0) : 0;
    const stock = headerMap.stock !== undefined ? Math.round(parseNum(row[headerMap.stock], 0)) : 0;
    const minStock = headerMap.min_stock !== undefined ? Math.round(parseNum(row[headerMap.min_stock], 5)) : 5;

    products.push({
      barcode: barcodeVal || undefined,
      name: nameVal,
      category: categoryVal || 'Miscelánea',
      presentation: presentationVal || 'Unidad',
      purchase_price: purchasePrice,
      sale_price: salePrice,
      stock: stock,
      min_stock: minStock,
    });
  }

  return products;
}

/**
 * Lee y parsea un archivo CSV (.csv, .txt) directamente en el navegador
 */
export async function parseCsvFile(file: File): Promise<ParsedProductRow[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('El archivo CSV está vacío o no contiene filas de datos.');
  }

  // Detectar delimitador (, o ;)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  // Separar respetando comillas
  const splitLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawHeaders = splitLine(firstLine).map((h) => h.replace(/^"|"$/g, '').toLowerCase().trim());
  const headerMap: Record<string, number> = {};

  rawHeaders.forEach((header, index) => {
    const cleanHeader = header
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '_');

    if (cleanHeader.includes('barcode') || cleanHeader.includes('codigo')) headerMap.barcode = index;
    if (cleanHeader.includes('nombre') || cleanHeader.includes('name') || cleanHeader.includes('producto')) headerMap.name = index;
    if (cleanHeader.includes('categoria') || cleanHeader.includes('category')) headerMap.category = index;
    if (cleanHeader.includes('presentacion') || cleanHeader.includes('presentation') || cleanHeader.includes('unidad')) headerMap.presentation = index;
    if (cleanHeader.includes('compra') || cleanHeader.includes('costo') || cleanHeader.includes('purchase')) headerMap.purchase_price = index;
    if (cleanHeader.includes('venta') || cleanHeader.includes('precio') || cleanHeader.includes('sale')) headerMap.sale_price = index;
    if (cleanHeader.includes('stock') || cleanHeader.includes('cantidad')) headerMap.stock = index;
    if (cleanHeader.includes('minimo') || cleanHeader.includes('min_stock')) headerMap.min_stock = index;
  });

  if (headerMap.name === undefined) {
    throw new Error('No se encontró la columna obligatoria "nombre" o "producto" en el archivo CSV.');
  }

  const products: ParsedProductRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitLine(lines[i]).map((col) => col.replace(/^"|"$/g, '').trim());
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    const nameVal = headerMap.name !== undefined ? row[headerMap.name] : '';
    if (!nameVal) continue;

    const barcodeVal = headerMap.barcode !== undefined ? row[headerMap.barcode] : '';
    const categoryVal = headerMap.category !== undefined ? row[headerMap.category] : 'Miscelánea';
    const presentationVal = headerMap.presentation !== undefined ? row[headerMap.presentation] : 'Unidad';

    const parseNum = (val: any, fallback = 0) => {
      if (!val) return fallback;
      const num = Number(String(val).replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? fallback : num;
    };

    const purchasePrice = headerMap.purchase_price !== undefined ? parseNum(row[headerMap.purchase_price], 0) : 0;
    const salePrice = headerMap.sale_price !== undefined ? parseNum(row[headerMap.sale_price], 0) : 0;
    const stock = headerMap.stock !== undefined ? Math.round(parseNum(row[headerMap.stock], 0)) : 0;
    const minStock = headerMap.min_stock !== undefined ? Math.round(parseNum(row[headerMap.min_stock], 5)) : 5;

    products.push({
      barcode: barcodeVal || undefined,
      name: nameVal,
      category: categoryVal || 'Miscelánea',
      presentation: presentationVal || 'Unidad',
      purchase_price: purchasePrice,
      sale_price: salePrice,
      stock: stock,
      min_stock: minStock,
    });
  }

  return products;
}
