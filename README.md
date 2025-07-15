# Suppliers Management API

A comprehensive REST API for managing suppliers, products, and orders with modern features and robust error handling.

## Features

- **Supplier Management**: CRUD operations for suppliers with contact information and ratings
- **Product Management**: Complete product catalog with inventory tracking
- **Order Management**: Purchase order system with status tracking
- **Advanced Filtering**: Search, pagination, and sorting capabilities
- **Data Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling and logging
- **Statistics**: Analytics and reporting endpoints

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/suppliers-db
   PORT=5000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Products

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/stats/overview` - Get product statistics

### Suppliers

- `GET /api/suppliers` - Get all suppliers with filtering
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier
- `GET /api/suppliers/stats/overview` - Get supplier statistics

### Orders

- `GET /api/orders` - Get all orders with filtering
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/stats/overview` - Get order statistics

### Health Check

- `GET /api/health` - API health status

## Query Parameters

### Common Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc/desc)

### Product Filters
- `category` - Filter by category
- `type` - Filter by product type
- `status` - Filter by status
- `supplier` - Filter by supplier ID

### Supplier Filters
- `status` - Filter by status
- `category` - Filter by category

### Order Filters
- `status` - Filter by order status
- `supplier` - Filter by supplier ID
- `paymentStatus` - Filter by payment status

## Data Models

### Product
```javascript
{
  name: String,
  type: String (Shoes|Bags|Accessories|Clothing),
  sku: String,
  wholesalePrice: Number,
  retailPrice: Number,
  stockQuantity: Number,
  supplier: ObjectId,
  status: String (Active|Inactive|Discontinued),
  // ... other fields
}
```

### Supplier
```javascript
{
  name: String,
  email: String,
  phone: String,
  address: Object,
  contactPerson: Object,
  status: String (Active|Inactive|Pending),
  rating: Number (1-5),
  // ... other fields
}
```

### Order
```javascript
{
  orderNumber: String,
  supplier: ObjectId,
  items: Array,
  totalAmount: Number,
  status: String (Pending|Confirmed|Shipped|Delivered|Cancelled),
  // ... other fields
}
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Development

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## License

MIT License 