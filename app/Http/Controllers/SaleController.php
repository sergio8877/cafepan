<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        // Traemos las ventas del día actual con sus ítems y productos asociados
        $todaySales = Sale::with('items.product')
            ->whereDate('created_at', today())
            ->latest()
            ->get();

        $products = Product::where('stock', '>', 0)->get();

        $dailyTotal = $todaySales->sum('total');

        return Inertia::render('sales/index', [
            'sales' => $todaySales,
            'products' => $products,
            'dailyTotal' => $dailyTotal,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
        ]);

        DB::transaction(function () use ($request) {
            $sale = Sale::create([
                'total' => 0,
                'payment_method' => $request->payment_method,
            ]);

            $total = 0;

            foreach ($request->items as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);

                if ($product->stock < $itemData['quantity']) {
                    throw new \Exception("Stock insuficiente para el producto: {$product->name}");
                }

                $unitPrice = $product->price_retail;
                $subtotal = $unitPrice * $itemData['quantity'];

                $sale->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ]);

                // Descontar stock automáticamente
                $product->decrement('stock', $itemData['quantity']);

                $total += $subtotal;
            }

            $sale->update(['total' => $total]);
        });

        return redirect()->back()->with('success', 'Venta registrada con éxito y stock actualizado.');
    }
}