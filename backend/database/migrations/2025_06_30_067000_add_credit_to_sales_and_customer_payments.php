<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Añadir campos de crédito a ventas
        Schema::table('sales', function (Blueprint $table) {
            $table->string('payment_type')->default('cash')->after('payment_method'); // 'cash', 'credit'
            $table->string('payment_status')->default('paid')->after('payment_type'); // 'paid', 'partial', 'pending'
            $table->date('due_date')->nullable()->after('payment_status'); // Fecha límite para pagar el fiado
            $table->decimal('balance_due', 12, 2)->default(0)->after('change_given'); // Deuda restante del cliente

            $table->index(['customer_id', 'payment_status']);
        });

        // 2. Tabla de abonos o pagos de clientes (cuando el cliente viene a abonar a su deuda)
        Schema::create('customer_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('sale_id')->nullable()->constrained('sales')->nullOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->string('payment_method')->default('cash'); // 'cash', 'transfer'
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('payment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_payments');

        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex(['customer_id', 'payment_status']);
            $table->dropColumn(['payment_type', 'payment_status', 'due_date', 'balance_due']);
        });
    }
};
