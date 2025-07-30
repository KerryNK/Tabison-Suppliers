# Tabison Suppliers - E-commerce Platform

A comprehensive e-commerce platform for military, safety, and professional footwear suppliers in Kenya. Built with React, Node.js, and MongoDB.

## 🚀 Features

### User Management
- **Admin Panel**: Complete product, order, user, and FAQ management
- **Client Portal**: Registration, login, product browsing, cart management, and order tracking
- **Guest Browsing**: Product viewing without registration requirements
- **Role-based Access Control**: Admin, Client, and Guest roles

### Product Management
- **Product Catalog**: Comprehensive product listings with images, descriptions, and specifications
- **Category Filtering**: Military, Safety, Official, Industrial, Security, Professional categories
- **Product Details**: Full product information with image galleries and reviews
- **Stock Management**: Real-time inventory tracking

### Shopping Experience
- **Shopping Cart**: Add, remove, and update quantities
- **Secure Checkout**: Multi-step checkout process with validation
- **Order Management**: Complete order lifecycle tracking
- **Order History**: Customer order history and status tracking

### Payment Integration
- **M-PESA Integration**: STK push payment processing
- **PayPal Integration**: International payment support
- **Payment Status Tracking**: Real-time payment confirmation
- **Secure Transactions**: Encrypted payment processing

### FAQ System
- **Public FAQ Page**: Customer support and information
- **Admin FAQ Management**: Create, edit, and delete FAQs
- **Category Organization**: Delivery, Payments, Account, Products, General categories

### Additional Features
- **Responsive Design**: Mobile and desktop optimized
- **Dark/Light Mode**: Theme switching capability
- **Real-time Search**: Product search functionality
- **Admin Analytics**: Sales reports and statistics
- **Order Tracking**: Shipping and delivery status updates

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Material-UI** for UI components
- **React Query** for data fetching
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **M-PESA API** integration
- **PayPal API** integration

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Node.js 16+ 
- MongoDB Atlas account
- M-PESA API credentials (for payment processing)
- PayPal Developer account (for international payments)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tabison-suppliers
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# M-PESA Configuration
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_ENVIRONMENT=sandbox

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# CORS Origins
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 4. Run Development Servers

```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - Add all environment variables from the backend `.env` file
   - Update `BASE_URL` to your Render service URL
   - Update `NODE_ENV` to `production`

3. **Build Configuration**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your backend

### Frontend Deployment (Vercel)

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - Add `VITE_API_URL` pointing to your Render backend URL
   - Add `VITE_PAYPAL_CLIENT_ID` for PayPal integration

3. **Build Configuration**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy your frontend

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Configure network access (allow all IPs for development)
   - Create a database user

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. **Update Environment Variables**
   - Add the connection string to your backend environment variables

## 🔧 Configuration

### M-PESA Integration

1. **Register for M-PESA API**
   - Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke)
   - Create an account and register your application
   - Get your API credentials

2. **Configure Environment Variables**
   ```env
   MPESA_BUSINESS_SHORT_CODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_ENVIRONMENT=sandbox
   ```

### PayPal Integration

1. **Create PayPal App**
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com)
   - Create a new app
   - Get your client ID and secret

2. **Configure Environment Variables**
   ```env
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   PAYPAL_MODE=sandbox
   ```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/mpesa/stk-push` - Initiate M-PESA payment
- `POST /api/payments/mpesa/callback` - M-PESA callback
- `GET /api/payments/status/:orderId` - Get payment status
- `POST /api/payments/paypal` - Process PayPal payment

### FAQs
- `GET /api/faqs` - Get all FAQs
- `GET /api/faqs/category/:category` - Get FAQs by category
- `GET /api/faqs/:id` - Get FAQ by ID
- `POST /api/faqs` - Create FAQ (Admin)
- `PUT /api/faqs/:id` - Update FAQ (Admin)
- `DELETE /api/faqs/:id` - Delete FAQ (Admin)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configured CORS for security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: MongoDB sanitization
- **XSS Protection**: Helmet.js security headers

## 📊 Admin Features

### Dashboard
- Sales analytics and reports
- Order management
- User management
- Product inventory
- FAQ management

### Order Management
- View all orders
- Update order status
- Track shipping
- Generate reports

### Product Management
- Add/edit/delete products
- Manage inventory
- Upload product images
- Set pricing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@tabisonsuppliers.com or create an issue in the repository.

## 🔄 Updates

- **v1.0.0**: Initial release with core e-commerce features
- **v1.1.0**: Added M-PESA and PayPal payment integration
- **v1.2.0**: Enhanced admin dashboard and analytics
- **v1.3.0**: Added FAQ system and improved UX

---

**Tabison Suppliers** - Your trusted partner for military, safety, and professional footwear in Kenya.
