import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  FunnelIcon, 
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import ProductCard from '../../components/product/ProductCard';
import { fetchCategoryProducts } from '../../store/slices/productSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { 
    categoryProducts, 
    categories, 
    isLoading, 
    totalPages,
    currentPage 
  } = useSelector(state => state.products);
  
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    rating: 0,
    brand: '',
    sortBy: 'featured',
    inStock: true
  });

  const currentCategory = categories.find(cat => cat.id === categoryId);

  useEffect(() => {
    const params = {
      category: categoryId,
      page: searchParams.get('page') || 1,
      sortBy: searchParams.get('sortBy') || 'featured',
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      rating: searchParams.get('rating'),
      brand: searchParams.get('brand'),
      inStock: searchParams.get('inStock')
    };
    
    dispatch(fetchCategoryProducts(params));
  }, [categoryId, searchParams, dispatch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (key === 'priceRange') {
      params.set('minPrice', value[0]);
      params.set('maxPrice', value[1]);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleWishlistToggle = (productId) => {
    dispatch(toggleWishlist(productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  if (isLoading && !categoryProducts.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm breadcrumbs mb-4">
            <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{currentCategory?.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentCategory?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {categoryProducts.length} products found
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 bg-white dark:bg-gray-800 rounded-lg p-6 h-fit shadow-sm`}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
            </h3>
            
            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('rating', rating === filters.rating ? 0 : rating)}
                    className={`flex items-center gap-2 w-full p-2 rounded text-left ${
                      filters.rating === rating ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {categoryProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {categoryProducts.map(product => (
                    <div key={product.id} className="relative group">
                      <ProductCard 
                        product={product} 
                        viewMode={viewMode}
                        onWishlistToggle={() => handleWishlistToggle(product.id)}
                        isWishlisted={isInWishlist(product.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', i + 1);
                            setSearchParams(params);
                          }}
                          className={`px-3 py-2 rounded ${
                            currentPage === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FunnelIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 10000],
                      rating: 0,
                      brand: '',
                      sortBy: 'featured',
                      inStock: true
                    });
                    setSearchParams({});
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
