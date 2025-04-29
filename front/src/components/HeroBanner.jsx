import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-black to-black py-24 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between">
        
        {/* Texto principal */}
        <div className="text-left md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Descubre productos para vos
          </h1>
          <p className="mt-4 text-lg text-gray-300 mb-8">
            Explora nuestra colección de gadgets de alta calidad seleccionados especialmente para ti.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              to="/products" 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ShoppingBag size={20} />
              Comprar ahora
            </Link>
            <Link 
              to="/categories" 
              className="flex items-center gap-2 bg-transparent border-2 border-emerald-600 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explorar categorías
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Imagen o ícono */}
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-gradient-to-br from-emerald-700 to-black p-6 rounded-2xl shadow-2xl transform hover:rotate-1 transition-transform duration-300 max-w-sm">
            <div className="bg-black rounded-lg p-8 flex items-center justify-center">
              <ShoppingBag size={120} className="text-emerald-400" />
            </div>
            <div className="mt-6 text-center">
              <span className="inline-block bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                Nueva colección
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;
