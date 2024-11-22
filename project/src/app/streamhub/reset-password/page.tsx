'use client';

import React, {useState} from 'react';
import '../../../../public/css/form.css';
import Logo from "../../../../public/images/LogoStreamHub.png";
import Footer from '../Footer.js';
import {resetPassword} from '../../services/auth';
import {useSearchParams, useRouter} from "next/navigation";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!token || typeof token !== 'string') {
            setError('Token inválido.');
            return;
        }

        try {
            const response = await resetPassword(token, newPassword);
            setSuccessMessage('Contraseña restablecida con éxito.');
            setError('');

            setTimeout(() => {
                router.push('/streamhub/login');
            }, 2000);
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
                <p>Restablece tu contraseña</p>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <button type="submit" className="login-button">Restablecer Contraseña</button>
                </form>
            </div>
            <Footer/>
        </div>
    );
};

export default ResetPasswordPage;