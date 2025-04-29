import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const CategoriesPage = () => {
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
        <Loader2 className="animate-spin h-16 w-16 text-emerald-600" />
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
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 text-center">
        Categorías
      </h1>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No se encontraron categorías</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
            >
              <div className="relative h-48 bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image.startsWith('http') 
                      ? category.image 
                      : `http://localhost:8000${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="text-gray-400 h-16 w-16" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                {category.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
