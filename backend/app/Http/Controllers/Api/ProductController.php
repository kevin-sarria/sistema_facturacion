<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductController extends Controller
{
    protected ProductImportService $importService;

    public function __construct(ProductImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Listado paginado con filtros
     */
    public function index(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 15);
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $lowStock = $request->boolean('low_stock');

        $query = Product::with(['category', 'presentation'])
            ->where('is_active', true);

        if ($search) {
            $query->search($search);
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($lowStock) {
            $query->lowStock();
        }

        $products = $query->orderBy('name', 'asc')->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Búsqueda ultrarrápida para el POS (lector de barras o autocompletado en mostrador)
     */
    public function search(Request $request): JsonResponse
    {
        $term = trim($request->query('q', ''));

        if (empty($term)) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        // Si coincide exactamente con un código de barras, devolverlo de inmediato
        $exactBarcode = Product::with('presentation')
            ->where('barcode', $term)
            ->where('is_active', true)
            ->first();

        if ($exactBarcode) {
            return response()->json([
                'success' => true,
                'data' => [$exactBarcode],
                'exact_match' => true
            ]);
        }

        // Búsqueda rápida por nombre (limitado a 15 resultados para máxima velocidad)
        $products = Product::with('presentation')
            ->where('is_active', true)
            ->where(function ($q) use ($term) {
                $q->where('name', 'LIKE', "%{$term}%")
                  ->orWhere('sku', 'LIKE', "%{$term}%");
            })
            ->limit(15)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'exact_match' => false
        ]);
    }

    /**
     * Crear un producto individual
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'barcode' => 'nullable|string|max:100|unique:products,barcode',
            'sku' => 'nullable|string|max:100',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'presentation_id' => 'nullable|exists:presentations,id',
            'purchase_price' => 'required|numeric|min:0',
            'profit_percentage' => 'nullable|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'has_iva' => 'nullable|boolean',
            'iva_percentage' => 'nullable|numeric|min:0',
        ]);

        $product = Product::create($validated);
        $product->load(['category', 'presentation']);

        return response()->json([
            'success' => true,
            'message' => 'Producto creado exitosamente.',
            'data' => $product
        ], 201);
    }

    /**
     * Ver producto por ID
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with(['category', 'presentation'])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Actualizar producto
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'barcode' => 'nullable|string|max:100|unique:products,barcode,' . $id,
            'sku' => 'nullable|string|max:100',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'presentation_id' => 'nullable|exists:presentations,id',
            'purchase_price' => 'sometimes|required|numeric|min:0',
            'profit_percentage' => 'nullable|numeric|min:0',
            'sale_price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'has_iva' => 'nullable|boolean',
            'iva_percentage' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $product->update($validated);
        $product->load(['category', 'presentation']);

        return response()->json([
            'success' => true,
            'message' => 'Producto actualizado.',
            'data' => $product
        ]);
    }

    /**
     * Desactivar o eliminar producto
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado.'
            ], 404);
        }

        // Desactivación lógica para no romper historial de ventas anteriores
        $product->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado del catálogo.'
        ]);
    }

    /**
     * Importación masiva desde archivo CSV (soporta 10.000+ referencias)
     */
    public function importCsv(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:20480' // hasta 20MB
        ]);

        try {
            $result = $this->importService->importFromCsv($request->file('file'));

            return response()->json([
                'success' => true,
                'message' => "Proceso completado: {$result['imported']} productos nuevos, {$result['updated']} actualizados.",
                'data' => $result
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al importar: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Importación masiva desde datos JSON estructurados (provenientes de Excel o CSV procesado)
     */
    public function importJson(Request $request): JsonResponse
    {
        $request->validate([
            'products' => 'required|array|min:1',
        ]);

        try {
            $result = $this->importService->importFromArray($request->input('products'));

            return response()->json([
                'success' => true,
                'message' => "Proceso completado: {$result['imported']} productos nuevos, {$result['updated']} actualizados.",
                'data' => $result
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al importar: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Descarga de plantilla CSV
     */
    public function downloadTemplate(): StreamedResponse
    {
        $csvContent = $this->importService->generateTemplateCsv();

        return response()->streamDownload(function () use ($csvContent) {
            echo "\xEF\xBB\xBF"; // UTF-8 BOM para que Excel en Windows reconozca tildes y caracteres
            echo $csvContent;
        }, 'plantilla_productos_papeleria.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
