// app/content/[id]/page.tsx
import React from 'react';
import '../../../../../../../public/css/DeleteUser.css';
import '../../../../../../../public/css/error.css';
import Footer from '../../../../Footer.js';
import ProfileImage from "../../../../../../../public/images/default.png";

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
    const apiUrl = `http://localhost:8080/StreamHub/clientes/${params.id}`;
    const content = await fetchContent(apiUrl);

    if (!content) {
        return <div>No content data available</div>; // Display if data is unavailable
    }

    return (
        <div className="content-page">
            {/* Contenido del perfil principal */}
            <div className="borrar">
                {/* Formulario que muestra los atributos del usuario antes de eliminar su cuenta */}
                <form name="form">
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
            </div>
            <Footer/>
        </div>
    );
}
