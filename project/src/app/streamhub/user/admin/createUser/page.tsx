"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import '../../../../../../public/css/UpdateUser.css'; // Importa el archivo CSS
import '../../../../../../public/css/Header.css';
import '../../../../../../public/css/error.css';
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Footer from '../../../Footer.js';
import Bandera from "../../../../../../public/images/bandera_españa.png";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";

export default function CreateUser() {
    const [tipoUsuario, setTipoUsuario] = useState("ADMINISTRADOR"); // ADMINISTRADOR o GESTOR
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [fechaDeNacimiento, setFechaDeNacimiento] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [isTokenError, setIsTokenError] = useState(false);
    const [userId, setUserId] = useState(-1);

    useEffect(() => {
        const fetchData = async () => {
            if (storedToken) {
                try {
                    const decodedToken = jwtDecode<JwtPayload>(storedToken);
                    setUserId(decodedToken.userId);
                }catch (error) {
                    console.error("Error al procesar el token o al obtener los datos:", error);
                    setIsTokenError(true);
                }
            }else {
                console.error("Token no encontrado en el almacenamiento local.");
                setIsTokenError(true);
            }

        }
        const storedToken = localStorage.getItem("authToken");
        setToken(storedToken);

        fetchData();
    }, []);

    if (isTokenError) {
        return (
            <div className="error-page">
                <h1>Error: No tienes autorización para realizar esta acción</h1>
                <p>
                    Por favor, <a href="http://gui:8080/streamhub/login">inicia sesión</a> con un usuario autorizado.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            tipo: tipoUsuario,
            nombre,
            apellidos,
            fecha_de_nacimiento: fechaDeNacimiento,
            email,
            password,
        };

        try {
            const response = await fetch(`${Config.USUARIOS_URL}/StreamHub/${tipoUsuario.toLowerCase()}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setMessage({ type: "success", text: `${tipoUsuario} creado exitosamente` });
                router.push("http://gui:8080/streamhub/user/admin/manageUsers"); // Cambia esta ruta si es necesario
            } else {
                const errorMessage = await response.text();
                setMessage({
                    type: "error",
                    text: `Error al crear el usuario: ${errorMessage || "Error desconocido"}`,
                });
            }
        } catch (error) {
            console.error("Error al hacer la petición:", error);
            setMessage({ type: "error", text: "Hubo un error al enviar la solicitud" });
        }
    };

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
                    <a className="iniciarSesion" href={`http://gui:8080/streamhub/user/admin/${userId}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                </div>
                <div className="miCuenta">
                    <a href={`http://gui:8080/streamhub/user/admin/${userId}`}>Mi Cuenta</a>
                </div>
            </nav>

            <div className="insert-content-container">
                <h1>Crear Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tipoUsuario">Tipo de Usuario</label>
                        <select
                            id="tipoUsuario"
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                        >
                            <option value="ADMINISTRADOR">Administrador</option>
                            <option value="GESTOR">Gestor</option>
                        </select>
                    </div>

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
                        <label htmlFor="fechaDeNacimiento">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            id="fechaDeNacimiento"
                            name="fechaDeNacimiento"
                            value={fechaDeNacimiento}
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

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submit-button">Crear Usuario</button>
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
