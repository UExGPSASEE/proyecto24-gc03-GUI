import axios from 'axios';
import {Config} from '@config/config';

const API_URL = Config.USUARIOS_URL;

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
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Error al autenticar.');
        }
        throw new Error('Error de conexión con el servidor.');
    }
};

/**
 * Servicio para la solicitud de restablecimiento de la contraseña de un usuario.
 * @param email
 * @param token
 * @param newPassword
 * @returns Una promesa que no devuelve nada.
 */
export const requestPassword = async (email: string): Promise<void> => {
    const response = await axios.post(`${API_URL}/request`, {email});
    return response.data;
};

/**
 * Envía la nueva contraseña y el token al backend para restablecer la contraseña.
 *
 * @param token - Token recibido en el correo para restablecer la contraseña.
 * @param newPassword - La nueva contraseña que desea establecer el usuario.
 * @returns Una promesa con la respuesta del backend.
 */
export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}/reset-password?token=${token}`, {
            newPassword,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data || 'Hubo un problema al restablecer la contraseña.'
        );
    }
};
