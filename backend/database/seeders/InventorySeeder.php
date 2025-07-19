<?php

namespace Database\Seeders;

use App\Models\Inventory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Aquí puedes agregar la lógica para poblar la tabla de inventario
        // Limpiar la tabla primero (opcional)
        DB::table('inventory')->truncate();

        $productos = [
            [
                'name' => 'Lapicero Bic',
                'quantity' => 2,
                'presentation_id' => 2,
                'purchase_price' => 12000,
                'profit_percentage' => 30,
                'sale_price' => 15600,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Cuaderno Norma',
                'quantity' => 10,
                'presentation_id' => 1,
                'purchase_price' => 8000,
                'profit_percentage' => 30,
                'sale_price' => 10400,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Marcador Borrable Pelikan',
                'quantity' => 30,
                'presentation_id' => 3,
                'purchase_price' => 2200,
                'profit_percentage' => 30,
                'sale_price' => 2900,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Tijeras Maped',
                'quantity' => 15,
                'presentation_id' => 1,
                'purchase_price' => 5000,
                'profit_percentage' => 30,
                'sale_price' => 6500,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Resaltador Faber-Castell',
                'quantity' => 25,
                'presentation_id' => 4,
                'purchase_price' => 1800,
                'profit_percentage' => 30,
                'sale_price' => 2340,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Goma de borrar Pelikan',
                'quantity' => 40,
                'presentation_id' => 1,
                'purchase_price' => 1000,
                'profit_percentage' => 30,
                'sale_price' => 1300,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Regla de plástico 30cm',
                'quantity' => 50,
                'presentation_id' => 1,
                'purchase_price' => 3000,
                'profit_percentage' => 30,
                'sale_price' => 3900,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Compás Staedtler',
                'quantity' => 20,
                'presentation_id' => 1,
                'purchase_price' => 7000,
                'profit_percentage' => 30,
                'sale_price' => 9100,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Calculadora Casio',
                'quantity' => 5,
                'presentation_id' => 1,
                'purchase_price' => 25000,
                'profit_percentage' => 30,
                'sale_price' => 32500,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Sacapuntas metálico',
                'quantity' => 35,
                'presentation_id' => 1,
                'purchase_price' => 1200,
                'profit_percentage' => 30,
                'sale_price' => 1560,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        Inventory::insert($productos);
    }
}
