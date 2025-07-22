import React from "react";

// Example product data (customize as needed)
const products = [
  {
    name: "Timber",
    description: "High-quality construction timber.",
    image: "https://via.placeholder.com/150?text=Timber",
  },
  {
    name: "Maize",
    description: "Fresh, locally sourced maize.",
    image: "https://via.placeholder.com/150?text=Maize",
  },
  {
    name: "Cement",
    description: "Premium cement for all projects.",
    image: "https://via.placeholder.com/150?text=Cement",
  },
  {
    name: "Fertilizer",
    description: "Boost your crops with our fertilizer.",
    image: "https://via.placeholder.com/150?text=Fertilizer",
  },
  {
    name: "Steel Rods",
    description: "Durable steel rods for construction.",
    image: "https://via.placeholder.com/150?text=Steel+Rods",
  },
  {
    name: "Paint",
    description: "Vibrant colors for every surface.",
    image: "https://via.placeholder.com/150?text=Paint",
  },
];

const ProductsSection = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Products</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-4 text-center">{product.description}</p>
            <button
              className="mt-auto px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
