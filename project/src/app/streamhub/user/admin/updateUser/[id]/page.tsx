"use client";

import React, { useEffect, useState } from 'react';
import '../../../../../../../public/css/UpdateUser.css'; // Importa el archivo CSS
import '../../../../../../../public/css/Header.css';
import Logo from "../../../../../../../public/images/LogoStreamHub.png";
import { useRouter } from 'next/navigation';
import Footer from '../../../../Footer.js';
import Bandera from "../../../../../../../public/images/bandera_españa.png";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";

interface AdminApiResponse {
    id: number;
    nombre: string;
    apellidos: string;
    fecha_de_nacimiento: string;
    email: string;
    password: string;
}

export default function UpdateAdmin(props: { params: Promise<{ id: string }> }) {
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fecha_de_nacimiento, setFechaDeNacimiento] = React.useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTokenError, setIsTokenError] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const params = await props.params;
            const adminId = params.id;
            const apiUrl = `http://usuarios:8080/StreamHub/administrador/${adminId}`;
            const token = localStorage.getItem('authToken');

            if (token) {
                try {
                    const decodedToken = jwtDecode<JwtPayload>(token);
                    if (decodedToken.role !== 'ROLE_ADMINISTRADOR' || decodedToken.userId !== Number(adminId)) {
                        console.error("Access denied: Incorrect role or unauthorized access");
                        setIsTokenError(true);
                        setLoading(false);
                        return;
                    }

                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        console.error("Failed to fetch admin data", response.status, response.statusText);
                        setIsTokenError(true);
                        setLoading(false);
                        return;
                    }

                    const data: AdminApiResponse = await response.json();
                    setId(data.id.toString());
                    setNombre(data.nombre);
                    setApellidos(data.apellidos);
                    setEmail(data.email);
                    setPassword(data.password);
                    setFechaDeNacimiento(data.fecha_de_nacimiento);
                } catch (error) {
                    console.error("Error decoding token or fetching data", error);
                    setIsTokenError(true);
                }
            } else {
                console.error("No authentication token found");
                setIsTokenError(true);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        if (!token) {
            setMessage({ type: 'error', text: 'No se encontró el token de autenticación' });
            return;
        }

        const adminData = {
            id: parseInt(id),
            nombre,
            apellidos,
            fecha_de_nacimiento,
            email,
            password,
        };

        try {
            const response = await fetch(`http://usuarios:8080/StreamHub/administrador/${adminData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Administrador actualizado exitosamente' });
                router.push(`http://gui:8080/streamhub/user/admin/${id}`);
            } else {
                const errorMessage = await response.text();
                setMessage({
                    type: 'error',
                    text: `Error al actualizar el administrador: ${errorMessage || 'Error desconocido'}`,
                });
            }
        } catch (error) {
            console.error('Error al hacer la petición:', error);
            alert('Hubo un error al enviar la solicitud');
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (isTokenError) {
        return <div>Error: Acceso no autorizado</div>;
    }


    return (
        <div className="main">
            <nav id="header">
                <a href="http://gui:8080/streamhub/user/admin/manageUsers"><img src={Logo.src} className="TBWlogo"
                                                                      alt="Logo de la empresa"/></a>
                <div className="TextLogo">StreamHub</div>
                <ul className="NavLinks">
                    <li><a href="http://gui:8080/streamhub/user/admin/manageUsers">Gestión de Usuarios</a></li>
                </ul>
                <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
                <div className="iniciarSesion">
                    <a className="iniciarSesion" href={`http://gui:8080/streamhub/user/admin/${id}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                </div>
                <div className="miCuenta">
                    <a href={`http://gui:8080/streamhub/user/admin/${id}`}>Mi Cuenta</a>
                </div>
            </nav>

            <div className="insert-content-container">
                <h1>Editar Administrador</h1>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" id="id" name="id" value={id}/>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={nombre}
                            required
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="apellidos">Apellidos</label>
                        <input
                            type="text"
                            id="apellidos"
                            name="apellidos"
                            value={apellidos}
                            required
                            onChange={(e) => setApellidos(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fecha_de_nacimiento">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            id="fecha_de_nacimiento"
                            name="fecha_de_nacimiento"
                            value={fecha_de_nacimiento}
                            required
                            onChange={(e) => setFechaDeNacimiento(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submit-button">Guardar</button>
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
