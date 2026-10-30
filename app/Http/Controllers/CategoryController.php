<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->latest()->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Categoría creada con éxito.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Category $category)
    {
        // Opcional: Validar si tiene productos asociados antes de borrar
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar una categoría que tiene productos asociados.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Categoría eliminada.');
    }
}