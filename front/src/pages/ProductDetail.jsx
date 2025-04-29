import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import { Star, ChevronRight, ShoppingCart, ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProductImage } from '../components/ProductImage';
import RelatedProducts from '../components/machine-learning/RelatedProducts';
import { useWishlist } from '../context/WishListContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/store/products/${id}/`);
        const productData = {
          ...response.data,
          price: Number(response.data.price) || 0,
          image: response.data.image
            ? response.data.image.startsWith('http')
              ? response.data.image
              : `http://127.0.0.1:8000${response.data.image}`
            : null
        };
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error al cargar el producto', {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success(`${product.name} añadido al carrito`, {
      icon: <ShoppingCart size={20} />,
      position: "bottom-right",
      autoClose: 2000,
      style: {
        backgroundColor: '#f0fdf4',
        color: '#065f46',
      }
    });
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  if (loading) return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-xl"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
        <p className="text-gray-600 mb-6">El producto que buscas no está disponible o no existe.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Inicio</Link>
        <ChevronRight size={14} className="mx-2 text-gray-400" />
        <Link to="/products" className="hover:text-emerald-600 transition-colors">Productos</Link>
        <ChevronRight size={14} className="mx-2 text-gray-400" />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <div className="h-96 md:h-[500px] bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-center">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < (product.rating || 0) ? 'currentColor' : 'none'}
                    strokeWidth={i < (product.rating || 0) ? 0 : 1.5}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.review_count || 0} reseñas)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-semibold text-emerald-600">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                {product.stock > 0 ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-700 font-medium">
                      {product.stock > 10
                        ? 'En stock'
                        : `Últimas ${product.stock} unidades`}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-red-700 font-medium">Agotado</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description || 'No hay descripción disponible.'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 w-12 text-center border-x border-gray-200 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>

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
  className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
  aria-label="Añadir a favoritos"
>
  <Heart size={20} className="hover:fill-red-500 hover:text-red-500" />
</button>
            </div>

            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-lg font-medium transition-all ${
                  product.stock > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
                disabled={product.stock <= 0}
                className={`px-6 py-3 rounded-lg text-lg font-medium transition-all ${
                  product.stock > 0
                    ? 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-sm hover:shadow-md'
                    : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts productId={id} />
    </div>
  );
};

export default ProductDetail;