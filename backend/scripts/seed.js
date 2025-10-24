const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedCategories = async () => {
  const categories = [
    {
      name: 'Corporate Gifts',
      slug: 'corporate-gifts',
      description: 'Professional gifts for business relationships',
      image: '/images/categories/corporate-gifts.jpg',
      isActive: true,
      isFeatured: true,
      seo: {
        metaTitle: 'Corporate Gifts - Professional Business Gifts',
        metaDescription: 'Discover our premium collection of corporate gifts perfect for business relationships and client appreciation.',
        keywords: ['corporate gifts', 'business gifts', 'professional gifts']
      }
    },
    {
      name: 'Technology & Gadgets',
      slug: 'technology-gadgets',
      description: 'Latest tech accessories and gadgets',
      image: '/images/categories/technology.jpg',
      isActive: true,
      isFeatured: true,
      seo: {
        metaTitle: 'Technology & Gadgets - Corporate Tech Gifts',
        metaDescription: 'Premium technology gifts and gadgets for modern professionals.',
        keywords: ['tech gifts', 'gadgets', 'technology', 'corporate tech']
      }
    },
    {
      name: 'Apparel & Accessories',
      slug: 'apparel-accessories',
      description: 'Branded clothing and fashion accessories',
      image: '/images/categories/apparel.jpg',
      isActive: true,
      isFeatured: true,
      seo: {
        metaTitle: 'Apparel & Accessories - Corporate Branded Clothing',
        metaDescription: 'High-quality branded apparel and accessories for corporate gifting.',
        keywords: ['corporate apparel', 'branded clothing', 'accessories']
      }
    },
    {
      name: 'Home & Office',
      slug: 'home-office',
      description: 'Elegant items for home and office spaces',
      image: '/images/categories/home-office.jpg',
      isActive: true,
      isFeatured: true,
      seo: {
        metaTitle: 'Home & Office - Corporate Gifts for Workspace',
        metaDescription: 'Beautiful and functional gifts for home and office environments.',
        keywords: ['office gifts', 'home decor', 'workspace accessories']
      }
    },
    {
      name: 'Awards & Recognition',
      slug: 'awards-recognition',
      description: 'Trophies, plaques, and recognition items',
      image: '/images/categories/awards.jpg',
      isActive: true,
      isFeatured: true,
      seo: {
        metaTitle: 'Awards & Recognition - Corporate Achievement Awards',
        metaDescription: 'Premium awards and recognition items for corporate achievements.',
        keywords: ['corporate awards', 'recognition', 'trophies', 'plaques']
      }
    },
    {
      name: 'Promotional Items',
      slug: 'promotional-items',
      description: 'Branded promotional and marketing materials',
      image: '/images/categories/promotional.jpg',
      isActive: true,
      isFeatured: false,
      seo: {
        metaTitle: 'Promotional Items - Corporate Marketing Materials',
        metaDescription: 'Effective promotional items and marketing materials for brand visibility.',
        keywords: ['promotional items', 'marketing materials', 'brand promotion']
      }
    }
  ];

  await Category.deleteMany({});
  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ ${createdCategories.length} categories seeded successfully`);
  return createdCategories;
};

const seedUsers = async () => {
  const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@giftgalore.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'super_admin',
      isEmailVerified: true,
      phone: '+15550100000',
      addresses: [{
        type: 'shipping',
        addressLine1: '123 Admin Street',
        city: 'Admin City',
        state: 'California',
        pincode: '12345',
        country: 'USA',
        isDefault: true
      }]
    },
    {
      firstName: 'John',
      lastName: 'Corporate',
      email: 'john@acmecorp.com',
      password: await bcrypt.hash('password123', 12),
      role: 'corporate_admin',
      isEmailVerified: true,
      phone: '+15550101111',
      corporateDetails: {
        companyName: 'ACME Corporation',
        companyEmail: 'admin@acmecorp.com',
        companyPhone: '+15550200000',
        designation: 'Purchasing Manager',
        department: 'Procurement',
        approvalLimit: 50000,
        isApproved: true,
        approvedAt: new Date(),
        companyAddress: {
          type: 'office',
          addressLine1: '456 Corporate Blvd',
          addressLine2: 'Suite 200',
          city: 'Business City',
          state: 'New York',
          pincode: '67890',
          country: 'USA'
        }
      },
      addresses: [{
        type: 'shipping',
        addressLine1: '456 Corporate Blvd',
        addressLine2: 'Suite 200',
        city: 'Business City',
        state: 'New York',
        pincode: '67890',
        country: 'USA',
        isDefault: true
      }]
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
      isEmailVerified: true,
      phone: '+15550102222',
      addresses: [{
        type: 'shipping',
        addressLine1: '789 User Lane',
        city: 'User Town',
        state: 'Texas',
        pincode: '13579',
        country: 'USA',
        isDefault: true
      }]
    }
  ];

  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);
  console.log(`✅ ${createdUsers.length} users seeded successfully`);
  return createdUsers;
};

const seedProducts = async (categories, users) => {
  // Get admin user for createdBy field
  const adminUser = users.find(u => u.role === 'super_admin');
  
  const products = [
    // Corporate Gifts Category
    {
      name: 'Executive Leather Portfolio',
      slug: 'executive-leather-portfolio',
      description: 'Premium leather portfolio perfect for executives and business professionals. Features multiple compartments for documents, business cards, and writing instruments.',
      shortDescription: 'Premium leather portfolio for professionals',
      sku: 'ELP-001',
      category: categories.find(c => c.slug === 'corporate-gifts')._id,
      createdBy: adminUser._id,
      price: {
        regular: 89.99,
        sale: 79.99
      },
      inventory: {
        stockQuantity: 150,
        lowStockThreshold: 20,
        trackQuantity: true
      },
      images: [
        { public_id: 'leather-portfolio-1', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Executive Leather Portfolio - Black', isMain: true },
        { public_id: 'leather-portfolio-2', url: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500', alt: 'Executive Leather Portfolio - Interior' },
        { public_id: 'leather-portfolio-3', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Executive Leather Portfolio - Side View' }
      ],
      variants: [
        { name: 'Color', value: 'Black', type: 'color', priceAdjustment: 0, stockQuantity: 75 },
        { name: 'Color', value: 'Brown', type: 'color', priceAdjustment: 0, stockQuantity: 50 },
        { name: 'Color', value: 'Navy', type: 'color', priceAdjustment: 5, stockQuantity: 25 }
      ],
      tags: ['executive', 'leather', 'professional', 'customizable'],
      seo: {
        title: 'Executive Leather Portfolio - Premium Corporate Gift',
        description: 'Elegant leather portfolio perfect for corporate gifting and business professionals.',
        keywords: ['leather portfolio', 'executive gifts', 'corporate gifts', 'business accessories']
      },
      ratings: {
        average: 4.8,
        count: 45
      },
      status: 'active',
      isActive: true,
      isFeatured: true,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 25,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 5,
        samplesAvailable: true
      }
    },
    {
      name: 'Premium Gift Set - Pen & Card Holder',
      slug: 'premium-gift-set-pen-card-holder',
      description: 'Elegant gift set featuring a premium metal pen and matching business card holder. Perfect for corporate gifting and professional recognition.',
      shortDescription: 'Premium pen and card holder gift set',
      sku: 'PGS-002',
      category: categories.find(c => c.slug === 'corporate-gifts')._id,
      createdBy: adminUser._id,
      price: {
        regular: 45.99,
        sale: 39.99
      },
      inventory: {
        stockQuantity: 200,
        lowStockThreshold: 30,
        trackQuantity: true
      },
      images: [
        { public_id: 'pen-card-set-1', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Premium Pen & Card Holder Set', isMain: true },
        { public_id: 'pen-card-set-2', url: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500', alt: 'Gift Set Box Presentation' }
      ],
      variants: [
        { name: 'Finish', value: 'Silver', type: 'material', priceAdjustment: 0, stockQuantity: 100 },
        { name: 'Finish', value: 'Gold', type: 'material', priceAdjustment: 4, stockQuantity: 75 },
        { name: 'Finish', value: 'Black', type: 'material', priceAdjustment: 0, stockQuantity: 25 }
      ],
      tags: ['gift set', 'executive', 'professional', 'customizable'],
      seo: {
        title: 'Premium Gift Set - Corporate Pen & Card Holder',
        description: 'Elegant corporate gift set with premium pen and business card holder.',
        keywords: ['corporate gift set', 'executive pen', 'business card holder', 'professional gifts']
      },
      ratings: {
        average: 4.6,
        count: 32
      },
      status: 'active',
      isActive: true,
      isFeatured: true,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 50,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 3,
        samplesAvailable: true
      }
    },

    // Technology & Gadgets Category
    {
      name: 'Wireless Charging Pad with Logo Space',
      slug: 'wireless-charging-pad-logo-space',
      description: 'Sleek wireless charging pad compatible with all Qi-enabled devices. Features premium materials and dedicated space for custom logo printing.',
      shortDescription: 'Premium wireless charging pad for corporate branding',
      sku: 'WCP-003',
      category: categories.find(c => c.slug === 'technology-gadgets')._id,
      createdBy: adminUser._id,
      price: {
        regular: 34.99,
        sale: 29.99
      },
      inventory: {
        stockQuantity: 300,
        lowStockThreshold: 50,
        trackQuantity: true
      },
      images: [
        { public_id: 'wireless-charger-1', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Wireless Charging Pad - Black', isMain: true },
        { public_id: 'wireless-charger-2', url: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500', alt: 'Wireless Charger in Use' },
        { public_id: 'wireless-charger-3', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Logo Customization Area' }
      ],
      variants: [
        { name: 'Color', value: 'Black', type: 'color', priceAdjustment: 0, stockQuantity: 150 },
        { name: 'Color', value: 'White', type: 'color', priceAdjustment: 0, stockQuantity: 100 },
        { name: 'Color', value: 'Space Gray', type: 'color', priceAdjustment: 3, stockQuantity: 50 }
      ],
      tags: ['technology', 'wireless', 'charging', 'customizable', 'modern'],
      seo: {
        title: 'Wireless Charging Pad - Corporate Tech Gift',
        description: 'Premium wireless charging pad perfect for corporate branding and tech gifts.',
        keywords: ['wireless charger', 'corporate tech gifts', 'promotional technology', 'branded charger']
      },
      ratings: {
        average: 4.7,
        count: 89
      },
      status: 'active',
      isActive: true,
      isFeatured: true,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 100,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 7,
        samplesAvailable: true
      }
    },
    {
      name: 'Bluetooth Speaker - Corporate Edition',
      slug: 'bluetooth-speaker-corporate-edition',
      description: 'High-quality Bluetooth speaker with premium sound and elegant design. Perfect for office environments and corporate events.',
      shortDescription: 'Premium Bluetooth speaker for corporate use',
      sku: 'BTS-004',
      category: categories.find(c => c.slug === 'technology-gadgets')._id,
      createdBy: adminUser._id,
      price: {
        regular: 79.99,
        sale: 69.99
      },
      inventory: {
        stockQuantity: 125,
        lowStockThreshold: 25,
        trackQuantity: true
      },
      images: [
        { public_id: 'bluetooth-speaker-1', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', alt: 'Bluetooth Speaker - Corporate Edition', isMain: true },
        { public_id: 'bluetooth-speaker-2', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500', alt: 'Speaker in Office Environment' }
      ],
      variants: [
        { name: 'Color', value: 'Charcoal Black', type: 'color', priceAdjustment: 0, stockQuantity: 65 },
        { name: 'Color', value: 'Pearl White', type: 'color', priceAdjustment: 0, stockQuantity: 60 }
      ],
      tags: ['technology', 'audio', 'bluetooth', 'premium', 'office'],
      seo: {
        title: 'Corporate Bluetooth Speaker - Premium Audio Gift',
        description: 'High-quality Bluetooth speaker perfect for corporate gifting and office use.',
        keywords: ['bluetooth speaker', 'corporate audio', 'office gifts', 'premium speakers']
      },
      ratings: {
        average: 4.5,
        count: 67
      },
      status: 'active',
      isActive: true,
      isFeatured: false,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 25,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 10,
        samplesAvailable: true
      }
    },

    // Apparel & Accessories Category
    {
      name: 'Premium Corporate Polo Shirt',
      slug: 'premium-corporate-polo-shirt',
      description: 'High-quality polo shirt made from premium cotton blend. Perfect for corporate uniforms and branded apparel programs.',
      shortDescription: 'Premium cotton polo shirt for corporate branding',
      sku: 'PPS-005',
      category: categories.find(c => c.slug === 'apparel-accessories')._id,
      createdBy: adminUser._id,
      price: {
        regular: 29.99,
        sale: 24.99
      },
      inventory: {
        stockQuantity: 500,
        lowStockThreshold: 75,
        trackQuantity: true
      },
      images: [
        { public_id: 'polo-shirt-1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Premium Corporate Polo Shirt', isMain: true },
        { public_id: 'polo-shirt-2', url: 'https://images.unsplash.com/photo-1562157873-818bc0726bd4?w=500', alt: 'Polo Shirt Detail View' },
        { public_id: 'polo-shirt-3', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500', alt: 'Corporate Team Wearing Polo' }
      ],
      variants: [
        { name: 'Color', value: 'Navy', type: 'color', priceAdjustment: 0, stockQuantity: 225 },
        { name: 'Color', value: 'White', type: 'color', priceAdjustment: 0, stockQuantity: 200 },
        { name: 'Color', value: 'Gray', type: 'color', priceAdjustment: 0, stockQuantity: 75 }
      ],
      tags: ['apparel', 'polo', 'corporate', 'uniform', 'cotton'],
      seo: {
        title: 'Corporate Polo Shirt - Premium Branded Apparel',
        description: 'High-quality corporate polo shirts perfect for uniforms and branded apparel.',
        keywords: ['corporate polo', 'branded apparel', 'company shirts', 'uniform shirts']
      },
      ratings: {
        average: 4.4,
        count: 156
      },
      status: 'active',
      isActive: true,
      isFeatured: false,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 100,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 14,
        samplesAvailable: true
      }
    },

    // Home & Office Category
    {
      name: 'Executive Desk Organizer Set',
      slug: 'executive-desk-organizer-set',
      description: 'Elegant wooden desk organizer set featuring multiple compartments for pens, business cards, and office supplies. Crafted from premium materials.',
      shortDescription: 'Premium wooden desk organizer for executives',
      sku: 'EDO-006',
      category: categories.find(c => c.slug === 'home-office')._id,
      createdBy: adminUser._id,
      price: {
        regular: 64.99,
        sale: 54.99
      },
      inventory: {
        stockQuantity: 80,
        lowStockThreshold: 15,
        trackQuantity: true
      },
      images: [
        { public_id: 'desk-organizer-1', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Executive Desk Organizer - Walnut', isMain: true },
        { public_id: 'desk-organizer-2', url: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500', alt: 'Desk Organizer with Supplies' }
      ],
      variants: [
        { name: 'Wood Type', value: 'Walnut', type: 'material', priceAdjustment: 0, stockQuantity: 40 },
        { name: 'Wood Type', value: 'Cherry', type: 'material', priceAdjustment: 5, stockQuantity: 25 },
        { name: 'Wood Type', value: 'Oak', type: 'material', priceAdjustment: 0, stockQuantity: 15 }
      ],
      tags: ['office', 'organizer', 'wood', 'executive', 'desk'],
      seo: {
        title: 'Executive Desk Organizer - Premium Office Gift',
        description: 'Elegant wooden desk organizer perfect for executive offices and corporate gifts.',
        keywords: ['desk organizer', 'office gifts', 'executive accessories', 'wooden organizer']
      },
      ratings: {
        average: 4.9,
        count: 23
      },
      status: 'active',
      isActive: true,
      isFeatured: true,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 10,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 12,
        samplesAvailable: true
      }
    },

    // Awards & Recognition Category
    {
      name: 'Crystal Achievement Award',
      slug: 'crystal-achievement-award',
      description: 'Stunning crystal award perfect for recognizing outstanding achievements. Features elegant design with customizable engraving space.',
      shortDescription: 'Premium crystal award for recognition ceremonies',
      sku: 'CAA-007',
      category: categories.find(c => c.slug === 'awards-recognition')._id,
      createdBy: adminUser._id,
      price: {
        regular: 124.99,
        sale: 109.99
      },
      inventory: {
        stockQuantity: 45,
        lowStockThreshold: 10,
        trackQuantity: true
      },
      images: [
        { public_id: 'crystal-award-1', url: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=500', alt: 'Crystal Achievement Award', isMain: true },
        { public_id: 'crystal-award-2', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Award with Custom Engraving' }
      ],
      variants: [
        { name: 'Size', value: 'Small (6")', type: 'size', priceAdjustment: -25, stockQuantity: 20 },
        { name: 'Size', value: 'Medium (8")', type: 'size', priceAdjustment: 0, stockQuantity: 15 },
        { name: 'Size', value: 'Large (10")', type: 'size', priceAdjustment: 25, stockQuantity: 10 }
      ],
      tags: ['awards', 'crystal', 'recognition', 'achievement', 'premium'],
      seo: {
        title: 'Crystal Achievement Award - Corporate Recognition',
        description: 'Premium crystal awards perfect for corporate recognition and achievement ceremonies.',
        keywords: ['crystal awards', 'achievement awards', 'corporate recognition', 'employee awards']
      },
      ratings: {
        average: 4.8,
        count: 34
      },
      status: 'active',
      isActive: true,
      isFeatured: true,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 5,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 10,
        samplesAvailable: false
      }
    },

    // More products for variety
    {
      name: 'Stainless Steel Water Bottle',
      slug: 'stainless-steel-water-bottle',
      description: 'Premium stainless steel water bottle with double-wall insulation. Keeps beverages hot or cold for hours. Perfect for corporate branding.',
      shortDescription: 'Insulated stainless steel water bottle',
      sku: 'SWB-008',
      category: categories.find(c => c.slug === 'promotional-items')._id,
      createdBy: adminUser._id,
      price: {
        regular: 24.99,
        sale: 19.99
      },
      inventory: {
        stockQuantity: 400,
        lowStockThreshold: 60,
        trackQuantity: true
      },
      images: [
        { public_id: 'water-bottle-1', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', alt: 'Stainless Steel Water Bottle', isMain: true },
        { public_id: 'water-bottle-2', url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500', alt: 'Water Bottle with Logo Area' }
      ],
      variants: [
        { name: 'Color', value: 'Matte Black', type: 'color', priceAdjustment: 0, stockQuantity: 150 },
        { name: 'Color', value: 'Stainless', type: 'color', priceAdjustment: 0, stockQuantity: 125 },
        { name: 'Color', value: 'Navy Blue', type: 'color', priceAdjustment: 2, stockQuantity: 75 },
        { name: 'Color', value: 'Forest Green', type: 'color', priceAdjustment: 2, stockQuantity: 50 }
      ],
      tags: ['promotional', 'drinkware', 'stainless steel', 'insulated', 'eco-friendly'],
      seo: {
        title: 'Corporate Water Bottle - Branded Promotional Item',
        description: 'Premium stainless steel water bottles perfect for corporate promotions and employee gifts.',
        keywords: ['promotional water bottle', 'corporate drinkware', 'branded bottles', 'stainless steel bottle']
      },
      ratings: {
        average: 4.3,
        count: 78
      },
      status: 'active',
      isActive: true,
      isFeatured: false,
      corporateFeatures: {
        isCorporateGift: true,
        minBulkOrder: 200,
        bulkDiscountAvailable: true,
        customBrandingAvailable: true,
        leadTimeInDays: 7,
        samplesAvailable: true
      }
    }
  ];

  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(products);
  console.log(`✅ ${createdProducts.length} products seeded successfully`);
  return createdProducts;
};

const seedOrders = async (users, products) => {
  const corporateUser = users.find(u => u.role === 'corporate_admin');
  const customerUser = users.find(u => u.role === 'customer');
  
  const order1Subtotal = (products[0].price.regular * 10) + (products[1].price.regular * 5);
  const order2Subtotal = products[2].price.regular * 2;
  
  const orders = [
    {
      user: corporateUser._id,
      orderNumber: 'ORD-2024-001',
      items: [
        {
          product: products[0]._id,
          quantity: 10,
          unitPrice: products[0].price.regular,
          totalPrice: products[0].price.regular * 10,
          productSnapshot: {
            name: products[0].name,
            sku: products[0].sku,
            category: 'Corporate Gifts'
          }
        },
        {
          product: products[1]._id,
          quantity: 5,
          unitPrice: products[1].price.regular,
          totalPrice: products[1].price.regular * 5,
          productSnapshot: {
            name: products[1].name,
            sku: products[1].sku,
            category: 'Corporate Gifts'
          }
        }
      ],
      subtotal: order1Subtotal,
      taxAmount: order1Subtotal * 0.18, // 18% GST
      shippingAmount: 0, // Free shipping for corporate orders
      totalAmount: order1Subtotal + (order1Subtotal * 0.18),
      status: 'delivered',
      shippingAddress: {
        firstName: corporateUser.firstName,
        lastName: corporateUser.lastName,
        addressLine1: '456 Corporate Blvd',
        addressLine2: 'Suite 200',
        city: 'Business City',
        state: 'New York',
        pincode: '67890',
        country: 'USA'
      },
      billingAddress: {
        firstName: corporateUser.firstName,
        lastName: corporateUser.lastName,
        addressLine1: '456 Corporate Blvd',
        addressLine2: 'Suite 200',
        city: 'Business City',
        state: 'New York',
        pincode: '67890',
        country: 'USA',
        companyName: corporateUser.corporateDetails.companyName
      },
      paymentInfo: {
        paymentMethod: 'bank_transfer',
        paymentStatus: 'completed',
        paidAmount: order1Subtotal + (order1Subtotal * 0.18),
        paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      corporateInfo: {
        isCorporateOrder: true,
        companyName: corporateUser.corporateDetails.companyName,
        companyEmail: corporateUser.corporateDetails.companyEmail,
        contactPerson: `${corporateUser.firstName} ${corporateUser.lastName}`,
        department: corporateUser.corporateDetails.department,
        invoiceRequired: true
      },
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      user: customerUser._id,
      orderNumber: 'ORD-2024-002',
      items: [
        {
          product: products[2]._id,
          quantity: 2,
          unitPrice: products[2].price.regular,
          totalPrice: products[2].price.regular * 2,
          productSnapshot: {
            name: products[2].name,
            sku: products[2].sku,
            category: 'Technology & Gadgets'
          }
        }
      ],
      subtotal: order2Subtotal,
      taxAmount: order2Subtotal * 0.18,
      shippingAmount: 50, // Standard shipping
      totalAmount: order2Subtotal + (order2Subtotal * 0.18) + 50,
      status: 'shipped',
      shippingAddress: {
        firstName: customerUser.firstName,
        lastName: customerUser.lastName,
        addressLine1: '789 User Lane',
        city: 'User Town',
        state: 'Texas',
        pincode: '13579',
        country: 'USA'
      },
      billingAddress: {
        firstName: customerUser.firstName,
        lastName: customerUser.lastName,
        addressLine1: '789 User Lane',
        city: 'User Town',
        state: 'Texas',
        pincode: '13579',
        country: 'USA'
      },
      paymentInfo: {
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        paidAmount: order2Subtotal + (order2Subtotal * 0.18) + 50,
        paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      shippingInfo: {
        method: 'Standard Shipping',
        carrier: 'Blue Dart',
        trackingNumber: 'BD123456789',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];

  await Order.deleteMany({});
  const createdOrders = await Order.insertMany(orders);
  console.log(`✅ ${createdOrders.length} orders seeded successfully`);
  return createdOrders;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await connectDB();
    
    console.log('📂 Seeding categories...');
    const categories = await seedCategories();
    
    console.log('👥 Seeding users...');
    const users = await seedUsers();
    
    console.log('📦 Seeding products...');
    const products = await seedProducts(categories, users);
    
    console.log('🛒 Seeding orders...');
    const orders = await seedOrders(users, products);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
   Categories: ${categories.length}
   Users: ${users.length}
   Products: ${products.length}
   Orders: ${orders.length}

🔐 Test Accounts:
   Admin: admin@giftgalore.com / admin123
   Corporate: john@acmecorp.com / password123
   User: jane.smith@email.com / password123
`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedCategories, seedUsers, seedProducts, seedOrders };