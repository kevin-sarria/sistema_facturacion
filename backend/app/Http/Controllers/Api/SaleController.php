<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CashShift;
use App\Models\Customer;
use App\Models\CustomerPayment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Listado de ventas (historial) con soporte para filtrar solo créditos o por estado
     */
    public function index(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 20);
        $date = $request->query('date');
        $paymentType = $request->query('payment_type'); // 'cash' o 'credit'
        $paymentStatus = $request->query('payment_status'); // 'paid', 'pending', 'partial'
        $customerId = $request->query('customer_id');

        $query = Sale::with(['user', 'customer', 'items'])
            ->orderBy('id', 'desc');

        if ($date) {
            $query->whereDate('created_at', $date);
        }

        if ($paymentType) {
            $query->where('payment_type', $paymentType);
        }

        if ($paymentStatus) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($customerId) {
            $query->where('customer_id', $customerId);
        }

        $sales = $query->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $sales
        ]);
    }

    /**
     * Procesar una venta del Punto de Venta (Contado o Fiado / Crédito)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'payment_type' => 'required|string|in:cash,credit', // Contado o Fiado
            'payment_method' => 'required|string|in:cash,transfer,card,mixed',
            'amount_paid' => 'required|numeric|min:0',
            'due_date' => 'nullable|date', // Si es fiado, fecha límite
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $userId = $request->user()?->id ?? 1;

        // Si es a crédito y no seleccionaron cliente o seleccionaron "Consumidor Final" ID 1
        $customerId = $validated['customer_id'] ?? 1;
        if ($validated['payment_type'] === 'credit' && $customerId == 1) {
            return response()->json([
                'success' => false,
                'message' => 'Para otorgar un crédito (fiado) debe seleccionar o crear un cliente con nombre.'
            ], 422);
        }

        // Buscar si hay turno de caja abierto
        $activeShift = CashShift::where('status', 'open')
            ->where('user_id', $userId)
            ->latest('opened_at')
            ->first();

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $itemsToCreate = [];

            foreach ($validated['items'] as $itemData) {
                $product = Product::lockForUpdate()->find($itemData['product_id']);

                if (!$product) {
                    throw new \Exception("El producto ID {$itemData['product_id']} no existe.");
                }

                if ($product->stock < $itemData['quantity']) {
                    throw new \Exception("Stock insuficiente para '{$product->name}'. Disponible: {$product->stock}, Solicitado: {$itemData['quantity']}.");
                }

                // Descontar inventario
                $product->decrement('stock', $itemData['quantity']);

                $itemSubtotal = $itemData['quantity'] * $itemData['unit_price'];
                $subtotal += $itemSubtotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'barcode' => $product->barcode,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'cost_price' => $product->purchase_price,
                    'subtotal' => $itemSubtotal,
                    'tax_amount' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $totalAmount = $subtotal;
            $amountPaid = (float) $validated['amount_paid'];
            $paymentType = $validated['payment_type'];

            if ($paymentType === 'credit') {
                $balanceDue = max(0, $totalAmount - $amountPaid);
                $changeGiven = 0;
                $paymentStatus = ($amountPaid >= $totalAmount) ? 'paid' : (($amountPaid > 0) ? 'partial' : 'pending');
            } else {
                $balanceDue = 0;
                $changeGiven = max(0, $amountPaid - $totalAmount);
                $paymentStatus = 'paid';
            }

            // Generar número correlativo de factura
            $lastId = Sale::max('id') ?? 0;
            $invoiceNumber = 'TKT-' . str_pad($lastId + 1, 6, '0', STR_PAD_LEFT);

            $sale = Sale::create([
                'invoice_number' => $invoiceNumber,
                'user_id' => $userId,
                'customer_id' => $customerId,
                'cash_shift_id' => $activeShift?->id,
                'payment_type' => $paymentType,
                'payment_status' => $paymentStatus,
                'payment_method' => $validated['payment_method'],
                'due_date' => $validated['due_date'] ?? ($paymentType === 'credit' ? now()->addDays(15)->toDateString() : null),
                'subtotal' => $subtotal,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'amount_paid' => $amountPaid,
                'change_given' => $changeGiven,
                'balance_due' => $balanceDue,
                'notes' => $validated['notes'] ?? null,
                'status' => 'completed',
            ]);

            foreach ($itemsToCreate as &$item) {
                $item['sale_id'] = $sale->id;
            }
            SaleItem::insert($itemsToCreate);

            // Si fue a crédito pero hubo un abono inicial, registrar el comprobante de pago
            if ($paymentType === 'credit' && $amountPaid > 0) {
                CustomerPayment::create([
                    'customer_id' => $customerId,
                    'sale_id' => $sale->id,
                    'amount' => $amountPaid,
                    'payment_date' => now()->toDateString(),
                    'payment_method' => $validated['payment_method'],
                    'notes' => 'Abono inicial en venta',
                ]);
            }

            // Actualizar turno de caja con el dinero efectivamente recibido
            $receivedMoney = ($paymentType === 'credit') ? min($amountPaid, $totalAmount) : min($amountPaid, $totalAmount);
            if ($activeShift && $receivedMoney > 0) {
                if ($validated['payment_method'] === 'cash') {
                    $activeShift->increment('total_cash_sales', $receivedMoney);
                    $activeShift->increment('expected_cash', $receivedMoney);
                } else {
                    $activeShift->increment('total_electronic_sales', $receivedMoney);
                }
            }

            DB::commit();

            $sale->load(['items', 'customer', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Venta registrada con éxito.',
                'data' => $sale,
                'change_given' => $changeGiven,
                'balance_due' => $balanceDue,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Registrar un abono a un fiado / crédito
     */
    public function addPayment(Request $request, int $id): JsonResponse
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada.'
            ], 404);
        }

        if ($sale->balance_due <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Esta cuenta ya se encuentra totalmente saldada.'
            ], 400);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:cash,transfer',
            'notes' => 'nullable|string',
        ]);

        $amount = (float) $validated['amount'];
        $newBalance = max(0, $sale->balance_due - $amount);
        $newPaidAmount = $sale->amount_paid + $amount;
        $newStatus = ($newBalance <= 0) ? 'paid' : 'partial';

        DB::beginTransaction();

        try {
            $payment = CustomerPayment::create([
                'customer_id' => $sale->customer_id,
                'sale_id' => $sale->id,
                'amount' => $amount,
                'payment_date' => now()->toDateString(),
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? 'Abono a factura ' . $sale->invoice_number,
            ]);

            $sale->update([
                'amount_paid' => $newPaidAmount,
                'balance_due' => $newBalance,
                'payment_status' => $newStatus,
            ]);

            // Sumar a la caja activa si aplica
            $userId = $request->user()?->id ?? 1;
            $activeShift = CashShift::where('status', 'open')->where('user_id', $userId)->latest('opened_at')->first();
            if ($activeShift) {
                if ($validated['payment_method'] === 'cash') {
                    $activeShift->increment('total_cash_sales', $amount);
                    $activeShift->increment('expected_cash', $amount);
                } else {
                    $activeShift->increment('total_electronic_sales', $amount);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Abono registrado con éxito.',
                'data' => [
                    'payment' => $payment,
                    'sale' => $sale->fresh(['customer', 'payments'])
                ]
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar abono: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resumen de créditos activos (Cuentas por Cobrar)
     */
    public function customerCreditsSummary(): JsonResponse
    {
        $totalOwed = Sale::where('payment_type', 'credit')
            ->whereIn('payment_status', ['pending', 'partial'])
            ->sum('balance_due');

        $activeCredits = Sale::with('customer')
            ->where('payment_type', 'credit')
            ->whereIn('payment_status', ['pending', 'partial'])
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_owed' => (float) $totalOwed,
                'credits_count' => $activeCredits->count(),
                'credits' => $activeCredits
            ]
        ]);
    }

    /**
     * Ver venta por ID o número de ticket
     */
    public function show(int $id): JsonResponse
    {
        $sale = Sale::with(['user', 'customer', 'items', 'payments'])->find($id);

        if (!$sale) {
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $sale
        ]);
    }

    /**
     * Resumen de ventas de hoy (para dashboard rápido)
     */
    public function summaryToday(): JsonResponse
    {
        $today = now()->toDateString();

        $totalSales = Sale::whereDate('created_at', $today)->where('status', 'completed')->sum('total_amount');
        $salesCount = Sale::whereDate('created_at', $today)->where('status', 'completed')->count();
        $cashSales = Sale::whereDate('created_at', $today)->where('status', 'completed')->where('payment_method', 'cash')->sum('total_amount');
        $electronicSales = Sale::whereDate('created_at', $today)->where('status', 'completed')->where('payment_method', '!=', 'cash')->sum('total_amount');
        $totalCreditsToday = Sale::whereDate('created_at', $today)->where('payment_type', 'credit')->sum('total_amount');

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $today,
                'total_amount' => (float) $totalSales,
                'sales_count' => $salesCount,
                'cash_amount' => (float) $cashSales,
                'electronic_amount' => (float) $electronicSales,
                'credits_amount' => (float) $totalCreditsToday,
            ]
        ]);
    }
}
