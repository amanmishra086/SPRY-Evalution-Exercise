import { Product, SortOption } from '@/app/types/product';

export const filterProducts = (
    products: Product[],
    categories: Set<string>,
    minRating: number
): Product[] => {
    return products.filter((product) => {
        const categoryMatch = categories.size === 0 || categories.has(product.category);
        const ratingMatch = product.rating >= minRating;
        return categoryMatch && ratingMatch;
    });
};

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
    const sorted = [...products];

    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
        default:
            return sorted;
    }
};

export const getUniqueCategories = (products: Product[]): string[] => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
};

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};
