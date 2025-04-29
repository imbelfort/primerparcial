import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">Tu lista de deseos está vacía</h2>
        <p>
          <Link to="/products" className="text-emerald-600 hover:underline">
            Explora productos
          </Link>{' '}
          y agrégalos a tu lista.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-48 w-full object-cover rounded-t-lg"
          />
          <div className="p-4 flex flex-col justify-between h-full">
            <h2 className="font-semibold text-lg mb-1">{item.name}</h2>
            <p className="text-emerald-600 font-medium mb-3">${item.price}</p>
            <div className="mt-auto">
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistPage;
