<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\SupplierPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    /**
     * Listado de facturas de compra
     */
    public function index(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 20);
        $supplierId = $request->query('supplier_id');
        $paymentStatus = $request->query('payment_status'); // 'paid', 'pending', 'partial'
        $paymentType = $request->query('payment_type'); // 'cash', 'credit'

        $query = Purchase::with(['supplier', 'items.product', 'payments'])
            ->orderBy('purchase_date', 'desc')
            ->orderBy('id', 'desc');

        if ($supplierId) {
            $query->where('supplier_id', $supplierId);
        }

        if ($paymentStatus) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($paymentType) {
            $query->where('payment_type', $paymentType);
        }

        $purchases = $query->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $purchases
        ]);
    }

    /**
     * Registrar factura de compra recibida
     * Aumenta inventario y actualiza precios de compra automáticamente
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'invoice_number' => 'required|string|max:100',
            'purchase_date' => 'required|date',
            'due_date' => 'nullable|date',
            'payment_type' => 'required|string|in:cash,credit',
            'paid_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.cost_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['cost_price'];
                $subtotal += $lineTotal;

                // Aumentar stock del producto y actualizar costo de compra
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->increment('stock', $item['quantity']);
                    
                    // Actualizar precio de compra y recalcular precio de venta según el margen
                    $product->purchase_price = $item['cost_price'];
                    if ($product->profit_percentage > 0) {
                        $product->sale_price = round($item['cost_price'] * (1 + ($product->profit_percentage / 100)), 2);
                    }
                    $product->save();
                }

                $itemsData[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'cost_price' => $item['cost_price'],
                    'subtotal' => $lineTotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $totalAmount = $subtotal;
            $paidAmount = (float) $validated['paid_amount'];
            $paymentType = $validated['payment_type'];

            if ($paymentType === 'credit') {
                $balanceDue = max(0, $totalAmount - $paidAmount);
                $paymentStatus = ($paidAmount >= $totalAmount) ? 'paid' : (($paidAmount > 0) ? 'partial' : 'pending');
            } else {
                $paidAmount = $totalAmount;
                $balanceDue = 0;
                $paymentStatus = 'paid';
            }

            $purchase = Purchase::create([
                'supplier_id' => $validated['supplier_id'],
                'invoice_number' => $validated['invoice_number'],
                'purchase_date' => $validated['purchase_date'],
                'due_date' => $validated['due_date'] ?? ($paymentType === 'credit' ? now()->addDays(30)->toDateString() : null),
                'payment_type' => $paymentType,
                'payment_status' => $paymentStatus,
                'subtotal' => $subtotal,
                'tax_amount' => 0,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'balance_due' => $balanceDue,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as &$it) {
                $it['purchase_id'] = $purchase->id;
            }
            PurchaseItem::insert($itemsData);

            if ($paidAmount > 0) {
                SupplierPayment::create([
                    'purchase_id' => $purchase->id,
                    'amount' => $paidAmount,
                    'payment_date' => $validated['purchase_date'],
                    'payment_method' => ($paymentType === 'cash') ? 'cash' : 'transfer',
                    'notes' => 'Pago inicial al registrar factura',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Factura de compra registrada y stock actualizado con éxito.',
                'data' => $purchase->fresh(['supplier', 'items.product', 'payments'])
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar factura de compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registrar un abono o pago a una factura de proveedor
     */
    public function addPayment(Request $request, int $id): JsonResponse
    {
        $purchase = Purchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Factura de compra no encontrada.'
            ], 404);
        }

        if ($purchase->balance_due <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Esta factura ya se encuentra totalmente saldada.'
            ], 400);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,transfer,check',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $amount = (float) $validated['amount'];
        $newBalance = max(0, $purchase->balance_due - $amount);
        $newPaidAmount = $purchase->paid_amount + $amount;
        $newStatus = ($newBalance <= 0) ? 'paid' : 'partial';

        DB::beginTransaction();

        try {
            $payment = SupplierPayment::create([
                'purchase_id' => $purchase->id,
                'amount' => $amount,
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'reference' => $validated['reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            $purchase->update([
                'paid_amount' => $newPaidAmount,
                'balance_due' => $newBalance,
                'payment_status' => $newStatus,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Abono al proveedor registrado correctamente.',
                'data' => [
                    'payment' => $payment,
                    'purchase' => $purchase->fresh(['supplier', 'payments'])
                ]
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Análisis y resumen de facturas a proveedores (Cuentas por Pagar)
     */
    public function analysis(): JsonResponse
    {
        $totalOwed = Purchase::whereIn('payment_status', ['pending', 'partial'])->sum('balance_due');
        $totalPaid = Purchase::sum('paid_amount');
        $pendingCount = Purchase::whereIn('payment_status', ['pending', 'partial'])->count();
        $paidCount = Purchase::where('payment_status', 'paid')->count();

        // Facturas vencidas (due_date menor a hoy y con saldo)
        $overdueInvoices = Purchase::with('supplier')
            ->whereIn('payment_status', ['pending', 'partial'])
            ->where('due_date', '<', now()->toDateString())
            ->orderBy('due_date', 'asc')
            ->get();

        // Próximas a vencer (próximos 7 días)
        $upcomingDueInvoices = Purchase::with('supplier')
            ->whereIn('payment_status', ['pending', 'partial'])
            ->whereBetween('due_date', [now()->toDateString(), now()->addDays(7)->toDateString()])
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_owed' => (float) $totalOwed,
                'total_paid' => (float) $totalPaid,
                'pending_invoices_count' => $pendingCount,
                'paid_invoices_count' => $paidCount,
                'overdue_count' => $overdueInvoices->count(),
                'overdue_amount' => (float) $overdueInvoices->sum('balance_due'),
                'overdue_invoices' => $overdueInvoices,
                'upcoming_due_invoices' => $upcomingDueInvoices,
            ]
        ]);
    }
}
