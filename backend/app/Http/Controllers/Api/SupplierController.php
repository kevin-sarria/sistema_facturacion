<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');

        $query = Supplier::with('purchases');

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('tax_id', 'LIKE', "%{$search}%")
                  ->orWhere('contact_name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
        }

        $suppliers = $query->orderBy('name', 'asc')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'tax_id' => $s->tax_id,
                'contact_name' => $s->contact_name,
                'phone' => $s->phone,
                'contact_phone' => $s->contact_phone,
                'email' => $s->email,
                'address' => $s->address,
                'notes' => $s->notes,
                'total_debt' => $s->total_debt,
                'pending_invoices_count' => $s->purchases->whereIn('payment_status', ['pending', 'partial'])->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tax_id' => 'nullable|string|max:50',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'contact_phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Proveedor registrado exitosamente.',
            'data' => $supplier
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $supplier = Supplier::with(['purchases' => function ($q) {
            $q->orderBy('purchase_date', 'desc');
        }])->find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Proveedor no encontrado.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $supplier,
            'total_debt' => $supplier->total_debt
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Proveedor no encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'tax_id' => 'nullable|string|max:50',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'contact_phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Proveedor actualizado.',
            'data' => $supplier
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Proveedor no encontrado.'
            ], 404);
        }

        $supplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Proveedor eliminado.'
        ]);
    }
}
