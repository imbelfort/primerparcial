import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Eye, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} añadido al carrito`);
  };

  const { addToWishlist } = useWishlist();

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-shadow duration-300 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen y acciones */}
      <div className="relative h-56 w-full overflow-hidden">
        <Link to={`/product/${product.id}`} className="block h-full">
          {imageError || !product.image ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <ImageIcon size={48} className="opacity-30" />
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
            />
          )}

          {product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded shadow">
              -{product.discountPercentage}%
            </span>
          )}
        </Link>

        {/* Botones rápidos */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button 
            onClick={() => {
             addToWishlist(product);
               toast.success(`${product.name} añadido a tu lista de deseos`, {
              icon: <Heart size={20} className="text-red-500" />,
              position: "bottom-right",
              autoClose: 2000,
               style: {
                backgroundColor: '#fff1f2',
                color: '#be123c',
               }
               });
              }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Añadir a favoritos"
          >
            <Heart size={18} className="hover:fill-red-500 hover:text-red-500" />
          </button>

          <Link
            to={`/product/${product.id}`}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Ver detalles"
          >
            <Eye size={18} className="text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h2 className="text-base font-semibold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-2">
            {product.name}
          </h2>
        </Link>

        {product.category?.name && (
          <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          {/* Precio */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-emerald-600">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm line-through text-gray-400">${product.originalPrice}</span>
            )}
          </div>

          {/* Botón carrito */}
          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className={`p-2 rounded-full transition-colors ${product.stock
                ? 'bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {!product.stock && (
          <p className="mt-2 text-xs text-red-500 font-medium">Agotado</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
