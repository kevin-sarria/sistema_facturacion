@echo off
chcp 65001 > nul
title Papeleria Universal - Sistema de Facturacion y POS

cls
echo ======================================================================
echo          🏪 PAPELERIA UNIVERSAL - SISTEMA DE VENTAS Y CAJA
echo ======================================================================
echo.
echo  Iniciando los servicios del sistema, por favor espera un momento...
echo.

:: Obtener la ruta base
set BASE_DIR=%~dp0

:: Iniciar Servidor Backend (Laravel) en segundo plano
echo  [1/3] Iniciando servidor de base de datos y backend (puerto 8000)...
start "Papeleria Universal - Backend" cmd /c "title Papeleria - Backend && cd /d "%BASE_DIR%backend" && php artisan serve --port=8000"

:: Iniciar Frontend (Vite React) en segundo plano
echo  [2/3] Iniciando pantalla de ventas y mostrador (puerto 5173)...
start "Papeleria Universal - Frontend" cmd /c "title Papeleria - Frontend && cd /d "%BASE_DIR%frontend" && npm run dev"

:: Esperar a que los servicios respondan
echo  [3/3] Abriendo sistema en tu navegador web...
timeout /t 4 /nobreak > nul

:: Abrir navegador en el Punto de Venta
start http://localhost:5173

cls
echo ======================================================================
echo          🏪 PAPELERIA UNIVERSAL - LISTO PARA VENDER
echo ======================================================================
echo.
echo   El sistema ya esta abierto en tu navegador:
echo   --^> http://localhost:5173
echo.
echo   Credenciales de acceso rapido:
echo     Usuario:    admin@papeleria.com
echo     Contrasena: admin123
echo     (O usa el boton "Autollenar Demo" en la pantalla de inicio)
echo.
echo ======================================================================
echo  RECOMENDACION:
echo  No cierres esta ventana mientras estes atendiendo clientes en la papeleria.
echo  Para cerrar todo el sistema al final del dia, presiona cualquier tecla aqui.
echo ======================================================================
echo.

pause > nul

echo.
echo  Cerrando servicios del sistema...
taskkill /FI "WINDOWTITLE eq Papeleria - Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Papeleria - Frontend*" /F > nul 2>&1
echo  Sistema cerrado correctamente. Hasta manana!
timeout /t 2 > nul
exit
