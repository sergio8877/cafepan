import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price_retail: number;
    stock: number;
}

interface SaleItem {
    id: number;
    product: Product;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Sale {
    id: number;
    total: number;
    payment_method: string;
    created_at: string;
    items: SaleItem[];
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface Props {
    sales: Sale[];
    products: Product[];
    dailyTotal: number;
}

export default function Index({ sales, products, dailyTotal }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Carrito temporal para la venta actual
    const [cart, setCart] = useState<{ product_id: number; name: string; price: number; quantity: number }[]>([]);

    const { data, setData, post, processing, reset, errors } = useForm({
        items: [] as { product_id: number; quantity: number }[],
        payment_method: 'efectivo',
    });

    const addToCart = () => {
        if (!selectedProduct) return;
        const product = products.find((p) => p.id === Number(selectedProduct));
        if (!product) return;

        if (quantity > product.stock) {
            alert('No hay suficiente stock disponible.');
            return;
        }

        const existingIndex = cart.findIndex((item) => item.product_id === product.id);
        if (existingIndex > -1) {
            const newCart = [...cart];
            newCart[existingIndex].quantity += quantity;
            setCart(newCart);
        } else {
            setCart([...cart, { product_id: product.id, name: product.name, price: product.price_retail, quantity }]);
        }

        setSelectedProduct('');
        setQuantity(1);
    };

    const removeFromCart = (index: number) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const submitSale = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Agrega al menos un producto al carrito.');
            return;
        }

        const formattedItems = cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
        }));

        data.items = formattedItems;

        post('/sales', {
            onSuccess: () => {
                setCart([]);
                reset();
            },
        });
    };

    return (
        <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-gray-50 min-h-screen text-gray-900">
            <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Caja y Registro de Ventas - Cafepan</h1>
                    <p className="text-sm text-gray-600">Registra las ventas diarias y controla los cobros del mostrador.</p>
                </div>
                <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-xs uppercase font-bold block text-amber-700">Total Recaudado Hoy</span>
                    <span className="text-2xl font-black">${dailyTotal.toFixed(2)}</span>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-4 mx-4 sm:mx-0 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded shadow-sm">
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0 mb-10">
                {/* Formulario / POS */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Nueva Venta / Cobro</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Seleccionar Producto</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="">-- Elige un producto --</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (${p.price_retail} - Stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={addToCart}
                            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition font-semibold"
                        >
                            Agregar al Carrito
                        </button>
                    </div>

                    {/* Carrito Actual */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="font-bold text-gray-800 mb-2">Ítems en el ticket</h3>
                        {cart.length > 0 ? (
                            <ul className="space-y-2 mb-4">
                                {cart.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                        <div>
                                            <span className="font-semibold">{item.name}</span> x {item.quantity}
                                            <div className="text-xs text-gray-500">${item.price * item.quantity}</div>
                                        </div>
                                        <button onClick={() => removeFromCart(index)} className="text-red-600 font-bold hover:text-red-800">
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 mb-4">El carrito está vacío.</p>
                        )}

                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total a Pagar:</span>
                            <span className="text-amber-700">${cartTotal.toFixed(2)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Método de Pago</label>
                            <select
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                                className="w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 mb-4"
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia / QR</option>
                                <option value="tarjeta">Tarjeta</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            disabled={processing || cart.length === 0}
                            onClick={submitSale}
                            className="w-full bg-amber-600 text-white py-3 rounded-md hover:bg-amber-700 transition font-bold disabled:opacity-50 shadow"
                        >
                            Confirmar y Cobrar
                        </button>
                    </div>
                </div>

                {/* Listado de Ventas del Día */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Ventas Registradas Hoy</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                `<tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">ID / Hora</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Productos</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Pago</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Total</th>
                                </tr>`
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-800">
                                {sales.length > 0 ? (
                                    sales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                                                #{sale.id} <span className="text-xs text-gray-500 block">{new Date(sale.created_at).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <ul className="text-xs space-y-1">
                                                    {sale.items.map((item, idx) => (
                                                        <li key={idx}>
                                                            • {item.product?.name || 'Producto'} (x{item.quantity}) - ${item.subtotal}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap capitalize text-gray-600">{sale.payment_method}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-amber-700">${sale.total}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                            No hay ventas registradas en el día de hoy.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}