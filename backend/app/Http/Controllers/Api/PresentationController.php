<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presentation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            return response()->json([
                'success' => true,
                'data' => Presentation::orderBy('name', 'asc')->get()
            ]);
        }

        $limit = (int) $request->query('limit', 15);
        $presentations = Presentation::orderBy('name', 'asc')->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $presentations
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $presentation = Presentation::find($id);
        if (!$presentation) {
            return response()->json([
                'success' => false,
                'message' => 'Presentación no encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $presentation
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:presentations,name',
        ]);

        $presentation = Presentation::create($validated);

        return response()->json([
            'success' => true,
            'data' => $presentation
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $presentation = Presentation::find($id);

        if (!$presentation) {
            return response()->json([
                'success' => false,
                'message' => 'Presentación no encontrada.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:presentations,name,' . $id,
        ]);

        $presentation->update($validated);

        return response()->json([
            'success' => true,
            'data' => $presentation
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $presentation = Presentation::find($id);
        if (!$presentation) {
            return response()->json([
                'success' => false,
                'message' => 'Presentación no encontrada.'
            ], 404);
        }

        $presentation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Presentación eliminada.'
        ]);
    }
}
