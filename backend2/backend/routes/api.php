<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/hola', function() {
    return "hola";
});

// Registrar usuario
Route::post('/registro', [AuthController::class, 'register']);
Route::post('/registro', [AuthController::class, 'register']);