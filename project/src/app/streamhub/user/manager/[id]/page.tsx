// app/content/[id]/page.tsx
import React from 'react';
import '../../../../../../public/css/UserProfile.css';
import '../../../../../../public/css/error.css';
import '../../../../../../public/css/Header.css';
import Footer from '../../../Footer.js';
import ProfileImage from "../../../../../../public/images/default.png";
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Bandera from "../../../../../../public/images/bandera_españa.png";

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

// Function to fetch content by ID
async function fetchContent(apiUrl: string): Promise<ApiResponse | null> {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error("Network response was not ok", response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

// Main function component for the content presentation page
export default async function ContentPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const apiUrl = `http://localhost:8082/StreamHub/gestores/${params.id}`;
    const content = await fetchContent(apiUrl);

    if (!content) {
        return <div>No content data available</div>; // Display if data is unavailable
    }

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
                    <a className="iniciarSesion" href={`http://localhost:3000/streamhub/user/manager/${params.id}`}>
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
                    <a href={`http://localhost:3000/streamhub/user/manager/${params.id}`}>Mi Cuenta</a>
                </div>
            </nav>
            {/* Contenido del perfil principal */}
            <div className="gridcontainer">
                {/* Cabecera con la foto de perfil del usuario */}
                <div className="fotoPerfil">
                    <img src={ProfileImage.src} className="foto" alt="Icono de perfil de usuario"/>
                </div>
                {/* Junto a la imagen del usuario aparecen también los atributos de éste */}
                <div className="datosPerfil">
                    <p><b>Nombre:</b> {content.nombre}</p>
                    <p><b>Apellidos:</b> {content.apellidos}</p>
                    <p><b>Email:</b> {content.email}</p>
                </div>
                {/* Existen botones para que se pueda editar los datos del usuario o eliminar la cuenta */}
                <div className="botonesEdicion">
                    {/* Redirecciona al usuario a la página de edición de perfil */}
                    <a href={`http://localhost:3000/streamhub/user/manager/updateUser/${params.id}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path
                                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                    {/* Redirecciona al usuario a la página de eliminación de cuenta */}
                    <a href={`http://localhost:3000/streamhub/user/manager/deleteUser/${params.id}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
