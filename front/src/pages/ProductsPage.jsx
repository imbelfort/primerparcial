import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter, ChevronDown, X, Sliders } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    search: '',
    sort: 'newest'
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/store/products/?page=${currentPage}`);

        setProducts(res.data.results);
        setFilteredProducts(res.data.results);

        const total = Math.ceil(res.data.count / 10); // suponiendo 10 por página
        setTotalPages(total);

        const uniqueCategories = [
          ...new Map(res.data.results.map(item => [item.category?.id, item.category])).values()
        ].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category?.id === Number(filters.category));
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    // Apply sorting
    if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filters.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'popular') {
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      search: '',
      sort: 'newest'
    });
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Productos</h1>
  <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
    Descubre nuestra colección de productos cuidadosamente seleccionados, diseñados para satisfacer tus necesidades con la mejor calidad y precio.
  </p>

      {/* Search and sort - desktop */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="newest">Más recientes</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="popular">Favoritos</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {(filters.category || filters.priceRange || filters.search) && (
            <button
              onClick={clearFilters}
              className="text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              <X size={16} className="mr-1" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Mobile search and filter toggle */}
      <div className="flex md:hidden items-center gap-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={toggleMobileFilters}
          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
        >
          <Sliders size={20} />
        </button>
      </div>

      {/* Mobile filters overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Filtros</h3>
              <button
                onClick={toggleMobileFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-full pb-24">
              <div className="mb-6">
                <h4 className="font-medium mb-2">Ordenar por</h4>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="newest">Más recientes</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="popular">Más populares</option>
                </select>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Categorías</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>Todas</span>
                  </label>

                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.id}
                        onChange={() => handleFilterChange('category', category.id)}
                        className="mr-2 accent-emerald-600"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Precio</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === ''}
                      onChange={() => handleFilterChange('priceRange', '')}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>Todos</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === '0-25'}
                      onChange={() => handleFilterChange('priceRange', '0-25')}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>$0 - $25</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === '25-50'}
                      onChange={() => handleFilterChange('priceRange', '25-50')}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>$25 - $50</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === '50-100'}
                      onChange={() => handleFilterChange('priceRange', '50-100')}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>$50 - $100</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === '100-'}
                      onChange={() => handleFilterChange('priceRange', '100-')}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>$100 o más</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Limpiar
                </button>
                <button
                  onClick={toggleMobileFilters}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters - desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Filter size={18} className="mr-2" />
              Filtros
            </h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Categorías</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                    className="mr-2 accent-emerald-600"
                  />
                  <span>Todas</span>
                </label>

                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category.id}
                      onChange={() => handleFilterChange('category', category.id)}
                      className="mr-2 accent-emerald-600"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}

              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Precio</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === ''}
                    onChange={() => handleFilterChange('priceRange', '')}
                    className="mr-2 accent-emerald-600"
                  />
                  <span>Todos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === '0-25'}
                    onChange={() => handleFilterChange('priceRange', '0-25')}
                    className="mr-2 accent-emerald-600"
                  />
                  <span>$0 - $25</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === '25-50'}
                    onChange={() => handleFilterChange('priceRange', '25-50')}
                    className="mr-2 accent-emerald-600"
                  />
                  <span>$25 - $50</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === '50-100'}
                    onChange={() => handleFilterChange('priceRange', '50-100')}
                    className="mr-2 accent-emerald-600"
                  />
                  <span>$50 - $100</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === '100-'}
                    onChange={() => handleFilterChange('priceRange', '100-')}
                    className="mr-2 accent-emerald-600"
                  />
                  <span>$100 o más</span>
                </label>
              </div>
            </div>

            {(filters.category || filters.priceRange) && (
              <button
                onClick={clearFilters}
                className="mt-6 w-full py-2 text-emerald-600 hover:text-emerald-700 border border-emerald-600 rounded-lg flex items-center justify-center"
              >
                <X size={16} className="mr-1" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}


            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-4">Intenta ajustar tus filtros de búsqueda</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
          <div className="flex justify-center mt-10 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${page === currentPage
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductsPage;