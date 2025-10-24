import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  HeartIcon, 
  TrashIcon, 
  ShoppingBagIcon,
  ShareIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import ProductCard from '../../components/product/ProductCard';
import { 
  fetchWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  moveToCart 
} from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector(state => state.wishlist);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromWishlist(itemId));
    toast.success('Item removed from wishlist');
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    }));
    toast.success('Item added to cart');
  };

  const handleMoveToCart = (itemId) => {
    dispatch(moveToCart(itemId));
    toast.success('Item moved to cart');
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const handleBulkAddToCart = () => {
    selectedItems.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        handleAddToCart(item);
      }
    });
    setSelectedItems([]);
  };

  const handleBulkRemove = () => {
    if (window.confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      selectedItems.forEach(itemId => {
        dispatch(removeFromWishlist(itemId));
      });
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items removed from wishlist`);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist());
      setSelectedItems([]);
      toast.success('Wishlist cleared');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleShareWishlist = async () => {
    const wishlistUrl = `${window.location.origin}/wishlist/shared/${Math.random().toString(36).substr(2, 9)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wishlist',
          text: 'Check out my wishlist!',
          url: wishlistUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(wishlistUrl);
      toast.success('Wishlist link copied to clipboard!');
    }
  };

  const filteredItems = items
    .filter(item => {
      if (filterBy === 'all') return true;
      if (filterBy === 'inStock') return item.inStock;
      if (filterBy === 'outOfStock') return !item.inStock;
      if (filterBy === 'onSale') return item.salePrice;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'priceHigh':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'priceLow':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HeartIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to view your wishlist
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Save your favorite items and access them from any device.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HeartIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start building your wishlist by adding items you love.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <HeartSolid className="w-8 h-8 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Share Button */}
              <button
                onClick={handleShareWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ShareIcon className="w-5 h-5" />
                Share
              </button>

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

              {/* Filters */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Items</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
                <option value="onSale">On Sale</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="dateAdded">Date Added</option>
                <option value="name">Name</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>

              {/* Clear Wishlist */}
              <button
                onClick={handleClearWishlist}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {items.length > 0 && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Select All ({filteredItems.length})
                    </span>
                  </label>
                </div>

                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkAddToCart}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      Add to Cart ({selectedItems.length})
                    </button>
                    <button
                      onClick={handleBulkRemove}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Remove ({selectedItems.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredItems.map(item => (
              <div key={item.id} className="relative group">
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                }`}>
                  {/* Product Image */}
                  <div className={viewMode === 'list' ? 'w-24 h-24 flex-shrink-0 mr-4' : 'mb-4'}>
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className={`flex-1 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-600 mb-2">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${item.salePrice || item.price}
                        </span>
                        {item.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.inStock 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {item.salePrice && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Sale
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col' : 'flex-row'}`}>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        <ShoppingBagIcon className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No items match your filters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filter or sort options
            </p>
            <button
              onClick={() => {
                setFilterBy('all');
                setSortBy('dateAdded');
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
