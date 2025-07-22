import React, { useState } from "react";
import productsData from "../data/tabison-suppliers.json";
import ProductCard from "../components/ProductCard";

const getSlug = (title) =>
  "/product/" +
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const uniqueTypes = [
  ...new Set(productsData.map((p) => p.type).filter(Boolean)),
];

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filtered = productsData.filter((p) => {
    const matchesType = !type || p.type === type;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.type && p.type.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Product Catalog
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <input
            type="text"
            placeholder="Search by title or type..."
            className="border rounded px-3 py-2 w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 w-full sm:w-48"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((product) => (
            <a
              key={product.title}
              href={getSlug(product.title)}
              className="block"
              tabIndex={-1}
            >
              <ProductCard product={product} />
            </a>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 mt-12">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductList; 