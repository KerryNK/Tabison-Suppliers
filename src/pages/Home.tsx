import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Truck, Award, Users } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'All our products meet international quality standards for durability and safety.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Efficient supply chain management ensures timely delivery of your orders.'
    },
    {
      icon: Award,
      title: 'Trusted Brand',
      description: 'Years of experience serving military, safety, and official footwear needs.'
    },
    {
      icon: Users,
      title: 'Customer Support',
      description: 'Dedicated support team to assist with your product selection and orders.'
    }
  ]

  const productCategories = [
    {
      title: 'Military Boots',
      description: 'Durable boots for military and tactical use',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: 'KSh 1,200 - 2,500'
    },
    {
      title: 'Safety Boots',
      description: 'Industrial safety footwear for workplace protection',
      image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: 'KSh 1,500 - 2,500'
    },
    {
      title: 'Official Boots',
      description: 'Professional footwear for formal and official use',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: 'KSh 1,250 - 2,000'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              TABISON SUPPLIERS
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Quality Footwear Solutions for Military, Safety & Official Use
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Products
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Tabison Suppliers?
            </h2>
            <p className="text-lg text-gray-600">
              We provide exceptional footwear solutions with unmatched quality and service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Product Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore our comprehensive range of professional footwear
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <div key={index} className="product-card">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">
                      {category.priceRange}
                    </span>
                    <Link
                      to="/products"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Place Your Order?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Contact us today for wholesale pricing and bulk orders
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Quote
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home