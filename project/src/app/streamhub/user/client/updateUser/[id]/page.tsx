"use client"

import React, {useEffect, useState} from 'react';
import '../../../../../../../public/css/UpdateUser.css'; // Importa el archivo CSS
import '../../../../../../../public/css/Header.css';
import Logo from "../../../../../../../public/images/LogoStreamHub.png";
import { useRouter } from 'next/navigation'
import Footer from '../../../../Footer.js';
import Bandera from "../../../../../../../public/images/bandera_españa.png";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";

interface ApiResponse {
    id: number;
    nombre: string;
    apellidos: string;
    fecha_de_nacimiento: string;
    email: string;
    password: string;
    numero_tarjeta_de_credito: string;
    ccv: string;
}

// Function to fetch content by ID using JWT
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


export default function UpdateContent(props: { params: Promise<{ id: string }> }) {
    // Definir los estados para cada campo del formulario
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [idForm, setIdForm] = React.useState('');
    const [nombre, setNombre] = React.useState('');
    const [apellidos, setApellidos] = React.useState('');
    const [fecha_de_nacimiento, setFechaDeNacimiento] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = useState('');
    const [numero_tarjeta_de_credito, setNumeroTarjetaDeCredito] = React.useState('');
    const [ccv, setCcv] = React.useState('');
    const router = useRouter();
    const paramsHtml = React.use(props.params);
    const [isTokenError, setIsTokenError] = useState(false);
    const [loading, setLoading] = useState(true);
    const paramsId = paramsHtml.id;

    const getUserContent = async (token: string) => {
        const params = await props.params;
        console.warn("Params: " + params.id);

        const content = await fetchContent(`http://usuarios:8080/StreamHub/cliente/${params.id}`, token);
        if (!content) {
            return <div>No content data available</div>; // Display if data is unavailable
        }

        setIdForm(content.id.toString());
        setNombre(content.nombre);
        setApellidos(content.apellidos);
        setFechaDeNacimiento(content.fecha_de_nacimiento);
        setEmail(content.email);
        setPassword(content.password);
        setNumeroTarjetaDeCredito(content.numero_tarjeta_de_credito);
        setCcv(content.ccv);
    };

    // Variable para obtener el año actual y limitar el rango de años de nacimiento
    const currentYear = new Date().getFullYear();

    const handleClick = () => {
        if(message?.type === 'success'){
            router.push(`http://gui:8080/streamhub/user/client/${paramsId}`)
        }
    }

    useEffect(() => {
        //Verificar la validez del JWT y si es válido obtener los datos del usuario
        const fetchData = async () => {
            //Recuperamos el token del localStorage
            const token = localStorage.getItem('authToken');
            if (token) {
                try {

                    const decodedToken = jwtDecode<JwtPayload>(token);
                    console.log("Usuario: ", decodedToken.userId);
                    console.log("Rol: ", decodedToken.role);

                    if (decodedToken.role !== 'ROLE_CLIENTE' || decodedToken.userId !== parseInt(paramsId, 10)) {
                        console.error("Error en el rol del usuario o acceso no autorizado");
                        setIsTokenError(true);
                        return;
                    }
                    //Si el token es válido, hacemos una request a la API para obtener los datos del usuario
                    getUserContent(token);
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
    }, [idForm]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isTokenError) {
        return (
            <div className="error-page">
                <h1>Error: Ha sucedido un error, no tienes autenticación para esta dirección </h1>
                <div>
                    <span>Por favor, accede a </span>
                    <a href={"http://gui:8080/streamhub/login"}>esta página</a>
                    <span> para iniciar sesión.</span>
                </div>
            </div>
        );
    }

    if (!email || !password || !numero_tarjeta_de_credito || !ccv || !fecha_de_nacimiento) {
        return <div>No content data available</div>;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Using Date.parse method
        const parse = Date.parse(fecha_de_nacimiento);
        // Converting to date object
        const date = new Date(parse)
        // Verificacion  de campos
        if (date.getFullYear() > (currentYear - 18)) {
            setMessage({type: 'error', text: `Tienes que ser mayor de 18 años para gestionar tu cuenta`});
            return;
        }

        //Creacion de objeto con los datos del formulario
        const contentData = {
            id: parseInt(idForm),
            nombre,
            apellidos,
            fecha_de_nacimiento,
            email,
            password,
            numero_tarjeta_de_credito,
            ccv
        };

        //Envio de datos al servidor
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://usuarios:8080/StreamHub/cliente/${contentData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contentData),
            });
            //Verificacion de respuesta
            if (response.ok) {
                setMessage({type: 'success', text: 'Usuario actualizado exitosamente'});
            } else {
                const errorMessage = await response.text();
                setMessage({
                    type: 'error',
                    text: `Error al actualizar el usuario: ${errorMessage || 'Error desconocido'}`
                });
            }
        } catch (error) {
            console.error('Error al hacer la petición:', error);
            alert('Hubo un error al enviar la solicitud');
        }
    };

    return (
        <div className="main">
            <nav id="header">
                {/* Logo de la empresa */}
                <a href="http://gui:8080/streamhub/search"><img src={Logo.src} className="TBWlogo" alt="Logo de la empresa"/></a>
                {/* Nombre comercial de la empresa*/}
                <div className="TextLogo">StreamHub</div>
                <ul className="NavLinks">
                    <li><a href="http://gui:8080/streamhub/search">Buscar</a></li>
                    <li><a href="http://gui:8080/streamhub/myList">Mi Lista</a></li>
                </ul>
                {/* Menú de idioma*/}
                <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
                {/* Iniciar sesión */}
                <div className="iniciarSesion">
                    <a className="iniciarSesion" href={`http://gui:8080/streamhub/user/client/${paramsId}`}>
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
                    <a href={`http://gui:8080/streamhub/user/client/${paramsId}`}>Mi Cuenta</a>
                </div>
            </nav>
            <div className="insert-content-container">
                <h1>Editar Perfil</h1>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" id="id" name="id" value={paramsId}/>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value={nombre} required
                               onChange={(e) => setNombre(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="apellidos">Apellidos</label>
                        <input type="text" id="apellidos" name="apellidos" value={apellidos} required
                               onChange={(e) => setApellidos(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeNacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="fechaDeNacimiento" name="fechaDeNacimiento" value={fecha_de_nacimiento}
                               required onChange={(e) => setFechaDeNacimiento(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} required
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numeroTarjetaDeCredito">Número de Tarjeta de Crédito</label>
                        <input type="text" id="numeroTarjetaDeCredito" name="numeroTarjetaDeCredito"
                               value={numero_tarjeta_de_credito}
                               required onChange={(e) => setNumeroTarjetaDeCredito(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ccv">CCV</label>
                        <input type="text" id="ccv" name="ccv" maxLength={3} value={ccv} required
                               onChange={(e) => setCcv(e.target.value)}/>
                    </div>

                    <button type="submit" className="submit-button"
                            onClick={handleClick}>Guardar
                    </button>
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
