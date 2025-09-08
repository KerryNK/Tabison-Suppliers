import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Award, Truck, Star } from "lucide-react";

const HomePage: React.FC = () => {
  const featuredProducts = [
    // ... your featured products data
  ];

  const features = [
    // ... your features data
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-banner relative h-screen bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 max-w-xl">
            Delivering Tomorrow,{" "}
            <span className="text-gray-200">Today</span>
          </h1>
          <p className="text-lg text-white mb-8 max-w-md font-light leading-relaxed">
            Welcome to the future of Logistics.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-white hover:bg-gray-100 text-teal-600 rounded font-semibold transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {/* ... continue with other sections unchanged ... */}
    </>
  );
};

export default HomePage;
