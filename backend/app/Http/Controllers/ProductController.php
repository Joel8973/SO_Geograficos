<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->products()
                ->with('category')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $datos = $this->validar($request);

        $datos['slug'] = Str::slug($datos['name']) . '-' . Str::lower(Str::random(8));
        $datos['is_active'] = true;

        $producto = $request->user()
            ->products()
            ->create($datos);

        return response()->json(
            $producto->load('category'),
            201
        );
    }

    public function update(Request $request, Product $product)
    {
        abort_unless(
            $product->user_id === $request->user()->id,
            403
        );

        $datos = $this->validar($request);

        $product->update($datos);

        return response()->json(
            $product->fresh()->load('category')
        );
    }

    public function destroy(Request $request, Product $product)
    {
        abort_unless(
            $product->user_id === $request->user()->id,
            403
        );

        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }

    private function validar(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'photo_path' => 'nullable|string|max:2048',
            'description' => 'nullable|string',
            'presentation' => 'nullable|string|max:255',
            'price_to_business' => 'nullable|numeric|min:0',
            'suggested_price' => 'nullable|numeric|min:0',
            'minimum_order' => 'nullable|string|max:255',
            'weekly_capacity' => 'nullable|string|max:255',
            'shelf_life' => 'nullable|string|max:255',
            'conservation_conditions' => 'nullable|string',
            'delivery_zones' => 'nullable|array',
            'delivery_zones.*' => 'string|max:255',
            'delivery_frequency' => 'nullable|string|max:255',
            'documentation' => 'nullable|array',
            'documentation.*' => 'string|max:255',
        ]);
    }
}
