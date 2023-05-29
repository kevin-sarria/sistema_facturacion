<?php

require_once "config/app.php";


use Classes\Tokens;
use Controllers\DashboardController;
use MVC\Router;
use Controllers\AuthController;

$router = new Router();

// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");

// Permitir solicitudes con los métodos GET, POST, PUT y DELETE
header("Access-Control-Allow-Methods: GET, POST");

// Permitir el envío de la cabecera "Authorization" y "Content-Type"
header("Access-Control-Allow-Headers: *");

// Establecer el tipo de contenido de la respuesta como JSON
header("Content-Type: application/json");


// Inicio de sesion y creacion de cuentas
$router->post('/', [AuthController::class, 'validarUsuario']);
$router->post('/crear-admin', [AuthController::class, 'crearAdmin']);

// Tokens
$router->get('/revalidar-token', [Tokens::class, 'reValidarToken']);

// Dashboard
$router->get('/inventario', [DashboardController::class, 'index']);

$router->comprobarRutas();


?>