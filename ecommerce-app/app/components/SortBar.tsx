'use client';

import React, { memo } from 'react';
import { useProduct } from '@/app/context/ProductContext';
import { SortOption } from '@/app/types/product';

interface SortBarProps {
    productCount: number;
}

const SortBarComponent: React.FC<SortBarProps> = ({ productCount }) => {
    const { filters, updateSortBy } = useProduct();

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'newest', label: 'Newest' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-gray-700 font-medium">
                    Showing <span className="font-bold text-gray-900">{productCount}</span> products
                </div>
                <div className="flex items-center gap-3">
                    <label htmlFor="sort" className="text-gray-700 font-medium">
                        Sort by:
                    </label>
                    <select
                        id="sort"
                        value={filters.sortBy}
                        onChange={(e) => updateSortBy(e.target.value as SortOption)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export const SortBar = memo(SortBarComponent);
