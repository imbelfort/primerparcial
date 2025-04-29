import { Package } from 'lucide-react';

export const ProductImage = ({ src, alt, className = '' }) => {
  const imageUrl = src?.startsWith('http')
    ? src
    : src
    ? `http://127.0.0.1:8000${src}`
    : null;

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover rounded-xl border border-gray-200 shadow ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/placeholder-product.png';
      }}
    />
  ) : (
    <div className={`flex items-center justify-center bg-gray-100 rounded-xl border h-96 ${className}`}>
      <Package size={64} className="text-gray-300" />
    </div>
  );
};
