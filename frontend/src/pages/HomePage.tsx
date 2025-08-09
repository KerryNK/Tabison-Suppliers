import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Award, Truck, Star } from "lucide-react";

const HomePage: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Military Boots (Long)",
      price: "KSh 2,000",
      image: "/placeholder.svg?height=300&width=300",
      description: "22cm Height, 8 Inches, PVC Material",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Safety Boots",
      price: "KSh 2,500",
      image: "/placeholder.svg?height=300&width=300",
      description: "Industrial grade safety footwear",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Official Men Permanent Shine",
      price: "KSh 2,000",
      image: "/placeholder.svg?height=300&width=300",
      description: "Professional formal footwear",
      rating: 4.7,
    },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-brand-teal" />,
      title: "Quality Assured",
      description: "International standards and built to last in demanding conditions.",
    },
    {
      icon: <Award className="w-8 h-8 text-brand-teal" />,
      title: "Local Manufacturing",
      description: "Proudly made in Kenya, supporting local communities.",
    },
    {
      icon: <Truck className="w-8 h-8 text-brand-teal" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery across Kenya.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-teal to-brand-teal-dark text-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              Delivering Tomorrow,{" "}
              <span className="text-brand-gray-light">Today</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-brand-gray-light font-light leading-relaxed animate-fade-in">
              Quality footwear for military, safety & professional needs across Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Link
                to="/products"
                className="bg-brand-white text-brand-teal px-8 py-4 rounded-lg font-semibold hover:bg-brand-gray-light hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Shop Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/suppliers"
                className="border-2 border-brand-white text-brand-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-white hover:text-brand-teal transition-all duration-300"
              >
                Find Suppliers
              </Link>
            </div>
          </div>
        </div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="2" cy="2" r="1"/%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular military, safety, and professional footwear
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-brand-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-gray-light animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden bg-brand-gray-bg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating})
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-brand-black mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-brand-teal">
                      {product.price}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-brand-teal hover:text-brand-teal-dark transition-colors font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-brand-teal text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-brand-gray-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Why Choose Tabison?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by professionals across Kenya for quality and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-brand-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-brand-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Contact us today for bulk orders, custom requirements, or to become a supplier partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-brand-teal text-brand-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/request-quote"
              className="border-2 border-brand-teal text-brand-teal px-8 py-4 rounded-lg font-semibold hover:bg-brand-teal hover:text-brand-white transition-all duration-300"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

<<<<<<< Current (Your changes)
<<<<<<< Current (Your changes)
export default HomePage
=======
export default HomePage;
>>>>>>> Incoming (Background Agent changes)
=======
export default HomePage;
>>>>>>> Incoming (Background Agent changes)
