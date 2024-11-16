import axios from 'axios';

const API_URL = 'http://localhost:8082';

/**
 * Interfaz para la respuesta del backend al autenticar.
 */
interface AuthResponse {
    jwt: string;
}

/**
 * Servicio para autenticar al usuario.
 * Envía las credenciales del usuario al backend y devuelve el token JWT si la autenticación es exitosa.
 *
 * @param email - El correo electrónico del usuario.
 * @param password - La contraseña del usuario.
 * @returns Una promesa que devuelve el token JWT.
 */
export const login = async (email: string, password: string): Promise<string> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/authenticate`, {
            email,
            password,
        });

        const token = response.data.jwt;

        console.log('Token obtenido:', token);

        return token;
    } catch (error: any) {
        // Manejar errores de la solicitud
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Error al autenticar.');
        }
        throw new Error('Error de conexión con el servidor.');
    }
};
