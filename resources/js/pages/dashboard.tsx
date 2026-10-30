import React from 'react';
import AuthenticatedLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel Principal - Cafepan ☕🥐
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 border border-gray-200 mb-6">
                        <h3 className="text-lg font-bold mb-2">¡Bienvenido al sistema de gestión!</h3>
                        <p className="text-gray-600">
                            Desde aquí puedes administrar el inventario, las categorías y registrar las ventas diarias del mostrador.
                        </p>
                    </div>

                    {/* Tarjetas de Acceso Rápido (Breadcrumbs / Secciones) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Módulo de Productos */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div className="text-amber-600 text-3xl mb-2">🍞</div>
                                <h4 className="text-lg font-bold text-gray-900">Productos</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Agrega, edita precios minoristas/mayoristas y controla el stock de cada artículo.
                                </p>
                            </div>
                            <div className="mt-6">
                                <Link
                                    href="/products"
                                    className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition font-semibold text-sm"
                                >
                                    Ir a Productos →
                                </Link>
                            </div>
                        </div>

                        {/* Módulo de Categorías */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div className="text-amber-600 text-3xl mb-2">📁</div>
                                <h4 className="text-lg font-bold text-gray-900">Categorías</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Organiza tus productos por secciones como panificados, bebidas o sándwiches.
                                </p>
                            </div>
                            <div className="mt-6">
                                <Link
                                    href="/categories"
                                    className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition font-semibold text-sm"
                                >
                                    Ir a Categorías →
                                </Link>
                            </div>
                        </div>

                        {/* Módulo de Ventas / Caja */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div className="text-amber-600 text-3xl mb-2">💵</div>
                                <h4 className="text-lg font-bold text-gray-900">Caja y Ventas</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Registra las ventas del día, genera tickets y descuenta stock automáticamente.
                                </p>
                            </div>
                            <div className="mt-6">
                                <Link
                                    href="/sales"
                                    className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition font-semibold text-sm"
                                >
                                    Ir a Caja / Ventas →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}