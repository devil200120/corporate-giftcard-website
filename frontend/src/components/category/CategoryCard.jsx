import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const CategoryCard = ({ category, className = '' }) => {
  return (
    <Link
      to={`/categories/${category.slug || category.id}`}
      className={`group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Category Image */}
      <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={category.imageUrl || '/images/placeholder-category.jpg'}
          alt={category.name}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Product Count Badge */}
        {category.productCount !== undefined && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {category.isFeatured && (
          <div className="absolute top-2 left-2">
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-full">
            <ArrowRightIcon className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {category.name}
        </h3>
        
        {category.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {category.description}
          </p>
        )}

        {/* Subcategories Preview */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {category.subcategories.slice(0, 3).map((sub, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
              >
                {sub.name}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{category.subcategories.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price Range */}
        {category.priceRange && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            From ${category.priceRange.min} - ${category.priceRange.max}
          </div>
        )}

        {/* Popular Items Preview */}
        {category.popularItems && category.popularItems.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Popular: </span>
            <span className="text-gray-700 dark:text-gray-300">
              {category.popularItems.slice(0, 2).join(', ')}
              {category.popularItems.length > 2 && '...'}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
            Explore Category
          </span>
          <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
