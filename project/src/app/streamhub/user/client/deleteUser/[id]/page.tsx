// app/content/[id]/page.tsx

"use client";

import React, {useEffect, useState} from 'react';
import '../../../../../../../public/css/DeleteForm.css';
import '../../../../../../../public/css/error.css';
import '../../../../../../../public/css/Header.css';
import Footer from '../../../../Footer.js';
import ProfileImage from "../../../../../../../public/images/default.png";
import Logo from "../../../../../../../public/images/LogoStreamHub.png";
import Bandera from "../../../../../../../public/images/bandera_españa.png";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";


/*
    * Añadir verificación de JWT
    * Modificar Método fetch para incluir el JWT en la petición
    *
 */
interface ApiResponse {
    id: number;
    nombre: string;
    apellidos: string;
    fechaDeNacimiento: string;
    email: string;
    password: string;
    numeroTarjetaDeCredito: string | null;
    ccv: string | null;
}

// Function to fetch content by ID using JWT at the params
async function fetchContent(apiUrl: string, token: string): Promise<ApiResponse | null> {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("Network response was not ok", response.statusText, response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

// Main function component for the content presentation page
export default function ContentPage(props: { params: Promise<{ id: string }> }) {
    const paramsHtml = React.use(props.params);
    const paramsId = paramsHtml.id;
    const [isTokenError, setIsTokenError] = useState(false);
    const [content, setContent] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const apiUrl = `http://localhost:8082/StreamHub/cliente/${paramsId}`;

// Function to fetch content by ID
async function requestDelete(apiUrl: string, token: string): Promise<void> {
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok && response.status !== 204) {
            console.error("Network response was not ok", response.statusText, response.status);
            //Actualizamos el valor de mensaje
            setMessage({type: 'error', text: 'Error al eliminar el usuario'});
        } else {
            //Actualizamos el valor de mensaje
            setMessage({type: 'success', text: 'Usuario eliminado correctamente'});
        }
    } catch (error) {
        console.error("Fetch error:", error);
        setMessage({type: 'error', text: 'Error al eliminar el usuario'});
    }
}


    //Verificar la validez del JWT y si es válido obtener los datos del usuario
    useEffect(() => {
        const fetchData = async () => {
            const storedToken = localStorage.getItem('authToken');
            setToken(storedToken);

            if (storedToken) {
                try {
                    const decodedToken = jwtDecode<JwtPayload>(storedToken);
                    console.log("Usuario: ", decodedToken.userId);

                    if (decodedToken.role !== 'ROLE_CLIENTE' || decodedToken.userId !== parseInt(paramsId, 10)) {
                        console.error("Error en el rol del usuario o acceso no autorizado");
                        setIsTokenError(true);
                        return;
                    }
                    const contentData = await fetchContent(apiUrl, storedToken);
                    setContent(contentData);
                } catch (error) {
                    console.error("Error decoding token:", error);
                    setIsTokenError(true);
                }
            } else {
                console.error("Error al obtener el token.");
                setIsTokenError(true);
            }
            setLoading(false);
        };

        fetchData();
    }, [paramsId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isTokenError) {
        return (
            <div className="error-page">
                <h1>Error: Ha sucedido un error, no tienes autenticación para esta dirección </h1>
                <div>
                    <span>Por favor, accede a </span>
                    <a href={"http://localhost:3000/streamhub/login"}>esta página</a>
                    <span> para iniciar sesión.</span>
                </div>
            </div>
        );
    }

    if (!content) {
        return <div>No content data available</div>;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!token) {
                console.error("Token no disponible");
                return;
            }

            await requestDelete(apiUrl, token);

        } catch (error) {
            console.error('Error al hacer la petición:', error);
            alert('Hubo un error al enviar la solicitud');
        }
    };
    return (
        <div className="content-page">
            <nav id="header">
                {/* Logo de la empresa */}
                <a href="/"><img src={Logo.src} className="TBWlogo" alt="Logo de la empresa"/></a>
                {/* Nombre comercial de la empresa*/}
                <div className="TextLogo">StreamHub</div>
                <ul className="NavLinks">
                    <li><a href="http://localhost:3000/streamhub/search">Buscar</a></li>
                    <li><a href="http://localhost:3000/streamhub/myList">Mi Lista</a></li>
                </ul>
                {/* Menú de idioma*/}
                <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
                {/* Iniciar sesión */}
                <div className="iniciarSesion">
                    <a className="iniciarSesion" href={`http://localhost:3000/streamhub/user/client/${paramsId}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                </div>
                <div className="miCuenta">
                    <a href={`http://localhost:3000/streamhub/user/client/${paramsId}`}>Mi Cuenta</a>
                </div>
            </nav>
            {/* Contenido del perfil principal */}
            <div className="borrar">
                {/* Formulario que muestra los atributos del usuario antes de eliminar su cuenta */}
                <form name="form" onSubmit={handleSubmit}>
                    <div className="borrarDatos">
                        <h1>¿Desea borrar su perfil?</h1>
                    </div>
                    {/* Imagen del elemento a borrar */}
                    <div className="fotoElemento">
                        <img src={ProfileImage.src} className="fotoPerfil" alt="Icono de perfil de usuario"/>
                    </div>
                    {/* Valores de los atributos a borrar */}
                    <ul className="datosElemento">
                        <li><b>Nombre:</b> {content.nombre}</li>
                        <li><b>Apellidos:</b> {content.apellidos}</li>
                        <li><b>Email:</b> {content.email}</li>
                    </ul>
                    {/* Botón para eliminar los datos deseados */}
                    <div className="boton_borrar">
                        <button type="submit" id="boton_borrar">Eliminar perfil</button>
                    </div>
                </form>
                {/* Notificación push-up */}
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
