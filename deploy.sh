#!/bin/bash

# Tabison Suppliers Deployment Script
# This script helps deploy the application to Vercel (frontend) and Render (backend)

echo "🚀 Tabison Suppliers Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Build the application
build_application() {
    print_status "Building the application..."
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Failed to build frontend"
        exit 1
    fi
    cd ..
    
    print_success "Application built successfully"
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    # Check backend .env
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env file not found. Please create it with the following variables:"
        echo "MONGO_URI=your_mongodb_atlas_connection_string"
        echo "JWT_SECRET=your_jwt_secret_key"
        echo "MPESA_BUSINESS_SHORT_CODE=your_business_short_code"
        echo "MPESA_PASSKEY=your_mpesa_passkey"
        echo "MPESA_CONSUMER_KEY=your_consumer_key"
        echo "MPESA_CONSUMER_SECRET=your_consumer_secret"
        echo "MPESA_ENVIRONMENT=sandbox"
        echo "PAYPAL_CLIENT_ID=your_paypal_client_id"
        echo "PAYPAL_CLIENT_SECRET=your_paypal_client_secret"
        echo "PAYPAL_MODE=sandbox"
        echo "PORT=5000"
        echo "NODE_ENV=development"
        echo "BASE_URL=http://localhost:5000"
        echo "FRONTEND_URL=http://localhost:5173"
    else
        print_success "backend/.env file found"
    fi
    
    # Check frontend .env
    if [ ! -f "frontend/.env" ]; then
        print_warning "frontend/.env file not found. Please create it with the following variables:"
        echo "VITE_API_URL=http://localhost:5000/api"
        echo "VITE_PAYPAL_CLIENT_ID=your_paypal_client_id"
    else
        print_success "frontend/.env file found"
    fi
}

# Deploy to Render (Backend)
deploy_backend() {
    print_status "Deploying backend to Render..."
    
    if ! command -v render &> /dev/null; then
        print_warning "Render CLI not installed. Please deploy manually:"
        echo "1. Go to https://dashboard.render.com"
        echo "2. Create a new Web Service"
        echo "3. Connect your GitHub repository"
        echo "4. Set the following environment variables:"
        echo "   - NODE_ENV=production"
        echo "   - PORT=10000"
        echo "   - All variables from backend/.env"
        echo "5. Set build command: cd backend && npm install"
        echo "6. Set start command: cd backend && npm start"
        return
    fi
    
    # Deploy using Render CLI
    render deploy
    if [ $? -eq 0 ]; then
        print_success "Backend deployed successfully to Render"
    else
        print_error "Failed to deploy backend to Render"
    fi
}

# Deploy to Vercel (Frontend)
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not installed. Please deploy manually:"
        echo "1. Go to https://vercel.com/dashboard"
        echo "2. Create a new project"
        echo "3. Import your GitHub repository"
        echo "4. Set the following environment variables:"
        echo "   - VITE_API_URL=your_render_backend_url/api"
        echo "   - VITE_PAYPAL_CLIENT_ID=your_paypal_client_id"
        echo "5. Set build command: cd frontend && npm run build"
        echo "6. Set output directory: frontend/dist"
        return
    fi
    
    # Deploy using Vercel CLI
    cd frontend
    vercel --prod
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed successfully to Vercel"
    else
        print_error "Failed to deploy frontend to Vercel"
    fi
    cd ..
}

# Main deployment function
main() {
    echo "Choose deployment option:"
    echo "1. Full deployment (install, build, deploy)"
    echo "2. Install dependencies only"
    echo "3. Build application only"
    echo "4. Deploy backend to Render only"
    echo "5. Deploy frontend to Vercel only"
    echo "6. Check environment variables"
    echo "7. Exit"
    
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            check_dependencies
            install_dependencies
            build_application
            check_env_vars
            deploy_backend
            deploy_frontend
            ;;
        2)
            check_dependencies
            install_dependencies
            ;;
        3)
            check_dependencies
            install_dependencies
            build_application
            ;;
        4)
            deploy_backend
            ;;
        5)
            deploy_frontend
            ;;
        6)
            check_env_vars
            ;;
        7)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please enter a number between 1-7."
            exit 1
            ;;
    esac
}

# Run the script
main