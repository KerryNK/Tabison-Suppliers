import React from 'react';

function ProductCard({ product }) {
  // product will have the values {name: string, description: string, price: number}
  return (
    <div className="product-card">
      {product ? (
        <>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </>
      ) : (<p>Loading product...</p>)}

      <p>Product description here.</p>
      <p>Price: $99.99</p>
      <button>Add to Cart</button>
