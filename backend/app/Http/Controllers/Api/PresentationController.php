<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presentation;
use Illuminate\Http\Request;

class PresentationController extends Controller
{
    public function index()
    {
        $presentations = Presentation::paginate(10);
        return response()->json([
            'success' => true,
            'data' => $presentations
        ], 200);
    }

    public function show($id)
    {
        $presentation = Presentation::find($id);
        if (!$presentation) {
            return response()->json([
                'success' => false,
                'message' => 'Presentation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $presentation
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validator = $request->validate([
                'name' => 'required|string|max:255|unique:presentation,name',
            ]);

            $presentation = Presentation::create($validator);

            return response()->json([
                'success' => true,
                'data' => $presentation
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la presentación: ' . $th->getMessage()
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $presentation = Presentation::find($id);

        if (!$presentation) {
            return response()->json([
                'success' => false,
                'message' => 'Presentation not found'
            ], 404);
        }

        try {
            $validator = $request->validate([
                'name' => 'required|string|max:255|unique:presentation,name,' . $id,
            ]);

            $presentation->update($validator);

            return response()->json([
                'success' => true,
                'data' => $presentation
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la presentación: ' . $th->getMessage()
            ], 400);
        }
    }

    public function destroy($id)
    {
        $presentation = Presentation::find($id);
        if (!$presentation) {
            return response()->json([
                'success' => false,
                'message' => 'Presentation not found'
            ], 404);
        }

        $presentation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Presentation deleted successfully'
        ], 200);
    }
}
