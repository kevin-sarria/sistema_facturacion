<?php

use App\Http\Controllers\Api\CashShiftController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PresentationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Rutas Públicas de Autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Descarga de plantilla CSV de productos (pública para facilitar soporte)
Route::get('/products/template', [ProductController::class, 'downloadTemplate']);

// Rutas del Sistema POS y Gestión
Route::prefix('')->group(function () {
    // Auth & Perfil
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Productos e Inventario (Búsqueda rápida y catálogo)
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::post('/products/import-csv', [ProductController::class, 'importCsv']);
    Route::post('/products/import-json', [ProductController::class, 'importJson']);
    Route::apiResource('products', ProductController::class);

    // Punto de Venta (Ventas y Cobros)
    Route::get('/sales/summary-today', [SaleController::class, 'summaryToday']);
    Route::get('/sales/credits-summary', [SaleController::class, 'customerCreditsSummary']);
    Route::post('/sales/{id}/payment', [SaleController::class, 'addPayment']);
    Route::get('/sales', [SaleController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::get('/sales/{id}', [SaleController::class, 'show']);

    // Turnos de Caja (Apertura y Cierre / Arqueo)
    Route::get('/cash-shift/current', [CashShiftController::class, 'current']);
    Route::post('/cash-shift/open', [CashShiftController::class, 'open']);
    Route::post('/cash-shift/close', [CashShiftController::class, 'close']);

    // Clientes y Fiados
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);

    // Proveedores (Directorio, contactos de asesores)
    Route::apiResource('suppliers', SupplierController::class);

    // Facturas de Compra y Cuentas por Pagar (Créditos con Proveedores)
    Route::get('/purchases/analysis', [PurchaseController::class, 'analysis']);
    Route::post('/purchases/{id}/payment', [PurchaseController::class, 'addPayment']);
    Route::apiResource('purchases', PurchaseController::class);

    // Categorías y Presentaciones
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('presentations', PresentationController::class);
});
