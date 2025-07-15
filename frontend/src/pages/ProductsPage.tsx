import React, { useEffect, useState } from "react";
import { Product, Filters, UserRole } from "../types/Product";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [role, setRole] = useState<UserRole>("B2B");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.material) params.append("material", filters.material);
    if (filters.height) params.append("height", filters.height.toString());
    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || data));
  }, [filters]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} role={role} />
        ))}
      </main>
      <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow">
        <label>
          <input
            type="radio"
            checked={role === "B2B"}
            onChange={() => setRole("B2B")}
          />{" "}
          B2B
        </label>
        <label className="ml-2">
          <input
            type="radio"
            checked={role === "B2C"}
            onChange={() => setRole("B2C")}
          />{" "}
          B2C
        </label>
      </div>
    </div>
  );
};

export default ProductsPage; 