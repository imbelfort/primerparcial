import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import { MapPin, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const reviews = [
  {
    name: "María Fernández",
    review: "¡Excelente servicio y productos de calidad! Volveré a comprar sin dudas.",
  },
  {
    name: "Carlos Gómez",
    review: "La atención fue rápida y los precios muy competitivos. ¡Recomendado!",
  },
  {
    name: "Laura Méndez",
    review: "Me encantó la variedad de productos. Todo llegó a tiempo y en perfecto estado.",
  },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/store/categories/');
        setCategories(response.data.results ?? response.data);
      } catch (err) {
        setError(err.message);
        toast.error('Error al cargar las categorías', {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 text-emerald-600">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md mx-auto">
          Error al cargar las categorías: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero principal */}
      <HeroBanner />

      {/* Sección de bienvenida */}
      <section className="flex flex-col items-center justify-center flex-grow container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 transition-all duration-700 hover:scale-105">
          ¡Bienvenido a tu tienda online!
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mb-8 transition-opacity duration-700 hover:opacity-80">
          Explora nuestros productos y encuentra todo lo que necesitas para tu día a día.
        </p>

        <a 
          href="/products" 
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Ver productos
        </a>
      </section>

      {/* Sección de ventajas del ecommerce */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-10">¿Por qué comprar con nosotros?</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Pago seguro */}
          <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg hover:scale-105 transition-transform duration-500">
            <CreditCard size={48} className="text-emerald-600 mb-4" />
            <h4 className="font-semibold mb-2">Pago 100% seguro</h4>
            <p className="text-gray-600 text-sm">
              Aceptamos todas las tarjetas de crédito, débito y pagos digitales.
            </p>
          </div>

          {/* Envíos rápidos */}
          <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg hover:scale-105 transition-transform duration-500">
            <Truck size={48} className="text-emerald-600 mb-4" />
            <h4 className="font-semibold mb-2">Envíos rápidos</h4>
            <p className="text-gray-600 text-sm">
              Despachamos tu compra en tiempo récord a todo el país.
            </p>
          </div>

          {/* Compra protegida */}
          <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg hover:scale-105 transition-transform duration-500">
            <ShieldCheck size={48} className="text-emerald-600 mb-4" />
            <h4 className="font-semibold mb-2">Compra protegida</h4>
            <p className="text-gray-600 text-sm">
              Tu compra está protegida ante cualquier inconveniente.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de reseñas */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-10">Lo que dicen nuestros clientes</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white shadow-md rounded-lg p-6 transform transition-transform duration-500 hover:scale-105"
            >
              <p className="text-gray-600 mb-4">"{review.review}"</p>
              <h4 className="font-semibold text-emerald-600">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de ubicación */}
      <section className="bg-emerald-50 py-12">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <MapPin size={48} className="text-emerald-600 mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-2">¡Visítanos en nuestra tienda física!</h3>
          <p className="text-gray-700 text-lg">
            Comercial Seven, Zona La Ramada, Santa Cruz de la Sierra
          </p>
        </div>
      </section>

      {/* Footer con categorías */}
      <Footer categories={categories} />
    </div>
  );
};

export default Home;
