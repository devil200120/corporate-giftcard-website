// Utility functions to transform product data from backend to frontend format

export const transformProduct = (product) => {
  if (!product) return null;
  
  const transformed = {
    ...product,
    // Ensure _id is preserved with multiple fallbacks
    _id: product._id || product.id || product.productId,
    id: product._id || product.id || product.productId, // Add id as alias for _id
    
    // More defensive price transformation
    price: product.price?.sale || product.price?.regular || product.price || 0,
    originalPrice: (product.price?.sale && product.price?.regular) ? product.price.regular : null,
    
    // More defensive image transformation with better fallback
    imageUrl: (() => {
      // Check for images array first (this is the main backend structure)
      if (product.images && product.images.length > 0) {
        const mainImage = product.images.find(img => img.isMain) || product.images[0];
        if (mainImage && mainImage.url) {
          return mainImage.url;
        }
      }
      
      // Check for imageUrl object with url property (legacy structure)
      if (product.imageUrl && typeof product.imageUrl === 'object' && product.imageUrl.url) {
        return product.imageUrl.url;
      }
      
      // Check for direct imageUrl string
      if (product.imageUrl && typeof product.imageUrl === 'string') {
        return product.imageUrl;
      }
      
      // Check for direct url property
      if (product.url) {
        return product.url;
      }
      
      // Check for single image property
      if (product.image) {
        if (typeof product.image === 'string') {
          return product.image;
        }
        if (product.image.url) {
          return product.image.url;
        }
      }
      
      // Use a proper placeholder
      return '/images/placeholder-product.svg';
    })(),
    images: product.images || [],
    
    // More defensive inventory transformation
    stock: product.inventory?.stockQuantity || product.stock || product.quantity || 0,
    
    // More defensive ratings transformation
    rating: product.ratings?.average || product.rating || 0,
    reviewCount: product.ratings?.count || product.reviewCount || 0,
    
    // More defensive category transformation
    category: product.category?.name || product.categoryName || product.category || '',
    categoryId: product.category?._id || product.categoryId || product.category,
    
    // Transform corporate features
    minOrderQuantity: product.corporateFeatures?.minBulkOrder || 1,
    customizable: (product.customization && product.customization.length > 0) || false,
    
    // Transform status flags
    isFeatured: product.isFeatured || false,
    isNew: product.isNew || false,
    isOnSale: (product.price?.sale || product.salePrice) ? true : false,
    
    // Keep original structure for advanced features
    _original: product
  };
  
  return transformed;
};

export const transformProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(transformProduct);
};

export const getProductMainImage = (product) => {
  if (product.images && product.images.length > 0) {
    const mainImage = product.images.find(img => img.isMain) || product.images[0];
    return mainImage.url;
  }
  return '/images/placeholder-product.jpg';
};

export const getProductPrice = (product, quantity = 1) => {
  // Check for bulk pricing
  if (product.price?.bulk && quantity > 1) {
    const bulkTiers = product.price.bulk.sort((a, b) => a.minQuantity - b.minQuantity);
    for (const tier of bulkTiers) {
      if (quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)) {
        return tier.price;
      }
    }
  }
  
  // Return sale price if available, otherwise regular price
  return product.price?.sale || product.price?.regular || 0;
};

export const getProductStock = (product) => {
  return product.inventory?.stockQuantity || 0;
};

export const isProductInStock = (product, quantity = 1) => {
  const stock = getProductStock(product);
  return stock >= quantity;
};

export const getProductStockStatus = (product) => {
  const stock = getProductStock(product);
  const lowStockThreshold = product.inventory?.lowStockThreshold || 10;
  
  if (stock === 0) return 'out_of_stock';
  if (stock <= lowStockThreshold) return 'low_stock';
  return 'in_stock';
};