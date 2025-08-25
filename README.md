# TABISON SUPPLIERS

A comprehensive supplier management system for military, safety, and official footwear products.

## 🏢 Company Overview

Tabison Suppliers specializes in manufacturing and supplying high-quality boots for:
- Military applications
- Safety and industrial use
- Official and formal wear

## 📦 Product Catalog

### Military Boots (Long) - 22cm Height, 8 Inches

#### PVC Material, 10 Eyelets
- **Wholesale Price**: KSh 1,800
- **Retail Price**: KSh 2,000

#### Rubber Material, 10 Eyelets
- **Wholesale Price**: KSh 2,000
- **Retail Price**: KSh 2,200

### Safety Boots
- **Factory Price**: KSh 1,500 - 1,800
- **Wholesale Price**: KSh 2,100
- **Retail Price**: KSh 2,500

### Official Men Permanent Shine
- **Factory Price**: KSh 1,250 - 1,600
- **Wholesale Price**: KSh 1,800
- **Retail Price**: KSh 2,000

### Military Boots (Short) - 14cm Height, 6 Inches

#### PVC, 7 Eyelets (Without Thread)
- **Wholesale Price**: KSh 1,200
- **Retail Price**: KSh 1,300

#### PVC, 7 Eyelets (With Thread)
- **Wholesale Price**: KSh 1,300
- **Retail Price**: KSh 1,400

#### Rubber, 7 Eyelets (With Thread)
- **Wholesale Price**: KSh 1,400 - 1,450
- **Retail Price**: KSh 1,500

#### Rubber, 7 Eyelets (No Thread)
- **Wholesale Price**: KSh 1,400
- **Retail Price**: KSh 1,500

### Military Boots (Long) - 22cm Height, 8 Inches, Folded

#### PVC, Hooks
- **Wholesale Price**: KSh 2,200
- **Retail Price**: KSh 2,400

#### Rubber, Eyelets
- **Wholesale Price**: KSh 2,300
- **Retail Price**: KSh 2,500

## 🚀 Deployment Instructions

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Name: tabison-suppliers-api
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: ./

4. Add the following environment variables in Render:

   ```env
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_SHORTCODE=your_mpesa_shortcode
   ```

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Use the following settings:
   - Framework Preset: Vite
   - Root Directory: ./frontend
   - Build Command: `npm run build`
   - Output Directory: dist

4. Add the following environment variables in Vercel:

   ```env
   VITE_API_URL=https://tabison-suppliers-api.onrender.com
   ```

### After Deployment

1. Update the API URL in the frontend to point to your Render backend URL
2. Test all API endpoints through the frontend to ensure connectivity
3. Monitor the application logs on both Render and Vercel for any issues

### Notes

- The backend API is hosted at `https://tabison-suppliers-api.onrender.com`
- The frontend is hosted at `https://tabisonsuppliers.vercel.app`
- Make sure all environment variables are properly set in both platforms
- The frontend is configured to proxy API requests to the backend

#### PVC, Hooks, P-Shine
- **Wholesale Price**: KSh 2,200
- **Retail Price**: KSh 2,400

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + MUI + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **State Management**: React Query + Context API
- **Authentication**: JWT cookies, Firebase token exchange, OTP (email)
- **Media**: Cloudinary
- **Emails & PDFs**: Nodemailer + PDFKit
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📁 Project Structure

\`\`\`
Tabison-Suppliers/
├── backend/                 # 🔧 Node.js backend
│   ├── controllers/         # Route controllers
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── middlewares/        # Custom middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   ├── server.js           # Main Express server entry
│   └── package.json        # Backend dependencies
│
├── frontend/               # 🎨 React + Vite frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── api/            # API client
│   │   └── App.tsx         # Main App component
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json        # Frontend dependencies
│
├── shared/                 # Shared types/interfaces (optional)
├── .gitignore
├── README.md
└── vercel.json             # Deployment configs
\`\`\`

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/KerryNK/Tabison-Suppliers.git
   cd Tabison-Suppliers
   \`\`\`

2. **Install Backend Dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Install Frontend Dependencies**
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. **Environment Variables**
   
   Create `.env` files in both backend and frontend directories:
   
   **Backend (.env)**
   \`\`\`
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   \`\`\`
   
   **Frontend (.env)**
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

5. **Start Development Servers**
   
   **Backend:**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`
   
   **Frontend:**
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy from the `backend` folder

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`

## 📊 Features

- ✅ Comprehensive product management
- ✅ Supplier information system
- ✅ Order tracking and management
- ✅ Inventory management
- ✅ Price management (wholesale/retail)
- ✅ Product categorization
- ✅ User authentication & authorization
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ Search and filtering
- ✅ Admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Tabison Suppliers**
- Website: [tabisonsuppliers.vercel.app](https://tabisonsuppliers.vercel.app)
- Email: info@tabisonsuppliers.com
- Phone: +254 XXX XXX XXX

---

Made with ❤️ by the Tabison Suppliers Team
