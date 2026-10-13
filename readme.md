# 📦 Sistema de Facturación, POS e Inventario - Papelería Universal

Sistema integral de punto de venta (POS), control de inventario masivo (10.000+ referencias), cuaderno de créditos/fiados a clientes, gestión de compras/proveedores y arqueo diario de caja, diseñado especialmente para **pequeñas empresas y negocios de barrio con poco conocimiento técnico**.

---

## 🚀 Inicio Rápido

### Opción A (Recomendada: 1 Solo Clic para el Negocio):
Haz **doble clic** sobre el archivo [`iniciar_sistema.bat`](file:///c:/Users/Estaduardo/Documents/proyectos/sistema_facturacion/iniciar_sistema.bat) en la raíz del proyecto.
* Se iniciarán automáticamente el servidor backend de Laravel y la interfaz web de React.
* Se abrirá automáticamente tu navegador en `http://localhost:5173`.
* Para cerrar el sistema al finalizar el día, solo presiona cualquier tecla en la consola o haz doble clic en [`detener_sistema.bat`](file:///c:/Users/Estaduardo/Documents/proyectos/sistema_facturacion/detener_sistema.bat).

---

### Opción B (Manual para Desarrolladores):

1. **Backend (Laravel 11)**:
   ```powershell
   cd backend
   php artisan serve
   ```
   Disponible en `http://localhost:8000`.

2. **Frontend (React 18 + Vite)**:
   ```powershell
   cd frontend
   npm run dev
   ```
   Disponible en `http://localhost:5173`.

---

## 🔑 Credenciales de Acceso
* **Usuario:** `admin@papeleria.com`
* **Contraseña:** `admin123`
*(En la pantalla de login también dispones de un botón directo: **"Ingreso Rápido (Cajero Principal)"**).*

---

## 🌟 Módulos y Flujos Diseñados para No Técnicos

### 1. 🛒 Caja Mostrador (Punto de Venta Ultrarrápido)
* **Lector de Código de Barras con Foco Automático:** Solo pasa la pistola sobre el producto y se agregará inmediatamente al ticket sin tocar el ratón.
* **Búsqueda Predictiva:** Si el producto no tiene código de barras (ej. *borrador de nata*), escribe 2 letras y selecciónalo al instante.
* **Al Contado:** Ingresa el billete con el que paga el cliente y el sistema muestra en **verde gigante las vueltas / cambio**.
* **A Crédito (Fiado):** Selecciona el cliente o presiona `+ Nuevo Cliente` para registrarlo en 5 segundos. Permite fijar fecha límite y guardar abonos iniciales.
* **Impresión de Ticket Térmico:** Formato adaptado para impresoras de 80mm y 58mm.

### 2. 📖 El Cuaderno de Fiados (Créditos a Clientes)
* Tarjeta con el total de dinero en la calle por cobrar.
* Semáforo de vencimientos para saber qué cuentas están por vencer.
* Botón **"Abonar"** con 1 clic: ingresas el dinero abonado (en efectivo o transferencia Nequi/Daviplata) y descuenta la deuda automáticamente.

### 3. 📦 Catálogo e Inventario Masivo (10.000+ Referencias)
* **Carga Masiva con Excel/CSV:** Permite subir el catálogo completo de distribuidores en segundos sin saturar memoria.
* **Auto-creación de categorías:** Si el archivo trae categorías nuevas, el sistema las crea automáticamente.
* **Botón de Descarga de Plantilla:** Para abrir en Excel, llenar y subir.
* **Filtro de "Stock Bajo / Por Agotar":** Muestra en rojo los artículos que requieren nuevo pedido al proveedor.

### 4. 🚚 Proveedores & Cuentas por Pagar
* Directorio de proveedores con nombres, teléfonos y celular del asesor comercial.
* **Ingreso de Mercancía Recibida:** Registra la factura del proveedor, actualiza los costos de compra y **suma las existencias al inventario automáticamente**.
* Análisis de cuentas por pagar: Facturas pendientes, facturas vencidas y botón para registrar abonos con número de comprobante.

### 5. 💰 Control Diario y Arqueo de Caja
* **Apertura de Turno:** Ingresa la base en efectivo dejada para cambio (ej. $50.000).
* **Seguimiento en Vivo:** Separa ventas en efectivo de pagos electrónicos.
* **Cierre en 1 Clic:** Cuenta los billetes del cajón, digita el monto y el sistema calcula si la caja está exacta, si sobra o si falta dinero.

---

## 🛠️ Tecnologías y Arquitectura

* **Backend:** PHP 8.2+ · Laravel 11 · MariaDB/MySQL · Sanctum · Transacciones concurrentes seguras (`lockForUpdate`).
* **Frontend:** React 18 · TypeScript · Vite · Tailwind CSS · Radix UI Primitives (shadcn) para control total de portales sin conflictos de estilos · Zustand · Axios.