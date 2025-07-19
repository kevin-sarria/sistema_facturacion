<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $limit = request()->query('limit', 10);

        $inventario = Inventory::with('presentation')->paginate($limit);
        return response()->json([
            'success' => true,
            'data' => $inventario
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'presentation_id' => 'required|integer|max:10',
            'purchase_price' => 'required|numeric|min:0',
            'profit_percentage' => 'required|numeric|min:0|max:100',
            'sale_price' => 'required|numeric|min:0'
        ]);

        try {
            $inventario = Inventory::create($validator);

            return response()->json([
                'success' => true,
                'data' => $inventario
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error to create: ' . $th->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inventario = Inventory::with('presentation')->where('id', "=", $id)->get();
        return response()->json([
            'success' => true,
            'data' => $inventario
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $inventario = Inventory::find($id);
        if (!$inventario) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory not found'
            ], 404);
        }

        $validator = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:0',
            'presentation_id' => 'sometimes|required|integer|max:10',
            'purchase_price' => 'sometimes|required|numeric|min:0',
            'profit_percentage' => 'sometimes|required|numeric|min:0|max:100',
            'sale_price' => 'sometimes|required|numeric|min:0'
        ]);

        try {
            $inventario->update($validator);

            $inventario->load('presentation');

            return response()->json([
                'success' => true,
                'data' => $inventario
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error to update: ' . $th->getMessage()
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $inventario = Inventory::find($id);
        if (!$inventario) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory not found'
            ], 404);
        }

        try {
            $inventario->delete();
            return response()->json([
                'success' => true,
                'message' => 'Inventory deleted successfully'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error to delete: ' . $th->getMessage()
            ], 400);
        }
    }
}
