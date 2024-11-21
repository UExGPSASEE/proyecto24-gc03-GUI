"use client";

import React, { useState } from "react";
import {useRouter} from "next/navigation";
import '../../../../../../public/css/UpdateUser.css'; // Importa el archivo CSS
import '../../../../../../public/css/Header.css';
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Footer from '../../../Footer.js';
import Bandera from "../../../../../../public/images/bandera_españa.png";

export default function CreateUser() {
    const [tipoUsuario, setTipoUsuario] = useState("ADMINISTRADOR"); // ADMINISTRADOR o GESTOR
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [fechaDeNacimiento, setFechaDeNacimiento] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        if (!token) {
            setMessage({ type: "error", text: "No se encontró el token de autenticación" });
            return;
        }

        const userData = {
            tipo: tipoUsuario,
            nombre,
            apellidos,
            fecha_de_nacimiento: fechaDeNacimiento,
            email,
            password,
        };

        try {
            const response = await fetch(`http://localhost:8082/StreamHub/${tipoUsuario.toLowerCase()}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setMessage({ type: "success", text: `${tipoUsuario} creado exitosamente` });
                router.push("http://localhost:3000/streamhub/user/admin/manageUsers"); // Cambia esta ruta si es necesario
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
                <a href="/"><img src={Logo.src} className="TBWlogo" alt="Logo de la empresa" /></a>
                <div className="TextLogo">StreamHub</div>
                <ul className="NavLinks">
                    <li><a href="http://localhost:3000/streamhub/search">Buscar</a></li>
                    <li><a href="http://localhost:3000/streamhub/myList">Mi Lista</a></li>
                </ul>
                <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma" />
            </nav>

            <div className="update-user-container">
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

            <Footer />
        </div>
    );
}
