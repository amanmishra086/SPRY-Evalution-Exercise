'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Product } from '@/app/types/product';
import { filterProducts, sortProducts, getUniqueCategories } from '@/app/lib/productUtils';
import { useProduct } from '@/app/context/ProductContext';
import { FilterSidebar } from '@/app/components/FilterSidebar';

const SortBar = dynamic(() => import('@/app/components/SortBar').then((mod) => mod.SortBar), {
    loading: () => <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-20 animate-pulse" />,
});

const ProductGrid = dynamic(() => import('@/app/components/ProductGrid').then((mod) => mod.ProductGrid), {
    loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">Loading products...</div>,
});

const Pagination = dynamic(() => import('@/app/components/Pagination').then((mod) => mod.Pagination), {
    loading: () => <div className="mt-6 md:mt-8 h-12" />,
});

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { filters } = useProduct();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/products.json');
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        startTransition(() => {
            setCurrentPage(1);
        });
    }, [filters]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsFilterOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const categories = useMemo(() => getUniqueCategories(allProducts), [allProducts]);

    const filteredProducts = useMemo(() => {
        const filtered = filterProducts(allProducts, filters.categories, filters.minRating);
        return sortProducts(filtered, filters.sortBy);
    }, [allProducts, filters.categories, filters.minRating, filters.sortBy]);

    const totalPages = useMemo(
        () => Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
        [filteredProducts.length]
    );

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, endIndex);
    }, [currentPage, filteredProducts]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">Shop Products</h1>
                        <p className="text-blue-100 mt-2">Discover amazing products at great prices</p>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="lg:hidden p-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors"
                        aria-label="Toggle filters"
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-full lg:items-start">
                    {isFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    <aside
                        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-auto overflow-y-auto bg-white lg:bg-transparent lg:col-span-1 transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                            } lg:translate-x-0 lg:h-full lg:overflow-visible`}
                    >
                        {isFilterOpen && (
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="lg:hidden sticky top-0 p-4 w-full text-left font-semibold text-gray-900 border-b bg-white flex items-center gap-2 hover:bg-gray-50"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back
                            </button>
                        )}
                        <div className="lg:p-0 p-4">
                            <FilterSidebar categories={categories} />
                        </div>
                    </aside>

                    <main className="lg:col-span-3 lg:h-full lg:overflow-y-auto lg:pr-2">
                        <SortBar productCount={filteredProducts.length} />

                        <ProductGrid products={paginatedProducts} />

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
