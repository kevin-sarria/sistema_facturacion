<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Presentation;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ProductImportService
{
    /**
     * Importa un archivo CSV de productos por lotes (streaming),
     * optimizado para soportar más de 10.000 productos sin agotar memoria.
     */
    public function importFromCsv(UploadedFile|string $file): array
    {
        $filePath = is_string($file) ? $file : $file->getRealPath();

        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new \Exception("El archivo CSV no se puede leer.");
        }

        $handle = fopen($filePath, 'r');
        if (!$handle) {
            throw new \Exception("No se pudo abrir el archivo CSV.");
        }

        // Detectar delimitador (, o ;)
        $firstLine = fgets($handle);
        $delimiter = (strpos($firstLine, ';') !== false) ? ';' : ',';
        rewind($handle);

        // Leer cabeceras
        $headers = fgetcsv($handle, 0, $delimiter);
        if (!$headers) {
            fclose($handle);
            throw new \Exception("El archivo CSV está vacío.");
        }

        // Normalizar nombres de cabecera a minúsculas sin acentos
        $normalizedHeaders = array_map(function ($h) {
            $h = strtolower(trim($h));
            return preg_replace('/[^a-z0-9_]/', '', str_replace([' ', '-'], '_', $h));
        }, $headers);

        $categoriesCache = Category::pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [mb_strtolower(trim($name)) => $id];
        })->toArray();

        $presentationsCache = Presentation::pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [mb_strtolower(trim($name)) => $id];
        })->toArray();

        $importedCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;
        $batch = [];
        $batchSize = 250;

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                if (empty(array_filter($row))) {
                    continue; // Línea vacía
                }

                $data = @array_combine($normalizedHeaders, $row);
                if (!$data || empty($data['name']) && empty($data['nombre'])) {
                    $skippedCount++;
                    continue;
                }

                $name = trim($data['name'] ?? $data['nombre'] ?? '');
                $barcode = trim($data['barcode'] ?? $data['codigo_barras'] ?? $data['codigo'] ?? '') ?: null;
                $sku = trim($data['sku'] ?? $data['referencia'] ?? '') ?: null;
                $categoryName = trim($data['category'] ?? $data['categoria'] ?? 'Miscelánea');
                $presentationName = trim($data['presentation'] ?? $data['presentacion'] ?? 'Unidad');

                $purchasePrice = (float) str_replace(['$', ',', ' '], '', $data['purchase_price'] ?? $data['precio_compra'] ?? $data['costo'] ?? 0);
                $salePrice = (float) str_replace(['$', ',', ' '], '', $data['sale_price'] ?? $data['precio_venta'] ?? $data['precio'] ?? 0);
                $stock = (int) ($data['stock'] ?? $data['cantidad'] ?? 0);
                $minStock = (int) ($data['min_stock'] ?? $data['stock_minimo'] ?? 5);

                // Resolver o crear categoría al vuelo
                $catKey = mb_strtolower($categoryName);
                if (!isset($categoriesCache[$catKey])) {
                    $cat = Category::create(['name' => $categoryName]);
                    $categoriesCache[$catKey] = $cat->id;
                }
                $categoryId = $categoriesCache[$catKey];

                // Resolver o crear presentación al vuelo
                $presKey = mb_strtolower($presentationName);
                if (!isset($presentationsCache[$presKey])) {
                    $pres = Presentation::create(['name' => $presentationName]);
                    $presentationsCache[$presKey] = $pres->id;
                }
                $presentationId = $presentationsCache[$presKey];

                // Si no especificaron precio de compra o venta, calcular ganancia estimada del 30%
                $profitPercentage = 30.00;
                if ($purchasePrice > 0 && $salePrice > 0) {
                    $profitPercentage = round((($salePrice - $purchasePrice) / $purchasePrice) * 100, 2);
                } elseif ($purchasePrice > 0 && $salePrice <= 0) {
                    $salePrice = round($purchasePrice * 1.30, 2);
                }

                // Si ya existe por código de barras, actualizar stock y precio
                if ($barcode) {
                    $existing = Product::where('barcode', $barcode)->first();
                    if ($existing) {
                        $existing->update([
                            'name' => $name,
                            'sale_price' => $salePrice,
                            'purchase_price' => $purchasePrice,
                            'stock' => $stock,
                            'category_id' => $categoryId,
                            'presentation_id' => $presentationId,
                        ]);
                        $updatedCount++;
                        continue;
                    }
                }

                Product::create([
                    'barcode' => $barcode,
                    'sku' => $sku,
                    'name' => $name,
                    'category_id' => $categoryId,
                    'presentation_id' => $presentationId,
                    'purchase_price' => $purchasePrice,
                    'profit_percentage' => $profitPercentage,
                    'sale_price' => $salePrice,
                    'stock' => $stock,
                    'min_stock' => $minStock,
                    'is_active' => true,
                ]);

                $importedCount++;
            }

            DB::commit();
            fclose($handle);

            return [
                'success' => true,
                'imported' => $importedCount,
                'updated' => $updatedCount,
                'skipped' => $skippedCount,
                'total_processed' => $importedCount + $updatedCount + $skippedCount,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            fclose($handle);
            throw $e;
        }
    }

    /**
     * Importa productos a partir de un arreglo estructurado (proveniente de Excel o JSON)
     */
    public function importFromArray(array $rows): array
    {
        $categoriesCache = Category::pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [mb_strtolower(trim($name)) => $id];
        })->toArray();

        $presentationsCache = Presentation::pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [mb_strtolower(trim($name)) => $id];
        })->toArray();

        $importedCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;

        DB::beginTransaction();

        try {
            foreach ($rows as $data) {
                if (empty($data)) {
                    continue;
                }

                $name = trim($data['name'] ?? $data['nombre'] ?? $data['nombre_producto'] ?? '');
                if (!$name) {
                    $skippedCount++;
                    continue;
                }

                $barcode = trim($data['barcode'] ?? $data['codigo_barras'] ?? $data['codigo'] ?? '') ?: null;
                $sku = trim($data['sku'] ?? $data['referencia'] ?? '') ?: null;
                $categoryName = trim($data['category'] ?? $data['categoria'] ?? 'Miscelánea');
                $presentationName = trim($data['presentation'] ?? $data['presentacion'] ?? 'Unidad');

                $purchasePrice = (float) str_replace(['$', ',', ' '], '', $data['purchase_price'] ?? $data['precio_compra'] ?? $data['costo'] ?? 0);
                $salePrice = (float) str_replace(['$', ',', ' '], '', $data['sale_price'] ?? $data['precio_venta'] ?? $data['precio'] ?? 0);
                $stock = (int) ($data['stock'] ?? $data['cantidad'] ?? 0);
                $minStock = (int) ($data['min_stock'] ?? $data['stock_minimo'] ?? 5);

                // Resolver o crear categoría
                $catKey = mb_strtolower($categoryName);
                if (!isset($categoriesCache[$catKey])) {
                    $cat = Category::create(['name' => $categoryName]);
                    $categoriesCache[$catKey] = $cat->id;
                }
                $categoryId = $categoriesCache[$catKey];

                // Resolver o crear presentación
                $presKey = mb_strtolower($presentationName);
                if (!isset($presentationsCache[$presKey])) {
                    $pres = Presentation::create(['name' => $presentationName]);
                    $presentationsCache[$presKey] = $pres->id;
                }
                $presentationId = $presentationsCache[$presKey];

                // Ganancia
                $profitPercentage = 30.00;
                if ($purchasePrice > 0 && $salePrice > 0) {
                    $profitPercentage = round((($salePrice - $purchasePrice) / $purchasePrice) * 100, 2);
                } elseif ($purchasePrice > 0 && $salePrice <= 0) {
                    $salePrice = round($purchasePrice * 1.30, 2);
                }

                // Actualizar si existe por código de barras
                if ($barcode) {
                    $existing = Product::where('barcode', $barcode)->first();
                    if ($existing) {
                        $existing->update([
                            'name' => $name,
                            'sale_price' => $salePrice,
                            'purchase_price' => $purchasePrice,
                            'stock' => $stock,
                            'category_id' => $categoryId,
                            'presentation_id' => $presentationId,
                        ]);
                        $updatedCount++;
                        continue;
                    }
                }

                Product::create([
                    'barcode' => $barcode,
                    'sku' => $sku,
                    'name' => $name,
                    'category_id' => $categoryId,
                    'presentation_id' => $presentationId,
                    'purchase_price' => $purchasePrice,
                    'profit_percentage' => $profitPercentage,
                    'sale_price' => $salePrice,
                    'stock' => $stock,
                    'min_stock' => $minStock,
                    'is_active' => true,
                ]);

                $importedCount++;
            }

            DB::commit();

            return [
                'success' => true,
                'imported' => $importedCount,
                'updated' => $updatedCount,
                'skipped' => $skippedCount,
                'total_processed' => $importedCount + $updatedCount + $skippedCount,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Genera contenido CSV de plantilla para el cliente
     */
    public function generateTemplateCsv(): string
    {
        $headers = ['codigo_barras', 'nombre', 'categoria', 'presentacion', 'precio_compra', 'precio_venta', 'stock', 'stock_minimo'];
        $example = [
            ['7701025000018', 'Bolígrafo BIC Cristal Negro', 'Escritura y Corrección', 'Unidad', '800', '1200', '100', '20'],
            ['7703056001015', 'Resma Papel Carta Reprograf', 'Papeles y Cartulinas', 'Resma (500 hojas)', '15500', '20000', '25', '5'],
            ['', 'Borrador de Nata Pelikan', 'Escritura y Corrección', 'Unidad', '600', '1000', '50', '10'],
        ];

        $output = fopen('php://temp', 'r+');
        fputcsv($output, $headers);
        foreach ($example as $row) {
            fputcsv($output, $row);
        }
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }
}
