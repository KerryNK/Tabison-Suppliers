import React from "react";
import { Filters } from "../types/Product";

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const categories = ['military', 'safety', 'official'] as const;
const materials = ['PVC', 'Rubber', 'Leather'] as const;
const heights = [14, 22] as const;

const FilterSidebar: React.FC<Props> = ({ filters, setFilters }) => (
  <aside className="w-full md:w-64 bg-gray-50 p-4 rounded shadow mb-4 md:mb-0">
    <div>
      <h3 className="font-bold mb-2">Category</h3>
      {categories.map((cat) => (
        <label key={cat} className="block">
          <input
            type="radio"
            name="category"
            checked={filters.category === cat}
            onChange={() => setFilters({ ...filters, category: cat })}
          />{" "}
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </label>
      ))}
    </div>
    <div className="mt-4">
      <h3 className="font-bold mb-2">Material</h3>
      {materials.map((mat) => (
        <label key={mat} className="block">
          <input
            type="radio"
            name="material"
            checked={filters.material === mat}
            onChange={() => setFilters({ ...filters, material: mat })}
          />{" "}
          {mat}
        </label>
      ))}
    </div>
    <div className="mt-4">
      <h3 className="font-bold mb-2">Height</h3>
      {heights.map((h) => (
        <label key={h} className="block">
          <input
            type="radio"
            name="height"
            checked={filters.height === h}
            onChange={() => setFilters({ ...filters, height: h })}
          />{" "}
          {h} cm
        </label>
      ))}
    </div>
    <button
      className="mt-4 text-blue-600 underline"
      onClick={() => setFilters({})}
    >
      Clear Filters
    </button>
  </aside>
);

export default FilterSidebar; 