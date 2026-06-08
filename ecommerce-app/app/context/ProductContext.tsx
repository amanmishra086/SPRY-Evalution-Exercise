'use client';

import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { FilterState, SortOption } from '@/app/types/product';

interface ProductContextType {
    favorites: Set<number>;
    filters: FilterState;
    toggleFavorite: (productId: number) => void;
    updateCategories: (categories: Set<string>) => void;
    updateMinRating: (rating: number) => void;
    updateSortBy: (sortBy: SortOption) => void;
    resetFilters: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [filters, setFilters] = useState<FilterState>({
        categories: new Set(),
        minRating: 0,
        sortBy: 'newest',
    });
    const [favorites, setFavorites] = useState<Set<number>>(() => {
        if (typeof window === 'undefined') {
            return new Set();
        }

        try {
            const savedFavorites = localStorage.getItem('favorites');
            if (!savedFavorites) {
                return new Set();
            }

            const favArray = JSON.parse(savedFavorites);
            return new Set(favArray);
        } catch (error) {
            console.error('Failed to load favorites:', error);
            return new Set();
        }
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    const toggleFavorite = useCallback((productId: number) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    }, []);

    const updateCategories = useCallback((categories: Set<string>) => {
        setFilters((prev) => ({
            ...prev,
            categories,
        }));
    }, []);

    const updateMinRating = useCallback((rating: number) => {
        setFilters((prev) => ({
            ...prev,
            minRating: rating,
        }));
    }, []);

    const updateSortBy = useCallback((sortBy: SortOption) => {
        setFilters((prev) => ({
            ...prev,
            sortBy,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            categories: new Set(),
            minRating: 0,
            sortBy: 'newest',
        });
    }, []);

    const value = useMemo(
        () => ({
            favorites,
            filters,
            toggleFavorite,
            updateCategories,
            updateMinRating,
            updateSortBy,
            resetFilters,
        }),
        [favorites, filters, toggleFavorite, updateCategories, updateMinRating, updateSortBy, resetFilters]
    );

    return (
        <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within ProductProvider');
    }
    return context;
};
