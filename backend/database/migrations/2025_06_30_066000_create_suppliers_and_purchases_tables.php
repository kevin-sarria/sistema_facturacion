<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de empresa / distribuidora
            $table->string('tax_id')->nullable()->index(); // NIT o RUT
            $table->string('contact_name')->nullable(); // Nombre del asesor / vendedor
            $table->string('phone')->nullable(); // Teléfono fijo o PBX
            $table->string('contact_phone')->nullable(); // Celular del asesor
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete();
            $table->string('invoice_number'); // Número de factura que nos entregó el proveedor
            $table->date('purchase_date');
            $table->date('due_date')->nullable(); // Vencimiento si es a crédito (ej. 30 días)
            
            $table->string('payment_type')->default('cash'); // 'cash', 'credit'
            $table->string('payment_status')->default('paid'); // 'paid', 'partial', 'pending'
            
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('balance_due', 12, 2)->default(0); // Deuda pendiente con el proveedor
            
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['supplier_id', 'payment_status']);
            $table->index('due_date');
        });

        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained('purchases')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity');
            $table->decimal('cost_price', 12, 2); // Costo al que nos lo vendió el proveedor
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });

        Schema::create('supplier_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained('purchases')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->string('payment_method')->default('transfer'); // 'cash', 'transfer', 'check'
            $table->string('reference')->nullable(); // Núm. comprobante / transferencia
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_payments');
        Schema::dropIfExists('purchase_items');
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('suppliers');
    }
};
