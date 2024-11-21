"use client";

import React, {useState} from 'react';
import '../../../../../../public/css/search.css';
import '../../../../../../public/css/error.css';
import Footer from '../../../Footer.js';
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";

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

    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const decodedToken = jwtDecode<JwtPayload>(token);
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