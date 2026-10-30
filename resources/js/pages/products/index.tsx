import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    category_id: number;
    category: Category;
    price_retail: number;
    price_wholesale: number;
    stock: number;
    is_active: boolean;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface Props {
    products: Product[];
    categories: Category[];
}

export default function Index({ products, categories }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        category_id: '',
        name: '',
        description: '',
        price_retail: '',
        price_wholesale: '',
        stock: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setIsOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            category_id: String(product.category_id),
            name: product.name,
            description: product.description || '',
            price_retail: String(product.price_retail),
            price_wholesale: String(product.price_wholesale),
            stock: String(product.stock),
            is_active: product.is_active,
        });
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/products/${editingProduct.id}`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setEditingProduct(null);
                },
            });
        } else {
            post('/products', {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
            });
        }
    };

    const deleteProduct = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        router.delete(`/products/${id}`);
    }
    };

    return (
        <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-gray-50 min-h-screen text-gray-900">
            <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos - Cafepan</h1>
                    <p className="text-sm text-gray-600">Administra el stock y los precios minoristas/mayoristas.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition shadow font-semibold"
                >
                    + Nuevo Producto
                </button>
            </div>

            {flash?.success && (
                <div className="mb-4 mx-4 sm:mx-0 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded shadow-sm">
                    {flash.success}
                </div>
            )}

            {/* Tabla de Productos */}
            <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-200 mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Minorista</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mayorista</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.category?.name || 'Sin categoría'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">${product.price_retail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">${product.price_wholesale}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full bg-amber-100 text-amber-900">
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="text-red-600 hover:text-red-900 font-semibold"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No hay productos registrados todavía. ¡Crea el primero!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para Crear / Editar Producto */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl text-gray-900">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Categoría</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <span className="text-red-600 text-sm mt-1 block">{errors.category_id}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Ej: Factura de manteca"
                                />
                                {errors.name && <span className="text-red-600 text-sm mt-1 block">{errors.name}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Precio Minorista</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price_retail}
                                        onChange={(e) => setData('price_retail', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    {errors.price_retail && <span className="text-red-600 text-sm mt-1 block">{errors.price_retail}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Precio Mayorista</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price_wholesale}
                                        onChange={(e) => setData('price_wholesale', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    {errors.price_wholesale && <span className="text-red-600 text-sm mt-1 block">{errors.price_wholesale}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Stock Inicial</label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                                {errors.stock && <span className="text-red-600 text-sm mt-1 block">{errors.stock}</span>}
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition font-semibold disabled:opacity-50"
                                >
                                    {editingProduct ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}