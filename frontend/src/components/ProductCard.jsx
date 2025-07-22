import React, { useState } from "react";

const ProductCard = ({ product }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-1">{product.title}</h3>
      <div className="text-gray-500 text-sm mb-2">
        <span className="font-medium">{product.type}</span>
        {product.height && <> &middot; <span>{product.height}</span></>}
      </div>
      <div className="text-xs text-gray-400 mb-2">Eyelets: {product.eyelets}</div>
      <div className="flex gap-4 mb-2">
        <span className="text-teal-700 font-semibold">Wholesale: Ksh {product.wholesale_price}</span>
        <span className="text-orange-600 font-semibold">Retail: Ksh {product.retail_price}</span>
      </div>
      <ul className="list-disc list-inside text-gray-700 text-sm mb-3">
        {product.features?.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <button
        className="mt-auto text-sm text-teal-700 underline hover:text-teal-900"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide" : "Show"} Cost Breakdown
      </button>
      {open && (
        <div className="mt-2 bg-gray-50 rounded p-3 text-xs">
          <div className="font-semibold mb-1">Cost Breakdown:</div>
          <ul>
            {product.breakdown &&
              Object.entries(product.breakdown).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="font-mono">{v}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 