import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import Card, { CardContent } from './ui/Card'
import { cn } from '../utils'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Icons
const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  isActive: boolean
  featured?: boolean
  rating?: number
  reviewCount?: number
}

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/featured`)
      if (response.data.success) {
        setProducts(response.data.data.slice(0, 3)) // Only show 3 products
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      // Use mock data if API fails
      setProducts([
        {
          _id: '1',
          name: 'Professional Office Chair',
          description: 'Ergonomic design with lumbar support for all-day comfort',
          price: 15000,
          image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400',
          category: 'Office Furniture',
          stock: 25,
          isActive: true,
          rating: 4.8,
          reviewCount: 124
        },
        {
          _id: '2',
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium sound quality with noise cancellation technology',
          price: 8500,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          category: 'Electronics',
          stock: 42,
          isActive: true,
          rating: 4.6,
          reviewCount: 89
        },
        {
          _id: '3',
          name: 'Industrial Safety Helmet',
          description: 'ANSI approved hard hat with adjustable suspension',
          price: 2500,
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
          category: 'Safety Equipment',
          stock: 67,
          isActive: true,
          rating: 4.9,
          reviewCount: 203
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId)
  }

  const handleAddToWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement add to wishlist functionality
    console.log('Add to wishlist:', productId)
  }

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`)
  }

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of quality products from trusted suppliers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Card 
              key={product._id}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
              onClick={() => handleViewProduct(product._id)}
            >
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleViewProduct(product._id)}
                      className="p-3 bg-white rounded-full text-gray-700 hover:text-[#1D6D73] transition-colors"
                      title="View Details"
                    >
                      <EyeIcon />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product._id, e)}
                      className="p-3 bg-white rounded-full text-gray-700 hover:text-[#1D6D73] transition-colors"
                      title="Add to Cart"
                    >
                      <CartIcon />
                    </button>
                    <button
                      onClick={(e) => handleAddToWishlist(product._id, e)}
                      className="p-3 bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors"
                      title="Add to Wishlist"
                    >
                      <HeartIcon />
                    </button>
                  </div>
                </div>

                {/* Stock Badge */}
                {product.stock > 0 ? (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      In Stock
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {/* Category */}
                <div className="text-sm text-gray-500 mb-2">{product.category}</div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[#1D6D73]">
                    {formatCurrency(product.price)}
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product._id, e)
                    }}
                    disabled={product.stock === 0}
                    className="min-w-[100px]"
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/products')}
            className="inline-flex items-center"
          >
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts