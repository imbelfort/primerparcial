import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity,
    cartTotal: contextCartTotal,
    totalItems
  } = useCart();
  
  const [isUpdating, setIsUpdating] = useState({});
  const [isRemoving, setIsRemoving] = useState({});

  // Memoizar cálculos para mejor rendimiento
  const { subtotal, shipping, total } = useMemo(() => {
    const subtotal = contextCartTotal;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [contextCartTotal]);

  const handleDecrease = async (item) => {
    setIsUpdating(prev => ({ ...prev, [item.id]: true }));
    
    try {
      if (item.quantity <= 1) {
        setIsRemoving(prev => ({ ...prev, [item.id]: true }));
        await new Promise(resolve => setTimeout(resolve, 300)); // Animación
        removeFromCart(item.id);
        toast.info(`${item.name} eliminado del carrito`);
      } else {
        decreaseQuantity(item.id);
      }
    } finally {
      setIsUpdating(prev => ({ ...prev, [item.id]: false }));
      setIsRemoving(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleIncrease = (item) => {
    setIsUpdating(prev => ({ ...prev, [item.id]: true }));
    increaseQuantity(item.id);
    setTimeout(() => setIsUpdating(prev => ({ ...prev, [item.id]: false })), 300);
  };

  const handleRemove = async (item) => {
    setIsRemoving(prev => ({ ...prev, [item.id]: true }));
    await new Promise(resolve => setTimeout(resolve, 300)); // Animación
    removeFromCart(item.id);
    toast.info(`${item.name} eliminado del carrito`);
    setIsRemoving(prev => ({ ...prev, [item.id]: false }));
  };

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-12 text-center">
          <div className="flex justify-center mb-8">
            <ShoppingBag size={72} className="text-gray-400 animate-bounce" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">¡Tu carrito está vacío!</h2>
          <p className="text-lg text-gray-700 mb-10">Aún no has añadido productos. ¿Por qué no empiezas ahora?</p>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:bg-gradient-to-l transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft size={20} className="mr-3" />
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }  

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Tu carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-700">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-center">Subtotal</div>
            </div>
            
            <div className="divide-y">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className={`p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all duration-300 ${
                    isRemoving[item.id] ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  {/* Product info */}
                  <div className="md:col-span-6 flex items-center gap-4">
                    <Link 
                      to={`/product/${item.id}`} 
                      className="flex-shrink-0 w-20 h-20 hover:opacity-90 transition-opacity"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-md" 
                        loading="lazy"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link 
                        to={`/product/${item.id}`} 
                        className="font-medium text-gray-800 hover:text-emerald-600 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                      )}
                      <button 
                        onClick={() => handleRemove(item)}
                        className="text-red-500 text-sm flex items-center mt-2 md:hidden"
                        disabled={isRemoving[item.id]}
                      >
                        <Trash2 size={14} className="mr-1" />
                        {isRemoving[item.id] ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-medium">Precio:</span>
                    <span>${parseFloat(item.price || 0).toFixed(2)}</span>

                  </div>
                  
                  {/* Quantity */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-medium">Cantidad:</span>
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => handleDecrease(item)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isUpdating[item.id]}
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 border-x text-center min-w-8">
                        {isUpdating[item.id] ? (
                          <span className="inline-block w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button 
                        onClick={() => handleIncrease(item)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isUpdating[item.id] || (item.stock && item.quantity >= item.stock)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-medium">Subtotal:</span>
                    <div className="flex items-center">
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => handleRemove(item)}
                        className="ml-4 text-gray-400 hover:text-red-500 transition-colors hidden md:block"
                        disabled={isRemoving[item.id]}
                        aria-label="Eliminar producto"
                      >
                        {isRemoving[item.id] ? (
                          <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <Link 
              to="/products" 
              className="text-emerald-600 hover:text-emerald-700 flex items-center transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continuar comprando
            </Link>
            <button
              onClick={() => {
                cartItems.forEach(item => handleRemove(item));
                toast.success('Carrito vaciado correctamente');
              }}
              className="text-red-500 hover:text-red-700 flex items-center text-sm"
            >
              <Trash2 size={16} className="mr-1" />
              Vaciar carrito
            </button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 ? (
                <div className="text-sm text-green-600">
                  ¡Envío gratis en compras mayores a $50!
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Faltan ${(50 - subtotal).toFixed(2)} para envío gratis
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Proceder al pago
            </Link>
            
            <div className="mt-6 text-sm text-gray-600">
              <p>
                Al realizar tu compra, aceptas nuestros <Link to="/terms" className="text-emerald-600 hover:underline">términos y condiciones</Link> y <Link to="/privacy" className="text-emerald-600 hover:underline">política de privacidad</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;