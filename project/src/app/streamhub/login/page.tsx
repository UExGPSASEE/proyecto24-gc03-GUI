'use client';

import React, {useState} from 'react';
import '../../../../public/css/form.css';
import Logo from "../../../../public/images/LogoStreamHub.png";
import Footer from '../Footer.js';
import {jwtDecode} from 'jwt-decode';
import {useRouter} from 'next/navigation';
import {login} from '../../services/auth';

export interface JwtPayload {
    role: string;
    userId: number;
    email: string;
    iat: number;
    exp: number;
}

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await login(email, password);

            localStorage.setItem('authToken', token);

            const decodedToken = jwtDecode<JwtPayload>(token);
            const userId = decodedToken.userId;

            const expirationDate = new Date(decodedToken.exp * 1000);
            console.log('Fecha de expiración del token:', expirationDate);
            console.log('ROL: ', decodedToken.role);
            console.log('User ID obtenido en Login:', userId);
            let urlRouter = "";
            switch (decodedToken.role) {
                case 'ROLE_ADMINISTRADOR':
                    urlRouter= '/streamhub/user/admin/';
                    console.log(urlRouter);
                    router.push(urlRouter + userId);
                    break;
                case 'ROLE_GESTOR':
                    urlRouter= '/streamhub/user/manager/';
                    console.log(urlRouter);
                    router.push(urlRouter + userId);
                    break;
                case 'ROLE_CLIENTE':
                    urlRouter= '/streamhub/user/client/';
                    console.log(urlRouter);
                    router.push(urlRouter + userId);
                    break;
                default:
                    break;
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="main">
            <div className="login-container">
                <h1>StreamHub</h1>
                <div id={"logo"}>
                    <img src={Logo.src} alt={"Logo"}></img>
                </div>
                <p>Inicia sesión en tu cuenta</p>
                <form method="POST" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" required
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">Iniciar sesión</button>
                </form>
                <br></br>
                <a href="./signup" className="signup-link">¿Eres nuevo por aquí? Regístrate</a><br/>
                <a href="./request" className="reset-link">¿Olvidaste tu contraseña?</a>
            </div>
            <Footer/>
        </div>
    );
};

export default LoginPage;