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
      <section className="hero-banner relative h-screen">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 max-w-xl">
            Delivering Tomorrow,{" "}
            <span className="text-brand-gray-light">Today</span>
          </h1>
          <p className="text-lg text-white mb-8 max-w-md font-light leading-relaxed">
            Welcome to the future of Logistics.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition"
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
