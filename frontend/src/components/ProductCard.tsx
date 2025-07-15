import React, { useState } from "react";
import { Product, UserRole } from "../types/Product";
import CostBreakdownModal from "./CostBreakdownModal";

interface Props {
  product: Product;
  role: UserRole;
}

const ProductCard: React.FC<Props> = ({ product, role }) => {
  const [showModal, setShowModal] = useState(false);
  const price = role === "B2B" ? product.sellingPrice.wholesale : product.sellingPrice.retail;
  const totalCost = product.baseCost + product.labour.reduce((a, b) => a + b.cost, 0);
  const margin = ((price - totalCost) / totalCost) * 100;

  return (
    <div
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition relative cursor-pointer"
      onMouseEnter={() => setShowModal(true)}
      onMouseLeave={() => setShowModal(false)}
    >
      <div className="h-32 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full object-contain" />
        ) : (
          <span className="text-gray-400">Image</span>
        )}
      </div>
      <h2 className="font-bold text-lg">{product.name}</h2>
      <div className="text-sm text-gray-500 mb-1">
        {product.height}cm | {product.material} | {product.eyelets} eyelets
      </div>
      <div className="font-semibold text-blue-700">
        Ksh {price} <span className="text-xs text-gray-500">({role === "B2B" ? "Wholesale" : "Retail"})</span>
      </div>
      <div className="text-xs text-green-700 mt-1">Profit Margin: {margin.toFixed(1)}%</div>
      <CostBreakdownModal
        open={showModal}
        onClose={() => setShowModal(false)}
        materials={product.materials}
        labour={product.labour}
      />
    </div>
  );
};

export default ProductCard; 