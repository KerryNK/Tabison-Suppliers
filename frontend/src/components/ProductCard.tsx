import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price?: number;
  image: string;
  description: string;
  onQuoteRequest: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  onQuoteRequest,
  onAddToCart,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl"
    >
      <Link to={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        {price && (
          <p className="text-lg font-bold text-brand-teal mb-4">
            Ksh. {price.toLocaleString()}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onQuoteRequest}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-teal text-white rounded-lg hover:bg-brand-teal-dark transition-colors"
          >
            <FileText className="w-4 h-4" />
            Request Quote
          </button>
          <button
            onClick={onAddToCart}
            className="p-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
