import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-r from-emerald-100 to-teal-100">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-lg text-center transform transition-all hover:scale-105 hover:shadow-2xl">
        <CheckCircle size={72} className="mx-auto text-emerald-600 mb-5 animate-pulse" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">¡Compra exitosa!</h1>
        <p className="text-gray-700 mb-8">
          ¡Felicidades! Tu pedido ha sido procesado exitosamente. Revisa tu correo para más detalles.
        </p>
        <Link
          to="/products"
          className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:bg-gradient-to-l hover:from-teal-600 hover:to-emerald-600 transition-all duration-300"
        >
          Volver a comprar
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

