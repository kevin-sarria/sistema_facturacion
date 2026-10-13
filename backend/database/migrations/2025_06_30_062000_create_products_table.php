<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->nullable()->unique();
            $table->string('sku')->nullable()->index();
            $table->string('name');
            $table->text('description')->nullable();
            
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            $table->foreignId('presentation_id')
                  ->nullable()
                  ->constrained('presentations')
                  ->nullOnDelete();

            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('profit_percentage', 5, 2)->default(30.00);
            $table->decimal('sale_price', 12, 2)->default(0);

            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(5);

            $table->boolean('has_iva')->default(false);
            $table->decimal('iva_percentage', 5, 2)->default(0.00);

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Índices para búsquedas de alta velocidad (esenciales para 10.000+ referencias)
            $table->index('name');
            $table->index(['is_active', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
