import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api.dart';

class AuthService {
  Future<bool> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.login}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final token = data['access'];

      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);

      return true;
    } else {
      return false;
    }
  }

  Future<Map<String, dynamic>> register(
      String username, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        // Registro exitoso
        return {
          'success': true,
          'message': 'Registro exitoso',
        };
      } else {
        // Error en el registro
        final data = json.decode(utf8.decode(response.bodyBytes));
        String errorMessage = 'Error durante el registro';

        // Extraer mensajes de error específicos si están disponibles
        if (data != null) {
          if (data.containsKey('username')) {
            errorMessage = 'Usuario: ${data['username'].join(', ')}';
          } else if (data.containsKey('email')) {
            errorMessage = 'Email: ${data['email'].join(', ')}';
          } else if (data.containsKey('password')) {
            errorMessage = 'Contraseña: ${data['password'].join(', ')}';
          } else if (data.containsKey('detail') || data.containsKey('error')) {
            errorMessage = data['detail'] ?? data['error'] ?? errorMessage;
          }
        }

        return {
          'success': false,
          'message': errorMessage,
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Error de conexión: ${e.toString()}',
      };
    }
  }

  Future<void> logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  Future<String?> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }
}
