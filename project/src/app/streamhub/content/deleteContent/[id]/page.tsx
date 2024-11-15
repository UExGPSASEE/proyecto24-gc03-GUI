// app/content/[id]/page.tsx
import React from 'react';
import '../../../../../../public/css/DeleteForm.css';
import '../../../../../../public/css/error.css';
import '../../../../../../public/css/Header.css';
import Footer from '../../../Footer.js';
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Bandera from "../../../../../../public/images/bandera_españa.png";

interface ApiResponse {
    id: number;
    tipo: string;
    titulo: string;
    production_year: number;
    clasificacion_edad: string;
    descripcion: string;
    pertenece_a: number;
    numero_elementos: number;
    duracion: number | null;
    url: string;
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
    const apiUrl = `http://localhost:8081/StreamHub/contenidos/${params.id}`;
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
                    <a className="iniciarSesion" href={`http://localhost:3000/streamhub/login`}>
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
                    <a href={`http://localhost:3000/streamhub/login`}>Mi Cuenta</a>
                </div>
            </nav>
            {/* Contenido del perfil principal */}
            <div className="borrar">
                {/* Formulario que muestra los atributos del usuario antes de eliminar su cuenta */}
                <form name="form">
                    <div className="borrarDatos">
                        <h1>¿Desea borrar este contenido?</h1>
                    </div>
                    {/* Valores de los atributos a borrar */}
                    <ul className="datosElemento">
                        <li><b>Titulo:</b> {content.titulo}</li>
                        <li><b>Tipo:</b> {content.tipo}</li>
                        <li><b>Año:</b> {content.production_year}</li>
                    </ul>
                    {/* Botón para eliminar los datos deseados */}
                    <div className="boton_borrar">
                        <button type="submit" id="boton_borrar">Eliminar contenido</button>
                    </div>
                </form>
            </div>
            <Footer/>
        </div>
    );
}
