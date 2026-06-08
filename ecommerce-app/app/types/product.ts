export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface FilterState {
    categories: Set<string>;
    minRating: number;
    sortBy: SortOption;
}
