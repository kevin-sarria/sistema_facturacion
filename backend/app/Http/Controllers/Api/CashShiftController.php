<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CashShift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CashShiftController extends Controller
{
    /**
     * Consultar estado del turno de caja actual
     */
    public function current(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        $shift = CashShift::where('user_id', $userId)
            ->where('status', 'open')
            ->latest('opened_at')
            ->first();

        return response()->json([
            'success' => true,
            'is_open' => (bool) $shift,
            'data' => $shift
        ]);
    }

    /**
     * Abrir turno de caja (ingresar base de efectivo)
     */
    public function open(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        // Verificar si ya tiene uno abierto
        $existing = CashShift::where('user_id', $userId)
            ->where('status', 'open')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Ya existe un turno de caja abierto.',
                'data' => $existing
            ], 400);
        }

        $validated = $request->validate([
            'initial_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $initialCash = (float) $validated['initial_cash'];

        $shift = CashShift::create([
            'user_id' => $userId,
            'opened_at' => now(),
            'initial_cash' => $initialCash,
            'total_cash_sales' => 0,
            'total_electronic_sales' => 0,
            'expected_cash' => $initialCash,
            'status' => 'open',
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Caja abierta correctamente.',
            'data' => $shift
        ], 201);
    }

    /**
     * Cerrar turno de caja (Arqueo de caja)
     */
    public function close(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        $shift = CashShift::where('user_id', $userId)
            ->where('status', 'open')
            ->latest('opened_at')
            ->first();

        if (!$shift) {
            return response()->json([
                'success' => false,
                'message' => 'No hay ningún turno de caja abierto para cerrar.'
            ], 404);
        }

        $validated = $request->validate([
            'actual_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $actualCash = (float) $validated['actual_cash'];
        $expectedCash = (float) $shift->expected_cash;
        $difference = $actualCash - $expectedCash;

        $shift->update([
            'closed_at' => now(),
            'actual_cash' => $actualCash,
            'difference' => $difference,
            'status' => 'closed',
            'notes' => ($shift->notes ? $shift->notes . " | " : "") . ($validated['notes'] ?? ""),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Caja cerrada y arqueada exitosamente.',
            'data' => $shift
        ]);
    }
}
