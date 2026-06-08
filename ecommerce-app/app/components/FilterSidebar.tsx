'use client';

import React from 'react';
import { useProduct } from '@/app/context/ProductContext';

interface FilterSidebarProps {
    categories: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories }) => {
    const { filters, updateCategories, updateMinRating, resetFilters } = useProduct();

    const handleCategoryChange = (category: string) => {
        const newCategories = new Set(filters.categories);
        if (newCategories.has(category)) {
            newCategories.delete(category);
        } else {
            newCategories.add(category);
        }
        updateCategories(newCategories);
    };

    const handleResetFilters = () => {
        resetFilters();
    };

    return (
        <div className="bg-white lg:p-6 lg:rounded-lg lg:shadow-md h-fit">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Reset
                </button>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Category</h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.categories.has(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Minimum Rating</h3>
                <div className="space-y-3">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <label key={rating} className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                value={rating}
                                checked={filters.minRating === rating}
                                onChange={() => updateMinRating(rating)}
                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">
                                {rating === 0 ? 'All' : `${rating} ★ & above`}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {(filters.categories.size > 0 || filters.minRating > 0) && (
                <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-3">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                        {Array.from(filters.categories).map((cat) => (
                            <span key={cat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {cat}
                            </span>
                        ))}
                        {filters.minRating > 0 && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {filters.minRating}★
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
