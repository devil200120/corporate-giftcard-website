import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  HeartIcon,
  ShoppingCartIcon,
  ShareIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  MinusIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import {
  fetchProductById,
  fetchRelatedProducts,
  fetchProductReviews,
} from "../../store/slices/productSlice";
import { addToCart, selectCartItems } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../../store/slices/wishlistSlice";
import Loading from "../../components/common/Loading";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ProductCard from "../../components/product/ProductCard";
import ReviewCard from "../../components/product/ReviewCard";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentProduct: product,
    relatedProducts,
    reviews,
    isLoading,
    error,
  } = useSelector((state) => state.products);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    images: [],
  });

  const isInWishlist = wishlistItems.some((item) => item.id === parseInt(id));
  const isInCart = cartItems.some((item) => item.productId === parseInt(id));

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRelatedProducts(id));
      dispatch(fetchProductReviews(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const cartItem = {
      productId: product.id,
      quantity,
      variant: selectedVariant,
      size: selectedSize,
      color: selectedColor,
      price: getCurrentPrice(),
    };

    dispatch(addToCart(cartItem));
    toast.success("Added to cart successfully!");
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  };

  const getDiscountedPrice = () => {
    const price = getCurrentPrice();
    if (product?.discount > 0) {
      return price - (price * product.discount) / 100;
    }
    return price;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageNavigation = (direction) => {
    const totalImages = product?.images?.length || 0;
    if (direction === "prev") {
      setSelectedImageIndex((prev) =>
        prev === 0 ? totalImages - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === totalImages - 1 ? 0 : prev + 1
      );
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit review");
      return;
    }

    try {
      // Here you would dispatch a submitReview action
      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      setNewReview({ rating: 5, title: "", comment: "", images: [] });
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarSolidIcon
        key={index}
        className={`${size} ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - GiftGalore</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images?.[0]} />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary-600"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/products")}
            className="hover:text-primary-600"
          >
            Products
          </button>
          <span>/</span>
          <button
            onClick={() => navigate(`/categories/${product.category?.slug}`)}
            className="hover:text-primary-600"
          >
            {product.category?.name}
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={
                  product.images?.[selectedImageIndex] ||
                  "/api/placeholder/600/600"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation("prev")}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation("next")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Zoom Button */}
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
              >
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
              </button>

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isInWishlist ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  ${getDiscountedPrice().toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${getCurrentPrice().toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleIcon
                  className={`w-5 h-5 ${
                    product.stock > 0 ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock} available)`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Product Variants */}
            {product.variants?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Select Variant
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedVariant?.id === variant.id
                          ? "border-primary-500 bg-primary-50 text-primary-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {variant.name}
                      {variant.price !== product.price && (
                        <span className="ml-2 text-sm">
                          (+${(variant.price - product.price).toFixed(2)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? "border-primary-500 bg-primary-50 text-primary-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-primary-500 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Max: {product.stock}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isInCart}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {isInCart ? "Already in Cart" : "Add to Cart"}
              </Button>
              <Button
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      buyNow: true,
                      product: {
                        ...product,
                        quantity,
                        variant: selectedVariant,
                        size: selectedSize,
                        color: selectedColor,
                      },
                    },
                  })
                }
                variant="outline"
                disabled={product.stock === 0}
                className="flex-1"
              >
                Buy Now
              </Button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <TruckIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  2 Year Warranty
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowPathIcon className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  30 Day Returns
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ChatBubbleLeftIcon className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {["description", "specifications", "reviews", "shipping"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === "description" && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
              {product.features && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specifications ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {value}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <InformationCircleIcon className="w-5 h-5" />
                  <span>No specifications available</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Customer Reviews ({reviews?.length || 0})
                </h3>
                <Button
                  onClick={() => setShowReviewModal(true)}
                  variant="outline"
                  size="sm"
                  disabled={!isAuthenticated}
                >
                  Write Review
                </Button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews?.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Standard Shipping (Free)
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Delivery within 5-7 business days
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Express Shipping ($9.99)
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Delivery within 2-3 business days
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Return Policy
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 30-day return policy for all unused items in
                  original packaging. Free returns for defective products.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Product Image"
        size="lg"
      >
        <div className="aspect-square">
          <img
            src={
              product.images?.[selectedImageIndex] || "/api/placeholder/800/800"
            }
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
        size="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setNewReview({ ...newReview, rating: index + 1 })
                  }
                  className="text-2xl"
                >
                  {index < newReview.rating ? (
                    <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Review Title
            </label>
            <input
              type="text"
              required
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Summarize your review"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              required
              rows={4}
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Tell us about your experience with this product"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductDetailPage;
