class ApiConfig {
  // Cambia esta URL según tu configuración
  static const String baseUrl = 'https://django-cts9.onrender.com/api';

  // Endpoints
  static const String products = '/store/products/';
  static const String categories = '/store/categories/';
  static const String relatedProducts = '/store/products/';

  // Autenticación
  static const String login = '/auth/token/';
  static const String register = '/auth/register/';
}
