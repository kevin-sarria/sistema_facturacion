<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            
            $table->decimal('initial_cash', 12, 2)->default(0); // Base de caja inicial
            $table->decimal('total_cash_sales', 12, 2)->default(0); // Total vendido en efectivo
            $table->decimal('total_electronic_sales', 12, 2)->default(0); // Total transferencias / tarjetas
            
            $table->decimal('expected_cash', 12, 2)->default(0); // initial_cash + total_cash_sales
            $table->decimal('actual_cash', 12, 2)->nullable(); // Lo que contó el cajero físicamente
            $table->decimal('difference', 12, 2)->nullable(); // Sobrante (+) o Faltante (-)
            
            $table->text('notes')->nullable();
            $table->string('status')->default('open'); // 'open', 'closed'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_shifts');
    }
};
