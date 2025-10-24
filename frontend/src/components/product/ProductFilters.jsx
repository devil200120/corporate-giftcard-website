import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ProductFilters = ({ filters, categories, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    features: true
  });

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: null }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const features = [
    { id: 'customizable', label: 'Customizable' },
    { id: 'featured', label: 'Featured' },
    { id: 'onSale', label: 'On Sale' },
    { id: 'freeShipping', label: 'Free Shipping' },
    { id: 'bulkAvailable', label: 'Bulk Available' },
    { id: 'newArrival', label: 'New Arrival' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value, isArray = false) => {
    let newFilters = { ...filters };
    
    if (isArray) {
      const currentValues = newFilters[key] || [];
      if (currentValues.includes(value)) {
        newFilters[key] = currentValues.filter(v => v !== value);
      } else {
        newFilters[key] = [...currentValues, value];
      }
    } else {
      newFilters[key] = value;
    }
    
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    const newFilters = { ...filters };
    newFilters.minPrice = range.min;
    newFilters.maxPrice = range.max;
    onFilterChange(newFilters);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        {expandedSections[sectionKey] ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <FilterSection title="Category" sectionKey="category">
        {categories?.map((category) => (
          <label key={category.id} className="flex items-center">
            <input
              type="checkbox"
              checked={filters.categories?.includes(category.id) || false}
              onChange={() => handleFilterChange('categories', category.id, true)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {category.name}
              {category.productCount && (
                <span className="text-xs text-gray-400 ml-1">
                  ({category.productCount})
                </span>
              )}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="Price Range" sectionKey="price">
        {priceRanges.map((range, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              name="priceRange"
              checked={
                filters.minPrice === range.min && 
                filters.maxPrice === range.max
              }
              onChange={() => handlePriceRangeChange(range)}
              className="border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {range.label}
            </span>
          </label>
        ))}
        
        {/* Custom Price Range */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex space-x-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Min Price
              </label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Max Price
              </label>
              <input
                type="number"
                placeholder="Any"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Customer Rating" sectionKey="rating">
        {ratings.map((rating) => (
          <label key={rating} className="flex items-center">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === rating}
              onChange={() => handleFilterChange('minRating', rating)}
              className="border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-2 flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                & up
              </span>
            </div>
          </label>
        ))}
      </FilterSection>

      {/* Features Filter */}
      <FilterSection title="Features" sectionKey="features">
        {features.map((feature) => (
          <label key={feature.id} className="flex items-center">
            <input
              type="checkbox"
              checked={filters.features?.includes(feature.id) || false}
              onChange={() => handleFilterChange('features', feature.id, true)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {feature.label}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Stock Status */}
      <FilterSection title="Availability" sectionKey="availability">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={() => handleFilterChange('inStock', !filters.inStock)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </div>
  );
};

export default ProductFilters;
