import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Instagram } from 'lucide-react';

const Footer = ({ categories = [] }) => {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-black text-gray-300 py-10 px-6">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo y descripción */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={30} className="text-emerald-400" />
            <span className="text-2xl font-bold text-white">ElectroHub</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Tu destino para productos excepcionales. Compra fácil, rápido y seguro.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
              <Facebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
              <Instagram size={24} />
            </a>
          </div>
        </div>

        {/* Categorías dinámicas */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-white text-lg font-semibold mb-3">Categorías</h4>
          <ul className="space-y-2">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    to={`/category/${cat.slug}`} 
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No hay categorías disponibles</li>
            )}
          </ul>
        </div>

        {/* Información de contacto */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-white text-lg font-semibold mb-3">Ubicación</h4>
          <p className="text-gray-400 text-sm mb-2">
            Comercial Seven, Zona La Ramada<br/>
            Santa Cruz de la Sierra, Bolivia
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Aceptamos todos los métodos de pago 💳
          </p>
        </div>

      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        © 2025 ElectroHub. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
