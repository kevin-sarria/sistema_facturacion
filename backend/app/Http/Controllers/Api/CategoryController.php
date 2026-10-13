<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            return response()->json([
                'success' => true,
                'data' => Category::where('is_active', true)->orderBy('name', 'asc')->get()
            ]);
        }

        $limit = (int) $request->query('limit', 15);
        $categories = Category::where('is_active', true)->orderBy('name', 'asc')->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'data' => $category
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada.'
            ], 404);
        }

        $category->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Categoría desactivada.'
        ]);
    }
}
