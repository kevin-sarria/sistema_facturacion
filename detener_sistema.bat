@echo off
chcp 65001 > nul
title Apagar Papeleria Universal

echo ======================================================================
echo          🏪 APAGAR PAPELERIA UNIVERSAL
echo ======================================================================
echo.
echo  Cerrando procesos de Backend y Frontend...

taskkill /FI "WINDOWTITLE eq Papeleria - Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Papeleria - Frontend*" /F > nul 2>&1

echo.
echo  [OK] El sistema se ha detenido correctamente.
timeout /t 2 > nul
exit
