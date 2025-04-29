const Order = ({ 
    cartItems, 
    subtotal, 
    shipping, 
    total, 
    loading, 
    handleSubmit 
  }) => {
    return (
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
          
          <div className="max-h-64 overflow-y-auto mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b">
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-md" 
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                  <div className="text-sm text-gray-500 flex justify-between mt-1">
                    <span>{item.quantity} x ${item.price}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              <span className="font-medium">
                {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center 
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            {loading ? 'Procesando...' : 'Confirmar pedido'}
          </button>
          
          <div className="mt-6 text-sm text-gray-600">
            <p>
              Al realizar tu compra, estas aceptando nuestros términos y condiciones y política de privacidad.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Order;