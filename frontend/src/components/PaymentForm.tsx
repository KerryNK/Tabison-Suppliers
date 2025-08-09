import React, { useState, useEffect } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Button from './ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card'
import paymentService, { PaymentMethod } from '../services/paymentService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { cn } from '../utils'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

// Icons
const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const PayPalIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.067 8.478c.492.775.492 1.773 0 2.548-.492.775-1.477.775-1.477.775H15.6l-.8 3.199h2.99c.492 0 .985.283.985.775s-.493.775-.985.775H14.8l-.8 3.199H12l.8-3.199H9.6l-.8 3.199H6.8l.8-3.199H4.61c-.492 0-.985-.283-.985-.775s.493-.775.985-.775H7.6l.8-3.199H5.41c-.492 0-.985-.283-.985-.775s.493-.775.985-.775H8.4l.8-3.199h1.998l-.8 3.199h3.198l.8-3.199h1.998l-.8 3.199h2.99c0 0 .985 0 1.477.775zM11.598 11.801l-.8 3.199h3.198l.8-3.199h-3.198z"/>
  </svg>
)

interface PaymentFormProps {
  amount: number
  currency: string
  orderId?: string
  onSuccess: (paymentResult: any) => void
  onError: (error: string) => void
  onCancel?: () => void
}

// Stripe Payment Component
const StripePaymentForm: React.FC<{
  amount: number
  currency: string
  orderId?: string
  onSuccess: (result: any) => void
  onError: (error: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}> = ({ amount, currency, orderId, onSuccess, onError, loading, setLoading }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [clientSecret, setClientSecret] = useState<string>('')

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const intent = await paymentService.createStripePaymentIntent(
          amount,
          currency,
          orderId,
          { customerEmail: user?.email || '' }
        )
        setClientSecret(intent.clientSecret)
      } catch (error: any) {
        onError(error.message)
      }
    }

    createPaymentIntent()
  }, [amount, currency, orderId, user?.email, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      onError('Card element not found')
      setLoading(false)
      return
    }

    try {
      const result = await paymentService.processStripePayment(
        clientSecret,
        cardElement,
        {
          name: user?.displayName || '',
          email: user?.email || '',
        }
      )

      onSuccess(result)
    } catch (error: any) {
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <CardElement options={cardElementOptions} />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        loading={loading}
        fullWidth
        size="lg"
      >
        Pay {paymentService.formatCurrency(amount, currency)}
      </Button>
    </form>
  )
}

// M-Pesa Payment Component
const MpesaPaymentForm: React.FC<{
  amount: number
  orderId?: string
  onSuccess: (result: any) => void
  onError: (error: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}> = ({ amount, orderId, onSuccess, onError, loading, setLoading }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhone, setIsValidPhone] = useState(false)

  useEffect(() => {
    setIsValidPhone(paymentService.validateKenyanPhone(phoneNumber))
  }, [phoneNumber])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!isValidPhone) {
      onError('Please enter a valid Kenyan phone number')
      return
    }

    setLoading(true)

    try {
      const result = await paymentService.initiateMpesaPayment(
        phoneNumber,
        amount,
        orderId
      )

      toast.success(result.customerMessage)

      // Poll for payment status
      try {
        const statusResult = await paymentService.pollMpesaStatus(result.checkoutRequestID)
        if (statusResult.success) {
          onSuccess(statusResult.result)
        } else {
          onError('Payment was not completed. Please try again.')
        }
      } catch (pollError: any) {
        onError(pollError.message)
      }
    } catch (error: any) {
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="mpesa-phone" className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Phone Number
        </label>
        <input
          id="mpesa-phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="0712345678 or +254712345678"
          className={cn(
            "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D6D73] focus:border-transparent transition-colors",
            isValidPhone && phoneNumber ? "border-green-300" : "border-gray-300"
          )}
          required
        />
        {phoneNumber && !isValidPhone && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid Kenyan phone number</p>
        )}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          📱 You will receive a push notification on your phone to complete the payment.
        </p>
      </div>

      <Button
        type="submit"
        disabled={!isValidPhone || loading}
        loading={loading}
        fullWidth
        size="lg"
        icon={<PhoneIcon />}
      >
        Pay {paymentService.formatCurrency(amount, 'KES')} via M-Pesa
      </Button>
    </form>
  )
}

// PayPal Payment Component
const PayPalPaymentForm: React.FC<{
  amount: number
  currency: string
  orderId?: string
  onSuccess: (result: any) => void
  onError: (error: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}> = ({ amount, currency, orderId, onSuccess, onError, loading, setLoading }) => {
  const handlePayPalPayment = async () => {
    setLoading(true)

    try {
      const order = await paymentService.createPayPalOrder(
        amount,
        currency,
        orderId,
        `Tabison Suppliers Order`
      )

      // Redirect to PayPal approval URL
      window.location.href = order.approvalUrl
    } catch (error: any) {
      onError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          🅿️ You will be redirected to PayPal to complete your payment securely.
        </p>
      </div>

      <Button
        onClick={handlePayPalPayment}
        disabled={loading}
        loading={loading}
        fullWidth
        size="lg"
        variant="outline"
        icon={<PayPalIcon />}
      >
        Pay {paymentService.formatCurrency(amount, currency)} with PayPal
      </Button>
    </div>
  )
}

// Main Payment Form Component
const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
  onCancel
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await paymentService.getPaymentMethods()
        const availableMethods = methods.filter(method => 
          paymentService.isPaymentMethodAvailable(method, currency)
        )
        setPaymentMethods(availableMethods)
        
        // Auto-select first available method
        if (availableMethods.length > 0) {
          setSelectedMethod(availableMethods[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error)
      } finally {
        setLoadingMethods(false)
      }
    }

    fetchPaymentMethods()
  }, [currency])

  if (loadingMethods) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D6D73]"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No payment methods available for {currency}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'stripe':
        return (
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              amount={amount}
              currency={currency}
              orderId={orderId}
              onSuccess={onSuccess}
              onError={onError}
              loading={loading}
              setLoading={setLoading}
            />
          </Elements>
        )
      
      case 'mpesa':
        return (
          <MpesaPaymentForm
            amount={amount}
            orderId={orderId}
            onSuccess={onSuccess}
            onError={onError}
            loading={loading}
            setLoading={setLoading}
          />
        )
      
      case 'paypal':
        return (
          <PayPalPaymentForm
            amount={amount}
            currency={currency}
            orderId={orderId}
            onSuccess={onSuccess}
            onError={onError}
            loading={loading}
            setLoading={setLoading}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Amount:</span>
          <span className="font-semibold text-lg text-gray-900">
            {paymentService.formatCurrency(amount, currency)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Payment Method
          </label>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                disabled={loading}
                className={cn(
                  "w-full p-4 text-left border rounded-lg transition-all duration-200",
                  selectedMethod === method.id
                    ? "border-[#1D6D73] bg-[#1D6D73]/5 ring-2 ring-[#1D6D73]/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {paymentService.getPaymentMethodIcon(method.id)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-5 h-5 rounded-full bg-[#1D6D73] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {selectedMethod && (
          <div className="pt-4 border-t border-gray-100">
            {renderPaymentForm()}
          </div>
        )}

        {/* Cancel Button */}
        {onCancel && (
          <div className="pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={onCancel}
              fullWidth
              disabled={loading}
            >
              Cancel Payment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentForm