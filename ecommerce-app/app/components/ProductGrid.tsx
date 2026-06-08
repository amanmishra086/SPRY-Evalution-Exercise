'use client';

import React, { memo } from 'react';
import { Product } from '@/app/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ products }) => {
    if (products.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
                <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No products found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} isAboveFold={index < 6} />
            ))}
        </div>
    );
};

export const ProductGrid = memo(ProductGridComponent);
