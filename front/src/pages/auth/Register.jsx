import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users/register/', form);
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        let errorMsg = '';
        if (typeof errors === 'object') {
          errorMsg = Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
            .join('\n');
        } else {
          errorMsg = errors.detail || 'Error al registrarse';
        }
        setError(errorMsg);
      } else {
        setError('No se pudo conectar al servidor');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          {error && <p className="text-red-500 text-sm whitespace-pre-line">{error}</p>}
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg transition-all duration-200">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

