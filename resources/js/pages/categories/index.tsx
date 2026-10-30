import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    description?: string;
    products_count?: number;
}

interface PageProps {
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        setIsOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
        });
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setEditingCategory(null);
                },
            });
        } else {
            post('/categories', {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
            });
        }
    };

    const deleteCategory = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            useForm().delete(`/categories/${id}`);
        }
    };

    return (
        <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-gray-50 min-h-screen text-gray-900">
            <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías - Cafepan</h1>
                    <p className="text-sm text-gray-600">Administra las secciones de tu panadería y cafetería.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition shadow"
                >
                    + Nueva Categoría
                </button>
            </div>

            {flash?.success && (
                <div className="mb-4 mx-4 sm:mx-0 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded shadow-sm">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 mx-4 sm:mx-0 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded shadow-sm">
                    {flash.error}
                </div>
            )}

            {/* Tabla de Categorías */}
            <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-200 mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Productos</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{category.description || 'Sin descripción'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full bg-amber-100 text-amber-900">
                                            {category.products_count ?? 0} productos
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="text-red-600 hover:text-red-900 font-semibold"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No hay categorías registradas todavía. Crea la primera usando el botón superior.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para Crear / Editar */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl text-gray-900">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Nombre de la Categoría</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Ej: Panificados, Bebidas..."
                                />
                                {errors.name && <span className="text-red-600 text-sm mt-1 block">{errors.name}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Descripción (Opcional)</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm border p-2 focus:ring-amber-500 focus:border-amber-500"
                                    rows={3}
                                    placeholder="Detalles de la categoría..."
                                />
                                {errors.description && <span className="text-red-600 text-sm mt-1 block">{errors.description}</span>}
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
                                    {editingCategory ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}