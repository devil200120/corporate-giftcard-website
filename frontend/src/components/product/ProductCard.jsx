import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';

const ProductCard = ({ product, isInWishlist = false, className = '' }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      maxQuantity: product.stock || 99
    }));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category
      }));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`}>
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={product.imageUrl || '/images/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isFeatured && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
            {product.isOnSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <Link
                to={`/products/${product.id}`}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                title="Quick View"
              >
                <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Minimum Order Quantity */}
          {product.minOrderQuantity && product.minOrderQuantity > 1 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Min. order: {product.minOrderQuantity} units
            </div>
          )}

          {/* Customization Available */}
          {product.customizable && (
            <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 mb-3">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
              Customization Available
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          <ShoppingCartIcon className="w-4 h-4" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>

      {/* Quick Actions for Mobile */}
      <div className="lg:hidden absolute top-2 right-2">
        <button
          onClick={handleWishlistToggle}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-4 h-4 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
