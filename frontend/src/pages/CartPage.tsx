import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { cn } from '../utils'
import toast from 'react-hot-toast'

// Icons
const ShoppingCartIcon = () => (
  <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

const ShoppingBagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
  </svg>
)

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount)
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return
    }
    
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      await removeFromCart(productId)
      toast.success(`${productName} removed from cart`)
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
        toast.success('Cart cleared')
      } catch (error) {
        toast.error('Failed to clear cart')
      }
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  const calculateTotal = () => {
    return cart.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
  }

  const calculateSavings = () => {
    // Calculate savings based on bulk discounts or promotions
    const total = calculateTotal()
    const freeShippingThreshold = 10000
    
    if (total >= freeShippingThreshold) {
      return 400 // Standard shipping cost saved
    }
    return 0
  }

  const cartItemCount = cart.items?.reduce((count, item) => count + item.quantity, 0) || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D6D73]"></div>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="mb-8">
              <ShoppingCartIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start browsing our products to find something you love.
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => navigate('/products')}
                icon={<ShoppingBagIcon />}
              >
                Continue Shopping
              </Button>
              <div>
                <Link
                  to="/suppliers"
                  className="text-[#1D6D73] hover:text-[#1D6D73]/80 text-sm font-medium transition-colors"
                >
                  Browse Suppliers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700"
              >
                Clear Cart
              </Button>
            </div>

            {/* Cart Items List */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item.product} className="p-6 flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          SKU: {item.product.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-[#1D6D73]">
                            {formatCurrency(item.price)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                                disabled={item.quantity <= 1 || loading}
                                className={cn(
                                  "p-2 text-gray-500 hover:text-gray-700 transition-colors",
                                  (item.quantity <= 1 || loading) && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <MinusIcon />
                              </button>
                              
                              <div className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[50px] text-center">
                                {item.quantity}
                              </div>
                              
                              <button
                                onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                                disabled={loading}
                                className={cn(
                                  "p-2 text-gray-500 hover:text-gray-700 transition-colors",
                                  loading && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <PlusIcon />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.product, item.name)}
                              disabled={loading}
                              className={cn(
                                "p-2 text-red-500 hover:text-red-700 transition-colors",
                                loading && "opacity-50 cursor-not-allowed"
                              )}
                              title="Remove item"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="mt-2 text-right sm:text-left">
                          <span className="text-sm text-gray-500">Subtotal: </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                icon={<ShoppingBagIcon />}
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cartItemCount} items)</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estimated Shipping</span>
                    <span>
                      {calculateTotal() >= 10000 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        formatCurrency(400)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (VAT 16%)</span>
                    <span>{formatCurrency(calculateTotal() * 0.16)}</span>
                  </div>

                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Savings (Free Shipping)</span>
                      <span>-{formatCurrency(calculateSavings())}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#1D6D73]">
                      {formatCurrency(
                        calculateTotal() + 
                        (calculateTotal() >= 10000 ? 0 : 400) + 
                        (calculateTotal() * 0.16)
                      )}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {calculateTotal() < 10000 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-800 mb-2">
                      Add {formatCurrency(10000 - calculateTotal())} more for free shipping!
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(calculateTotal() / 10000) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleCheckout}
                    fullWidth
                    size="lg"
                    disabled={loading}
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 text-center">
                      You'll be redirected to sign in before checkout
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">We accept:</p>
                  <div className="flex gap-2 text-2xl">
                    <span title="M-Pesa">📱</span>
                    <span title="Credit/Debit Cards">💳</span>
                    <span title="PayPal">🅿️</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="text-center pt-4">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <span>🔒</span>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recently Viewed or Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="bg-white p-8 rounded-lg text-center text-gray-500">
            Product recommendations will appear here
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
