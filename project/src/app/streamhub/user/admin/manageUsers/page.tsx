"use client";

import React, {useState} from 'react';
import '../../../../../../public/css/search.css';
import '../../../../../../public/css/error.css';
import '../../../../../../public/css/Header.css';
import Footer from '../../../Footer.js';
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Bandera from "../../../../../../public/images/bandera_españa.png";

interface User {
    id: number;
    nombre: string;
    email: string;
    rol: string;
}

export default function UserManagementPage() {
    const [searchText, setSearchText] = useState<string>('');
    const [managers, setManagers] = useState<User[]>([]);
    let isTokenError = false;
    let userId;

    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            userId = decodedToken.userId;
            if (decodedToken.role !== 'ROLE_ADMINISTRADOR') {
                console.error("Error: Usuario no autorizado para esta página");
                isTokenError = true;
            }
        } catch (error) {
            isTokenError = true;
            console.error("Error decoding token:", error);
        }
    } else {
        isTokenError = true;
        console.error("Error: Token no encontrado.");
    }

    if (isTokenError) {
        return (
            <div className="error-page">
                <h1>Error: No tienes autorización para acceder a esta página</h1>
                <div>
                    <span>Por favor, accede a </span>
                    <a href={"http://localhost:3000/streamhub/login"}>esta página</a>
                    <span> para iniciar sesión.</span>
                </div>
            </div>
        );
    }

    const fetchUsers = async () => {
        try {
            const managersResponse = await fetch("http://localhost:8082/StreamHub/gestores", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (managersResponse.ok) {
                const managersData: User[] = await managersResponse.json();

                // Filtrar por texto de búsqueda
                const filteredManagers = managersData.filter((user) =>
                    user.nombre.toLowerCase().includes(searchText.toLowerCase())
                );
                setManagers(filteredManagers);
            } else {
                console.error("Error fetching managers data:", managersResponse.status, managersResponse.statusText);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <div className="main">
            <nav id="header">
                <a href="http://localhost:3000/streamhub/search"><img src={Logo.src} className="TBWlogo"
                                                                      alt="Logo de la empresa"/></a>
                <div className="TextLogo">StreamHub</div>
                <ul className="NavLinks">
                    <li><a href="http://localhost:3000/streamhub/user/admin/manageUsers">Gestión de Usuarios</a></li>
                </ul>
                <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
                <div className="iniciarSesion">
                    <a className="iniciarSesion" href={`http://localhost:3000/streamhub/user/admin/${userId}`}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                                style={{fill: "white"}}
                            />
                        </svg>
                    </a>
                </div>
                <div className="miCuenta">
                    <a href={`http://localhost:3000/streamhub/user/admin/${userId}`}>Mi Cuenta</a>
                </div>
            </nav>

            <div className="search-page">
                <h1>Gestión de Usuarios</h1>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Escribe aquí el nombre de usuario..."
                        className="search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} // Actualizar el texto de búsqueda
                    />
                    <button className="search-button" onClick={fetchUsers}>Buscar</button>
                </div>

                <div className="gestor-actions">
                    <a href={`http://localhost:3000/streamhub/user/admin/createUser/`} className="create-content">Añade
                        un usuario</a>
                </div>

                {/* Gestores */}
                <div className="results-section">
                    <h2>Gestores ({managers.length})</h2>
                    {managers.length === 0 ? (
                        <p>No se encontraron gestores.</p>
                    ) : (
                        <ul className="results-list">
                            {managers.map((user) => (
                                <li key={user.id} className="result-item">
                                    <span className={"general-options"}>
                                        <h3>Nombre: {user.nombre}</h3>
                                        <p><strong>Email:</strong> {user.email}</p>
                                    </span>
                                    <div className="gestor-actions">
                                        <a href={`http://localhost:3000/streamhub/user/manager/updateUser/${user.id}`}
                                           className="edit-link">Editar</a>
                                        <a href={`http://localhost:3000/streamhub/user/manager/deleteUser/${user.id}`}
                                           className="delete-link">Borrar</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}