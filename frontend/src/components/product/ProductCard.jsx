import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { addToCart } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { transformProduct } from "../../utils/productTransform";

const ProductCard = ({
  product: rawProduct,
  isInWishlist = false,
  className = "",
}) => {
  const dispatch = useDispatch();

  // Transform the product data to handle backend structure
  const product = transformProduct(rawProduct);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        maxQuantity: product.stock || 99,
      })
    );
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(
        addToWishlist({
          id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
        })
      );
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 ${className}`}
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-2xl">
          <img
            src={product.imageUrl || "/images/placeholder-product.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/images/placeholder-product.svg";
            }}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                Featured
              </span>
            )}
            {product.isOnSale && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                Sale
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                New
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 right-2">
              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                -
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </span>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex space-x-2">
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 hover:bg-white transition-all duration-200"
                title={
                  isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>

              <button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 hover:bg-white transition-all duration-200"
                title="Quick View"
              >
                <EyeIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div className="absolute bottom-2 left-2">
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center space-x-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
            </div>
          </div>

          {/* Features - Condensed */}
          {(product.minOrderQuantity > 1 || product.customizable) && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.minOrderQuantity > 1 && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  Min: {product.minOrderQuantity}
                </span>
              )}
              {product.customizable && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                  Customizable
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          <ShoppingCartIcon className="w-4 h-4" />
          <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>

      {/* Mobile Wishlist Button */}
      <div className="lg:hidden absolute top-2 right-2">
        <button
          onClick={handleWishlistToggle}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-4 h-4 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
