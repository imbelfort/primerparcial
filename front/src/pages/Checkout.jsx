import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/pago/CheckoutForm';
import Order from '../components/pago/Order';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    postal: '',
    phone: user?.phone || '',
    paymentMethod: 'card',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = parseFloat((subtotal + shipping).toFixed(2));


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para confirmar el pedido');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // 🧾 Crear orden
      const orderRes = await axios.post('/orders/create/', {
        shipping_address: `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.postal}, Tel: ${formData.phone}`,
        total_price: total,
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const orderId = orderRes.data.id;

      // ✅ Validar ID antes de crear pago
      if (!orderId) {
        throw new Error('No se pudo obtener la ID de la orden.');
      }

      // 💳 Simular pago
      const transactionId = `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      console.log('Creando pago con order_id:', orderId);
      console.log('Usuario:', user);
      await axios.post('/payments/create/', {
        
        order_id: orderId, // este es el nombre correcto que tu backend espera
        method: formData.paymentMethod,
        amount: total,
        transaction_id: transactionId,
      });

      clearCart();
      toast.success('¡Pedido y pago completados con éxito!');
      navigate('/checkout-success');
    } catch (err) {
      console.error('Error en checkout:', err.response?.data || err);
      const errors = err.response?.data;

      // Mostrar errores específicos del backend si existen
      if (errors?.order) {
        toast.error(`Error con la orden: ${errors.order[0]}`);
      } else if (errors?.amount) {
        toast.error(`Monto inválido: ${errors.amount[0]}`);
      } else if (errors?.transaction_id) {
        toast.error(`Error con ID de transacción: ${errors.transaction_id[0]}`);
      } else {
        toast.error('Error al procesar el pedido. Revisa los datos e inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/cart')}
          className="text-gray-600 hover:text-emerald-600 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Finalizar compra</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <CheckoutForm
          formData={formData}
          handleChange={handleChange}
          loading={loading}
        />

        <Order
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Checkout;
