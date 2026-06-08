'use client';

import React, { memo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 md:gap-2 mt-6 md:mt-8 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 md:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
                title="Previous page"
            >
                <span className="hidden md:inline">Previous</span>
                <span className="md:hidden">←</span>
            </button>

            <div className="flex gap-0.5 md:gap-1 flex-wrap justify-center">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                        className={`px-2 md:px-3 py-2 rounded-lg font-medium transition-colors text-xs md:text-base ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : page === '...'
                                ? 'cursor-default text-gray-500'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 md:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
                title="Next page"
            >
                <span className="hidden md:inline">Next</span>
                <span className="md:hidden">→</span>
            </button>
        </div>
    );
};

export const Pagination = memo(PaginationComponent);
