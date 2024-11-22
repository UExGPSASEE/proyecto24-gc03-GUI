"use client";

import React, { useEffect, useState } from 'react';
import '../../../../../../../public/css/DeleteForm.css';
import '../../../../../../../public/css/error.css';
import '../../../../../../../public/css/Header.css';
import Footer from '../../../../Footer.js';
import ProfileImage from "../../../../../../../public/images/default.png";
import Logo from "../../../../../../../public/images/LogoStreamHub.png";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";
import Bandera from "../../../../../../../public/images/bandera_españa.png";

interface AdminApiResponse {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
}

// Función para realizar la solicitud de eliminación usando el token
async function requestDelete(apiUrl: string, token: string): Promise<void> {
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok && response.status !== 204) {
            console.error("Error en la respuesta de la red", response.statusText, response.status);
            throw new Error("Error al eliminar el administrador");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud DELETE:", error);
        throw error;
    }
}

export default function DeleteAdmin(props: { params: Promise<{ id: string }> }) {
    const [isTokenError, setIsTokenError] = useState(false);
    const [admin, setAdmin] = useState<AdminApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const params = await props.params;
            const adminId = params.id;
            const apiUrl = `http://localhost:8082/StreamHub/administrador/${adminId}`;
            const storedToken = localStorage.getItem('authToken');
            setToken(storedToken);

            if (storedToken) {
                try {
                    const decodedToken = jwtDecode<JwtPayload>(storedToken);
                    if (decodedToken.role !== 'ROLE_ADMINISTRADOR' || decodedToken.userId !== Number(adminId)) {
                        console.error("Error: Rol incorrecto o acceso no autorizado");
                        setIsTokenError(true);
                        setLoading(false);
                        return;
                    }

                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        console.error("Error al obtener los datos del administrador", response.statusText, response.status);
                        setIsTokenError(true);
                        setLoading(false);
                        return;
                    }

                    const adminData: AdminApiResponse = await response.json();
                    setAdmin(adminData);
                } catch (error) {
                    console.error("Error al procesar el token o al obtener los datos:", error);
                    setIsTokenError(true);
                }
            } else {
                console.error("Token no encontrado en el almacenamiento local.");
                setIsTokenError(true);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !admin) {
            setMessage({ type: 'error', text: 'Error: Token o datos del administrador no disponibles' });
            return;
        }

        try {
            const apiUrl = `http://localhost:8082/StreamHub/administrador/${admin.id}`;
            await requestDelete(apiUrl, token);
            setMessage({ type: 'success', text: 'Administrador eliminado correctamente' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar el administrador' + error});
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (isTokenError) {
        return (
            <div className="error-page">
                <h1>Error: No tienes autorización para realizar esta acción</h1>
                <p>
                    Por favor, <a href="http://localhost:3000/streamhub/login">inicia sesión</a> con un usuario autorizado.
                </p>
            </div>
        );
    }

    if (!admin) {
        return <div>No se encontraron datos del administrador</div>;
    }

    return (
        <div className="content-page">
            <nav id="header">
                <a href="http://localhost:3000/streamhub/user/admin/manageUsers"><img src={Logo.src} className="TBWlogo"
                                                                      alt="Logo de la empresa"/></a>
                <div className="TextLogo">StreamHub</div>
                <ul className="NavLinks">
                    <li><a href="http://localhost:3000/streamhub/user/admin/manageUsers">Gestión de Usuarios</a></li>
                </ul>
                <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
                <div className="iniciarSesion">
                    <a className="iniciarSesion" href={`http://localhost:3000/streamhub/user/admin/${admin.id}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                </div>
                <div className="miCuenta">
                    <a href={`http://localhost:3000/streamhub/user/admin/${admin.id}`}>Mi Cuenta</a>
                </div>
            </nav>
            <div className="borrar">
                <form onSubmit={handleSubmit}>
                    <div className="borrarDatos">
                        <h1>¿Estás seguro de que deseas eliminar este perfil?</h1>
                    </div>
                    <div className="fotoElemento">
                        <img src={ProfileImage.src} className="fotoPerfil" alt="Icono de perfil del administrador"/>
                    </div>
                    <ul className="datosElemento">
                        <li><b>Nombre:</b> {admin.nombre}</li>
                        <li><b>Apellidos:</b> {admin.apellidos}</li>
                        <li><b>Email:</b> {admin.email}</li>
                    </ul>
                    <div className="boton_borrar">
                        <button type="submit" id="boton_borrar">Eliminar perfil</button>
                    </div>
                </form>
                {message && (
                    <div className={`notification ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}
