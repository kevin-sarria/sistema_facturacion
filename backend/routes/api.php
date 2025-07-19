<?php

use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\PresentationController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/hola', function() {
    return 'Hola';
});

// Inventory routes
Route::get('/inventory', [InventoryController::class, 'index']);
Route::post('/inventory', [InventoryController::class, 'store']);
Route::get('/inventory/{id}', [InventoryController::class, 'show']);
Route::patch('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);

// Presentation routes
Route::get('/presentations', [PresentationController::class, 'index']);
Route::get('/presentation/{id}', [PresentationController::class, 'show']);
Route::post('/presentation', [PresentationController::class, 'store']);
Route::patch('/presentation/{id}', [PresentationController::class, 'update']);
Route::delete('/presentation/{id}', [PresentationController::class, 'destroy']);

Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
