<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Presentation;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        \App\Models\SaleItem::truncate();
        \App\Models\Sale::truncate();
        \App\Models\CustomerPayment::truncate();
        \App\Models\SupplierPayment::truncate();
        \App\Models\PurchaseItem::truncate();
        \App\Models\Purchase::truncate();
        \App\Models\Supplier::truncate();
        Product::truncate();
        Category::truncate();
        Presentation::truncate();
        Customer::truncate();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Usuario Administrador / Cajero
        User::create([
            'name' => 'Cajero',
            'last_name' => 'Principal',
            'email' => 'admin@papeleria.com',
            'password' => Hash::make('admin123'),
        ]);

        // 2. Cliente Predeterminado Mostrador
        Customer::create([
            'document_type' => 'CC',
            'document_number' => '222222222222',
            'name' => 'Consumidor Final / Mostrador',
            'email' => null,
            'phone' => null,
            'address' => 'Venta en local',
        ]);

        // 3. Categorías
        $catEscritura = Category::create(['name' => 'Escritura y Corrección', 'description' => 'Lapiceros, lápices, borradores y correctores']);
        $catPapel = Category::create(['name' => 'Papeles y Cartulinas', 'description' => 'Resmas, cartulinas, papel silueta y bond']);
        $catCuadernos = Category::create(['name' => 'Cuadernos y Carpetas', 'description' => 'Cuadernos cosidos, argollados y carpetas']);
        $catPegantes = Category::create(['name' => 'Pegantes y Adhesivos', 'description' => 'Colbón, silicona, cintas adhesivas y pegastick']);
        $catArte = Category::create(['name' => 'Arte y Pintura', 'description' => 'Vinilos, témperas, pinceles y plastilinas']);
        $catOficina = Category::create(['name' => 'Oficina y Varios', 'description' => 'Grapas, clips, tijeras, reglas y calculadoras']);

        // 4. Presentaciones
        $presUnidad = Presentation::create(['name' => 'Unidad']);
        $presCaja12 = Presentation::create(['name' => 'Caja x 12']);
        $presCaja50 = Presentation::create(['name' => 'Caja x 50']);
        $presPaquete10 = Presentation::create(['name' => 'Paquete x 10']);
        $presResma = Presentation::create(['name' => 'Resma (500 hojas)']);
        $presPliego = Presentation::create(['name' => 'Pliego']);

        // 5. Catálogo Inicial con Códigos de Barras Reales de Papelería
        $products = [
            // Escritura
            [
                'barcode' => '7701025000018',
                'sku' => 'LAP-BIC-NEG',
                'name' => 'Bolígrafo BIC Cristal Negro',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 800,
                'profit_percentage' => 50,
                'sale_price' => 1200,
                'stock' => 120,
                'min_stock' => 20,
            ],
            [
                'barcode' => '7701025000025',
                'sku' => 'LAP-BIC-AZU',
                'name' => 'Bolígrafo BIC Cristal Azul',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 800,
                'profit_percentage' => 50,
                'sale_price' => 1200,
                'stock' => 150,
                'min_stock' => 20,
            ],
            [
                'barcode' => '7701025000032',
                'sku' => 'LAP-BIC-ROJ',
                'name' => 'Bolígrafo BIC Cristal Rojo',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 800,
                'profit_percentage' => 50,
                'sale_price' => 1200,
                'stock' => 80,
                'min_stock' => 15,
            ],
            [
                'barcode' => '7702111000129',
                'sku' => 'LAP-KILO-NEG',
                'name' => 'Bolígrafo Paper Mate Kilométrico 100 Negro',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 1000,
                'profit_percentage' => 40,
                'sale_price' => 1400,
                'stock' => 95,
                'min_stock' => 20,
            ],
            [
                'barcode' => '7702111000136',
                'sku' => 'LAP-MIRADO-2',
                'name' => 'Lápiz Grafito Mirado No. 2 HB',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 700,
                'profit_percentage' => 42.85,
                'sale_price' => 1000,
                'stock' => 110,
                'min_stock' => 25,
            ],
            [
                'barcode' => '7702111000143',
                'sku' => 'BOR-NATA-FABER',
                'name' => 'Borrador de Nata Faber-Castell Pequeño',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 500,
                'profit_percentage' => 60,
                'sale_price' => 800,
                'stock' => 70,
                'min_stock' => 15,
            ],
            [
                'barcode' => '7702111000150',
                'sku' => 'COR-LIQUIDO-LP',
                'name' => 'Corrector Líquido Lápiz Liquid Paper 7ml',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 2500,
                'profit_percentage' => 40,
                'sale_price' => 3500,
                'stock' => 40,
                'min_stock' => 10,
            ],
            [
                'barcode' => '7702111000167',
                'sku' => 'MAR-SHARPIE-NEG',
                'name' => 'Marcador Permanente Sharpie Negro Punta Fina',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 2800,
                'profit_percentage' => 42.85,
                'sale_price' => 4000,
                'stock' => 35,
                'min_stock' => 8,
            ],
            [
                'barcode' => '7702111000174',
                'sku' => 'RES-SHARPIE-AMA',
                'name' => 'Resaltador Sharpie Tank Amarillo',
                'category_id' => $catEscritura->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 2000,
                'profit_percentage' => 40,
                'sale_price' => 2800,
                'stock' => 45,
                'min_stock' => 10,
            ],
            // Papeles y Cartulinas
            [
                'barcode' => '7703056001015',
                'sku' => 'RES-REPRO-CART',
                'name' => 'Resma Papel Carta Reprograf 75g (500 Hojas)',
                'category_id' => $catPapel->id,
                'presentation_id' => $presResma->id,
                'purchase_price' => 15500,
                'profit_percentage' => 29,
                'sale_price' => 20000,
                'stock' => 25,
                'min_stock' => 5,
            ],
            [
                'barcode' => '7703056001022',
                'sku' => 'RES-REPRO-OFIC',
                'name' => 'Resma Papel Oficio Reprograf 75g (500 Hojas)',
                'category_id' => $catPapel->id,
                'presentation_id' => $presResma->id,
                'purchase_price' => 17500,
                'profit_percentage' => 31.42,
                'sale_price' => 23000,
                'stock' => 18,
                'min_stock' => 5,
            ],
            [
                'barcode' => '7703056001039',
                'sku' => 'CAR-BLANCA-PLI',
                'name' => 'Cartulina Blanca Pliego Entero',
                'category_id' => $catPapel->id,
                'presentation_id' => $presPliego->id,
                'purchase_price' => 800,
                'profit_percentage' => 62.5,
                'sale_price' => 1300,
                'stock' => 85,
                'min_stock' => 20,
            ],
            [
                'barcode' => '7703056001046',
                'sku' => 'PAP-KRAFT-PLI',
                'name' => 'Papel Kraft / Madera Pliego',
                'category_id' => $catPapel->id,
                'presentation_id' => $presPliego->id,
                'purchase_price' => 700,
                'profit_percentage' => 71.4,
                'sale_price' => 1200,
                'stock' => 60,
                'min_stock' => 15,
            ],
            // Pegantes y Adhesivos
            [
                'barcode' => '7704089002012',
                'sku' => 'PEG-COLBON-110',
                'name' => 'Pegante Colbón Clásico 110g',
                'category_id' => $catPegantes->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 2200,
                'profit_percentage' => 45.45,
                'sale_price' => 3200,
                'stock' => 30,
                'min_stock' => 8,
            ],
            [
                'barcode' => '7704089002029',
                'sku' => 'PEG-STICK-UHU',
                'name' => 'Pegamento en Barra Pegastick 20g',
                'category_id' => $catPegantes->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 1800,
                'profit_percentage' => 44.4,
                'sale_price' => 2600,
                'stock' => 40,
                'min_stock' => 10,
            ],
            [
                'barcode' => '7704089002036',
                'sku' => 'CIN-TRANSP-12X40',
                'name' => 'Cinta Transparente 12mm x 40m Pegafan',
                'category_id' => $catPegantes->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 1200,
                'profit_percentage' => 50,
                'sale_price' => 1800,
                'stock' => 50,
                'min_stock' => 12,
            ],
            [
                'barcode' => '7704089002043',
                'sku' => 'CIN-ENMASC-18X40',
                'name' => 'Cinta de Enmascarar 18mm x 40m',
                'category_id' => $catPegantes->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 2500,
                'profit_percentage' => 40,
                'sale_price' => 3500,
                'stock' => 25,
                'min_stock' => 6,
            ],
            // Cuadernos y Carpetas
            [
                'barcode' => '7705123003018',
                'sku' => 'CUA-NORMA-100C',
                'name' => 'Cuaderno Norma Jean Book 100 Hojas Cuadriculado',
                'category_id' => $catCuadernos->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 4800,
                'profit_percentage' => 41.6,
                'sale_price' => 6800,
                'stock' => 65,
                'min_stock' => 15,
            ],
            [
                'barcode' => '7705123003025',
                'sku' => 'CUA-NORMA-100F',
                'name' => 'Cuaderno Norma Jean Book 100 Hojas Ferrocarril',
                'category_id' => $catCuadernos->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 4800,
                'profit_percentage' => 41.6,
                'sale_price' => 6800,
                'stock' => 40,
                'min_stock' => 10,
            ],
            [
                'barcode' => '7705123003032',
                'sku' => 'CARP-YUTE-OFIC',
                'name' => 'Carpeta Yute Café Tamaño Oficio con Gancho',
                'category_id' => $catCuadernos->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 1100,
                'profit_percentage' => 54.5,
                'sale_price' => 1700,
                'stock' => 90,
                'min_stock' => 20,
            ],
            // Arte y Pintura
            [
                'barcode' => '7706234004014',
                'sku' => 'VIN-FRANCO-6COL',
                'name' => 'Caja de Vinilos Franco x 6 Colores Escolares',
                'category_id' => $catArte->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 6200,
                'profit_percentage' => 45.16,
                'sale_price' => 9000,
                'stock' => 28,
                'min_stock' => 8,
            ],
            [
                'barcode' => '7706234004021',
                'sku' => 'PLA-PELIKAN-12',
                'name' => 'Plastilina Pelikan Barra x 12 Colores',
                'category_id' => $catArte->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 3800,
                'profit_percentage' => 44.7,
                'sale_price' => 5500,
                'stock' => 32,
                'min_stock' => 8,
            ],
            // Oficina y Varios
            [
                'barcode' => '7707345005019',
                'sku' => 'TIJ-ESCOLAR-ROMA',
                'name' => 'Tijera Escolar Punta Roma 5 Pulgadas',
                'category_id' => $catOficina->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 1800,
                'profit_percentage' => 50,
                'sale_price' => 2700,
                'stock' => 45,
                'min_stock' => 10,
            ],
            [
                'barcode' => '7707345005026',
                'sku' => 'REG-ACRIL-30CM',
                'name' => 'Regla Plástica Transparente 30 cm',
                'category_id' => $catOficina->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 900,
                'profit_percentage' => 66.6,
                'sale_price' => 1500,
                'stock' => 55,
                'min_stock' => 15,
            ],
            [
                'barcode' => '7707345005033',
                'sku' => 'CLI-MARIPOSA-CJA',
                'name' => 'Caja de Clips Mariposa No. 2 x 50 Unds',
                'category_id' => $catOficina->id,
                'presentation_id' => $presUnidad->id,
                'purchase_price' => 1500,
                'profit_percentage' => 46.6,
                'sale_price' => 2200,
                'stock' => 40,
                'min_stock' => 10,
            ],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }

        // 6. Proveedores Reales de Papelería
        $provPapel = \App\Models\Supplier::create([
            'name' => 'Distribuidora Papelera Nacional SAS',
            'tax_id' => '900.123.456-7',
            'contact_name' => 'Carlos Mendoza (Asesor Comercial)',
            'phone' => '(601) 320-1122',
            'contact_phone' => '310 456 7890',
            'email' => 'ventas@papeleranacional.com',
            'address' => 'Zona Industrial Calle 17 # 38-20',
            'notes' => 'Pasa pedidos los martes, entrega los jueves.',
        ]);

        $provUtiles = \App\Models\Supplier::create([
            'name' => 'Comercializadora Escolar & Oficina Ltda',
            'tax_id' => '800.987.654-1',
            'contact_name' => 'Paola Gómez (Representante)',
            'phone' => '(601) 450-8899',
            'contact_phone' => '315 889 0011',
            'email' => 'paola.gomez@escolaryoficina.com',
            'address' => 'Cra 24 # 12-45',
            'notes' => 'Otorga 30 días de crédito a partir de $500.000.',
        ]);

        // Factura de compra a crédito pendiente
        \App\Models\Purchase::create([
            'supplier_id' => $provPapel->id,
            'invoice_number' => 'FAC-98421',
            'purchase_date' => now()->subDays(10)->toDateString(),
            'due_date' => now()->addDays(20)->toDateString(),
            'payment_type' => 'credit',
            'payment_status' => 'pending',
            'subtotal' => 650000,
            'tax_amount' => 0,
            'total_amount' => 650000,
            'paid_amount' => 0,
            'balance_due' => 650000,
            'notes' => 'Pedido de 30 resmas de papel y cartulinas surtidas.',
        ]);

        // Factura de compra con abono parcial
        \App\Models\Purchase::create([
            'supplier_id' => $provUtiles->id,
            'invoice_number' => 'INV-44120',
            'purchase_date' => now()->subDays(25)->toDateString(),
            'due_date' => now()->addDays(5)->toDateString(),
            'payment_type' => 'credit',
            'payment_status' => 'partial',
            'subtotal' => 480000,
            'tax_amount' => 0,
            'total_amount' => 480000,
            'paid_amount' => 200000,
            'balance_due' => 280000,
            'notes' => 'Cajas de bolígrafos BIC y cuadernos Norma.',
        ]);

        // 7. Cliente de Barrio con Crédito / Fiado
        $clienteVecina = \App\Models\Customer::create([
            'document_type' => 'CC',
            'document_number' => '52345678',
            'name' => 'Profesora Carmen Elena (Colegio)',
            'phone' => '312 334 5566',
            'email' => 'carmen.elena@gmail.com',
            'address' => 'Casa esquinera frente al colegio',
        ]);

        // Venta a crédito de prueba
        \App\Models\Sale::create([
            'invoice_number' => 'TKT-000001',
            'user_id' => 1,
            'customer_id' => $clienteVecina->id,
            'payment_type' => 'credit',
            'payment_status' => 'partial',
            'payment_method' => 'cash',
            'due_date' => now()->addDays(7)->toDateString(),
            'subtotal' => 45000,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 45000,
            'amount_paid' => 15000,
            'change_given' => 0,
            'balance_due' => 30000,
            'notes' => 'Llevó 5 cuadernos y vinilos para los alumnos. Abonó $15.000.',
            'status' => 'completed',
        ]);
    }
}
