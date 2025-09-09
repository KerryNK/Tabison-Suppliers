#!/bin/bash

# Build script for Tabison Suppliers
echo "Building Tabison Suppliers..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Build frontend
echo "Building frontend..."
cd ../frontend
npm install
npm run build

# Copy frontend build to backend public directory
echo "Copying frontend build to backend..."
cp -r dist ../backend/public

echo "Build completed successfully!"
