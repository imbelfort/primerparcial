import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

const CheckoutForm = ({ formData, handleChange }) => {
  return (
    <div className="lg:w-2/3">
      {/* Shipping Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Truck size={20} className="mr-2" />
          Información de Envío
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
            <input
              type="text"
              name="postal"
              value={formData.postal}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CreditCard size={20} className="mr-2" />
          Método de Pago
        </h2>
        
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
                className="mr-2 accent-emerald-600"
              />
              <span>Tarjeta de Crédito/Débito</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
                className="mr-2 accent-emerald-600"
              />
              <span>PayPal</span>
            </label>
          </div>
          
          {formData.paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Expiración</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          {formData.paymentMethod === 'paypal' && (
            <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-800">
              Serás redirigido a PayPal para completar el pago una vez que confirmes el pedido.
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-6 text-sm text-gray-600">
          <ShieldCheck size={18} className="text-emerald-600 mr-2" />
          <span>Tus datos de pago están protegidos con encriptación de 256 bits.</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
