import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'

// Icons
const TruckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShippingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const SupportIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 019.75 9.75A9.75 9.75 0 0112 21.75 9.75 9.75 0 012.25 12A9.75 9.75 0 0112 2.25z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const HeroSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#1D6D73]/10 text-[#1D6D73] text-sm font-medium mb-6">
                <TruckIcon />
                <span className="ml-2">Trusted Supplier Network</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Delivering Tomorrow,{' '}
                <span className="text-[#1D6D73]">Today</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Connect with verified suppliers across Kenya. Quality products, reliable delivery, 
                and competitive prices - all in one platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center"
                >
                  Shop Now
                  <ArrowRightIcon />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/request-quote')}
                  className="inline-flex items-center"
                >
                  Request Quote
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Trusted by 500+ businesses</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
                  <div className="text-gray-400 text-sm font-medium">Enterprise Solutions</div>
                  <div className="text-gray-400 text-sm font-medium">Same Day Delivery</div>
                  <div className="text-gray-400 text-sm font-medium">24/7 Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image/Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                {/* Mini Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1D6D73] rounded-lg flex items-center justify-center">
                        <ShippingIcon />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Office Supplies</div>
                        <div className="text-sm text-gray-500">250+ Products</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600 font-medium">In Stock</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <TruckIcon />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Electronics</div>
                        <div className="text-sm text-gray-500">180+ Products</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600 font-medium">Available</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <SupportIcon />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Industrial</div>
                        <div className="text-sm text-gray-500">320+ Products</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-orange-600 font-medium">Limited</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#1D6D73]">500+</div>
                      <div className="text-xs text-gray-500">Suppliers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#1D6D73]">10K+</div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#1D6D73]">99%</div>
                      <div className="text-xs text-gray-500">Satisfied</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#1D6D73]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}

export default HeroSection
