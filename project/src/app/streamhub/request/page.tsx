'use client';

import React, {useState} from 'react';
import '../../../../public/css/form.css';
import Logo from "../../../../public/images/LogoStreamHub.png";
import Footer from '../Footer.js';
import {requestPassword} from '../../services/auth';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handlePasswordResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requestPassword(email);
            setSuccessMessage('Se ha enviado un correo con instrucciones para restablecer la contraseña.');
            setErrorMessage('');
        } catch (error: any) {
            setErrorMessage('Hubo un problema al enviar el correo. Intenta nuevamente.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="main">
            <div className="login-container">
                <h1>StreamHub</h1>
                <div id="logo">
                    <img src={Logo.src} alt="Logo"/>
                </div>
                <p>Introduce tu correo para restablecer tu contraseña</p>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form method="POST" onSubmit={handlePasswordResetRequest}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Enviar correo de restablecimiento
                    </button>
                </form>
                <br/>
                <a href="./login" className="back-to-login-link">Volver al inicio de sesión</a>
            </div>
            <Footer/>
        </div>
    );
};

export default ResetPasswordPage;