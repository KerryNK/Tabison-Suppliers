import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, ShoppingCart, Heart, Grid3X3, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/client";

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const api = useApi();

  // Refetch when filters change — add all filter states to query key for proper cache and refetching
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", { search: searchTerm, category, priceRange, sortBy }],
    queryFn: () =>
      api.getProducts({
        search: searchTerm,
        category,
        priceRange,
        sortBy,
      }),
  });

  const products = productsData?.data?.data || [];

  const categories = [
    { value: "", label: "All Categories" },
    { value: "military", label: "Military Boots" },
    { value: "safety", label: "Safety Boots" },
    { value: "gear", label: "Gear" },
    { value: "accessories", label: "Accessories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Hoodies" },
  ];

  const priceRanges = [
    { value: "", label: "All Prices" },
    { value: "0-1000", label: "Under KSh 1,000" },
    { value: "1000-2000", label: "KSh 1,000 - 2,000" },
    { value: "2000-3000", label: "KSh 2,000 - 3,000" },
    { value: "3000+", label: "Above KSh 3,000" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div className="min-h-screen bg-brand-gray-bg">
      {/* Header */}
      <div className="bg-brand-white border-b border-brand-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive collection of military, safety, and professional footwear
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-brand-white rounded-2xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-brand-black">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600 hover:text-brand-teal transition-colors"
                >
                  <Filter size={20} />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Category
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map((cat) => (
                      <label key={cat.value || "all"} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={category === cat.value}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-4 h-4 text-brand-teal border-brand-gray-light focus:ring-brand-teal"
                        />
                        <span className="ml-2 text-sm text-gray-700">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors text-sm"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("");
                    setPriceRange("");
                    setSortBy("newest");
                  }}
                  className="w-full text-sm text-brand-teal hover:text-brand-teal-dark font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-gray-600">
                {products.length > 0 && (
                  <span>
                    {products.length} product{products.length !== 1 ? "s" : ""} found
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-brand-gray-light rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-brand-teal text-brand-white"
                        : "text-gray-600 hover:text-brand-teal"
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-brand-teal text-brand-white"
                        : "text-gray-600 hover:text-brand-teal"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }`}
              >
                {products.map((product: any) => (
                  <div
                    key={product._id}
                    className={`group bg-brand-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`${
                        viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square"
                      } overflow-hidden bg-brand-gray-bg relative`}
                    >
                      <img
                        src={product.images?.[0] || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-brand-white rounded-full shadow-md hover:bg-brand-gray-light transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                      </div>

                      <h3 className="font-semibold text-lg text-brand-black mb-2 group-hover:text-brand-teal transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="inline-block bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-full text-xs font-medium mb-3">
                        {product.category}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-brand-black">
                            KSh {product.price?.toLocaleString()}
                          </span>
                          {product.retailPrice && (
                            <p className="text-sm text-gray-500">
                              Retail: KSh {product.retailPrice.toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/products/${product._id}`}
                            className="text-brand-teal hover:text-brand-teal-dark transition-colors font-medium text-sm"
                          >
                            View Details
                          </Link>
                          <button className="bg-brand-teal text-brand-white p-2 rounded-lg hover:bg-brand-teal-dark transition-colors">
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("");
                    setPriceRange("");
                  }}
                  className="bg-brand-teal text-brand-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
