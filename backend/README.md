# Corporate Gifting Platform - Backend API

A comprehensive Node.js/Express.js backend API for a corporate gifting e-commerce platform with full-featured business logic, authentication, and corporate-specific functionality.

## 🚀 Features

### Core E-commerce Features
- **Product Management**: CRUD operations, categories, search, filtering, reviews
- **Shopping Cart & Wishlist**: Full cart management with corporate bulk operations
- **Order Management**: Complete order processing with status tracking
- **User Authentication**: JWT-based auth with role-based access control
- **Payment Integration**: Stripe, Razorpay, and PayPal support
- **File Upload**: Cloudinary integration for images and documents

### Corporate-Specific Features
- **Corporate Accounts**: Multi-level approval workflows
- **Bulk Orders**: Quantity-based pricing and bulk discounts
- **Purchase Orders**: PO number tracking and corporate billing
- **Approval Workflows**: Department-level and budget-based approvals
- **Corporate Analytics**: Spending reports and order analytics

### Advanced Features
- **Coupon System**: Complex coupon management with validation rules
- **Invoice Generation**: PDF invoices and packing slips
- **Email Notifications**: Transactional emails for all order events
- **Image Management**: Multiple image variants and optimization
- **Search & Filtering**: Advanced product search with multiple filters

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gift-ecommerce/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration values
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Database will be created automatically on first run

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Required Variables
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/corporate-gifting
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=http://localhost:3000
```

### Optional Services
```bash
# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your-stripe-key
RAZORPAY_KEY_ID=rzp_test_your-key
```

## 📊 Database Models

### User Management
- **User**: Customer accounts with role-based permissions
- **Corporate**: Company profiles and settings

### Product Catalog
- **Product**: Products with variants, pricing, and inventory
- **Category**: Hierarchical product categories
- **Review**: Product reviews and ratings

### Order Management
- **Cart**: Shopping cart with item management
- **Wishlist**: User wishlists
- **Order**: Complete order processing and tracking
- **Coupon**: Discount and promotion management

## 🛣️ API Routes

### Authentication (`/api/auth`)
```
POST   /register          - User registration
POST   /login             - User login
POST   /logout            - User logout
GET    /profile           - Get user profile
PUT    /profile           - Update user profile
POST   /forgot-password   - Request password reset
POST   /reset-password    - Reset password with token
```

### Products (`/api/products`)
```
GET    /                  - Get all products (with filtering)
GET    /:id               - Get single product
POST   /                  - Create product (Admin)
PUT    /:id               - Update product (Admin)
DELETE /:id               - Delete product (Admin)
POST   /:id/reviews       - Add product review
GET    /:id/reviews       - Get product reviews
POST   /:id/images        - Upload product images
```

### Categories (`/api/categories`)
```
GET    /                  - Get all categories
GET    /tree              - Get category tree structure
GET    /:id               - Get single category
POST   /                  - Create category (Admin)
PUT    /:id               - Update category (Admin)
DELETE /:id               - Delete category (Admin)
```

### Cart & Wishlist (`/api/cart`)
```
GET    /                  - Get user cart
POST   /add               - Add item to cart
PUT    /update/:id        - Update cart item
DELETE /remove/:id       - Remove cart item
POST   /coupon/apply      - Apply coupon code
DELETE /coupon/remove     - Remove applied coupon
GET    /wishlist          - Get user wishlist
POST   /wishlist/add      - Add item to wishlist
DELETE /wishlist/:id      - Remove from wishlist
```

### Orders (`/api/orders`)
```
GET    /                  - Get user orders
POST   /                  - Create new order
GET    /:id               - Get single order
PATCH  /:id/cancel        - Cancel order
GET    /:id/invoice       - Get order invoice
GET    /track             - Track order by number
PATCH  /:id/status        - Update order status (Admin)
```

### Coupons (`/api/coupons`)
```
POST   /validate          - Validate coupon code
GET    /                  - Get all coupons (Admin)
POST   /                  - Create coupon (Admin)
PUT    /:id               - Update coupon (Admin)
DELETE /:id               - Delete coupon (Admin)
POST   /bulk              - Bulk create coupons (Admin)
```

## 🏗️ Project Structure

```
backend/
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── categoryController.js
│   └── couponController.js
├── models/               # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Category.js
│   └── Coupon.js
├── routes/               # API route definitions
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── categories.js
│   └── coupons.js
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── utils/                # Utility functions
│   ├── cloudinary.js
│   ├── emailService.js
│   └── invoiceGenerator.js
├── uploads/              # File upload directory
├── .env.example          # Environment variables template
├── server.js             # Application entry point
└── package.json          # Dependencies and scripts
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Access tokens with 30-day expiration
- Role-based access control (customer, corporate_admin, super_admin)
- Protected routes with middleware validation

### User Roles
- **Customer**: Basic shopping and order management
- **Corporate Admin**: Department-level approvals and reporting
- **Super Admin**: Full system access and configuration

## 💳 Payment Integration

### Supported Payment Methods
- **Stripe**: Credit/debit cards, digital wallets
- **Razorpay**: Indian payment methods
- **PayPal**: PayPal account payments
- **Bank Transfer**: Corporate payment processing

### Payment Flow
1. Cart checkout with payment method selection
2. Payment gateway integration
3. Order confirmation and inventory update
4. Email notifications and invoice generation

## 📧 Email Notifications

### Automated Emails
- Welcome email for new users
- Order confirmation with details
- Order status updates
- Corporate approval notifications
- Password reset emails
- Invoice and shipping notifications

### Email Templates
- Responsive HTML templates
- Company branding integration
- Personalized content with order details

## 📄 Document Generation

### PDF Generation
- **Invoices**: Professional invoices with company branding
- **Packing Slips**: Item lists for fulfillment
- **Shipping Labels**: Address labels for shipping
- **Reports**: Corporate spending and analytics reports

## 🔍 Search & Filtering

### Product Search
- Text-based search across name, description, tags
- Category-based filtering
- Price range filtering
- Brand and rating filters
- Sorting by price, popularity, rating, date

### Corporate Features
- Department-based product filtering
- Budget range filtering
- Bulk quantity availability
- Corporate approval requirements

## 📈 Analytics & Reporting

### Order Analytics
- Sales reports by date range
- Product performance analytics
- Customer behavior tracking
- Corporate spending reports

### Inventory Management
- Stock level monitoring
- Low stock alerts
- Sales velocity tracking
- Demand forecasting

## 🛡️ Security Features

### Data Protection
- Password hashing with bcrypt
- JWT token security
- Input validation and sanitization
- Rate limiting and DDoS protection

### Corporate Security
- Multi-level approval workflows
- Audit trails for all transactions
- Role-based data access
- Secure file upload handling

## 🚀 Deployment

### Development
```bash
npm run dev          # Start with nodemon
```

### Production
```bash
npm start           # Start production server
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set up SSL certificates
- Configure email service credentials
- Set up payment gateway production keys

## 🧪 Testing

```bash
npm test            # Run test suite
npm run test:watch  # Watch mode for development
```

## 📝 API Documentation

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "stack": "Error stack (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@corporategifting.com
- Documentation: [API Docs](https://api.corporategifting.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Corporate Gifting Platform Backend** - Built with ❤️ using Node.js, Express.js, and MongoDB