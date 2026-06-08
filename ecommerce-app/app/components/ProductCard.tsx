'use client';

import React, { memo, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/app/types/product';
import { useProduct } from '@/app/context/ProductContext';
import { formatPrice } from '@/app/lib/productUtils';

interface ProductCardProps {
    product: Product;
    isAboveFold?: boolean;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ product, isAboveFold = false }) => {
    const { favorites, toggleFavorite } = useProduct();
    const [imageError, setImageError] = useState(false);
    const isFavorite = favorites.has(product.id);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
            <div className="relative h-56 bg-gray-100 overflow-hidden group">
                {!imageError ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading={isAboveFold ? 'eager' : 'lazy'}
                        priority={isAboveFold}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <span className="text-gray-500 text-center px-4">Image unavailable</span>
                    </div>
                )}

                <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${isFavorite
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg
                        className="w-5 h-5"
                        fill={isFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>

                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.category}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                    </span>
                </div>

                <div className="mt-auto">
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                </div>

                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export const ProductCard = memo(ProductCardComponent);
