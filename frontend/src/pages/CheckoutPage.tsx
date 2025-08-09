import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import PaymentForm from '../components/PaymentForm'
import { cn } from '../utils'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Icons
const ShippingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  county: string
  postalCode: string
  country: string
  deliveryInstructions: string
}

interface OrderSummary {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  
  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    address: '',
    city: '',
    county: '',
    postalCode: '',
    country: 'Kenya',
    deliveryInstructions: ''
  })
  
  // Delivery options
  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [currency, setCurrency] = useState('KES')
  
  // Order summary
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  })

  // Redirect if cart is empty or user not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout')
      return
    }
    
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart')
      return
    }
  }, [cart.items, isAuthenticated, navigate])

  // Calculate order summary
  useEffect(() => {
    const subtotal = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
    const shipping = calculateShipping(deliveryMethod, subtotal)
    const tax = calculateTax(subtotal)
    const total = subtotal + shipping + tax

    setOrderSummary({ subtotal, shipping, tax, total })
  }, [cart.items, deliveryMethod])

  const calculateShipping = (method: string, subtotal: number): number => {
    if (subtotal > 10000) return 0 // Free shipping for orders over 10,000
    
    switch (method) {
      case 'express': return 800
      case 'standard': return 400
      case 'pickup': return 0
      default: return 400
    }
  }

  const calculateTax = (subtotal: number): number => {
    return subtotal * 0.16 // 16% VAT
  }

  // Delivery options
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '3-5 business days',
      price: 400,
      icon: '📦'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '1-2 business days',
      price: 800,
      icon: '⚡'
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Pick up from our store',
      price: 0,
      icon: '🏪'
    }
  ]

  // Kenyan counties for the dropdown
  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Machakos', 'Kitale', 'Garissa', 'Nyeri', 'Meru', 'Embu', 'Kakamega',
    'Bungoma', 'Kericho', 'Bomet', 'Narok', 'Kajiado', 'Kiambu'
  ]

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }))
  }

  const validateAddress = (): boolean => {
    const required = ['fullName', 'phone', 'email', 'address', 'city', 'county']
    return required.every(field => shippingAddress[field as keyof ShippingAddress].trim() !== '')
  }

  const createOrder = async (): Promise<string> => {
    setLoading(true)
    
    try {
      const orderData = {
        orderItems: cart.items?.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        deliveryMethod,
        paymentMethod: 'pending',
        itemsPrice: orderSummary.subtotal,
        shippingPrice: orderSummary.shipping,
        taxPrice: orderSummary.tax,
        totalPrice: orderSummary.total
      }

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData)
      
      if (response.data.success) {
        return response.data.data._id
      } else {
        throw new Error(response.data.message || 'Failed to create order')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!validateAddress()) {
        toast.error('Please fill in all required address fields')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      try {
        const newOrderId = await createOrder()
        setOrderId(newOrderId)
        setCurrentStep(3)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      // Clear the cart after successful payment
      await clearCart()
      
      toast.success('Payment successful! Your order has been confirmed.')
      
      // Redirect to order confirmation page
      navigate(`/order-confirmation/${orderId}`)
    } catch (error) {
      console.error('Error after payment success:', error)
      // Still navigate to confirmation even if cart clear fails
      navigate(`/order-confirmation/${orderId}`)
    }
  }

  const handlePaymentError = (error: string) => {
    toast.error(error)
    console.error('Payment error:', error)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount)
  }

  if (!cart.items || cart.items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { step: 1, title: 'Shipping Address', icon: <LocationIcon /> },
              { step: 2, title: 'Delivery Options', icon: <ShippingIcon /> },
              { step: 3, title: 'Payment', icon: '💳' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep >= item.step
                    ? "bg-[#1D6D73] border-[#1D6D73] text-white"
                    : "border-gray-300 text-gray-400"
                )}>
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </div>
                <div className="ml-3">
                  <p className={cn(
                    "text-sm font-medium",
                    currentStep >= item.step ? "text-[#1D6D73]" : "text-gray-500"
                  )}>
                    {item.title}
                  </p>
                </div>
                {index < 2 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    currentStep > item.step ? "bg-[#1D6D73]" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                      placeholder="Building name, street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        County *
                      </label>
                      <select
                        value={shippingAddress.county}
                        onChange={(e) => handleAddressChange('county', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                        required
                      >
                        <option value="">Select County</option>
                        {kenyanCounties.map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Instructions
                    </label>
                    <textarea
                      value={shippingAddress.deliveryInstructions}
                      onChange={(e) => handleAddressChange('deliveryInstructions', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Options */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deliveryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDeliveryMethod(option.id)}
                      className={cn(
                        "w-full p-4 text-left border rounded-lg transition-all duration-200",
                        deliveryMethod === option.id
                          ? "border-[#1D6D73] bg-[#1D6D73]/5 ring-2 ring-[#1D6D73]/20"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{option.name}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {option.price === 0 ? 'Free' : formatCurrency(option.price)}
                          </div>
                          {deliveryMethod === option.id && (
                            <div className="w-5 h-5 rounded-full bg-[#1D6D73] flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && orderId && (
              <PaymentForm
                amount={orderSummary.total}
                currency={currency}
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={() => setCurrentStep(2)}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.items?.map((item) => (
                    <div key={item.product} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{formatCurrency(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (VAT)</span>
                    <span>{formatCurrency(orderSummary.tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatCurrency(orderSummary.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/cart')}
              disabled={loading}
            >
              {currentStep > 1 ? 'Previous Step' : 'Back to Cart'}
            </Button>
            
            <Button
              onClick={handleNextStep}
              loading={loading}
              size="lg"
            >
              {currentStep === 1 ? 'Continue to Delivery' : 'Continue to Payment'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage