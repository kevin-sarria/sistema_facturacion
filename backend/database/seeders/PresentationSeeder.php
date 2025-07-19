<?php

namespace Database\Seeders;

use App\Models\Presentation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PresentationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Deshabilitar restricciones de clave foránea
        Schema::disableForeignKeyConstraints();

        // Primero vaciar la tabla hija (inventory)
        DB::table('inventory')->truncate();

        // Luego vaciar la tabla padre (presentation)
        DB::table('presentation')->truncate();

        // Habilitar restricciones nuevamente
        Schema::enableForeignKeyConstraints();

        $presentations = [
            ['name' => 'unidad', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'caja x12', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'paquete x10', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'lote x5', 'created_at' => now(), 'updated_at' => now()],
        ];

        Presentation::insert($presentations);
    }
}
