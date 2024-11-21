"use client";

import React, { useState } from 'react';
import '../../../../public/css/search.css';
import '../../../../public/css/error.css';
import TagList, {Etiqueta} from './TagList';
import Footer from '../Footer.js';
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page"; // Import the Footer component

interface Content {
	id: number;
	tipo: string;
	titulo: string;
	production_year: number;
	clasificacion_edad: string;
	descripcion: string;
	pertenece_a: number | null;
	numero_elementos: number | null;
	duracion: number | null;
	url: string;
	etiqueta_ids: number[];
}

export default function SearchPage() {
	const [searchText, setSearchText] = useState<string>('');
	const [results, setResults] = useState<Content[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	let searchUrl: string = "http://localhost:8081/StreamHub/contenidos";
	let isTokenError = false;
	let isGestor = false;
	const token = localStorage.getItem('authToken');
	if (token) {
		try {
			const decodedToken = jwtDecode<JwtPayload>(token);
			console.log("Usuario: ", decodedToken.userId);
			if (decodedToken.role !== 'ROLE_CLIENTE' && decodedToken.role !== 'ROLE_GESTOR') {
				console.error("Error en el rol del usuario");
				isTokenError = true;
			} else {
				isGestor = decodedToken.role === 'ROLE_GESTOR';
			}
		} catch (error) {
			isTokenError = true;
			console.error("Error decoding token:", error);
		}
	} else {
		isTokenError = true;
		console.error("Error al obtener el token.");
	}

	if (isTokenError) {
		return (
			<div className="error-page">
				<h1>Error: Debes ser un cliente o un gestor para acceder a esta página</h1>
				<div>
					<span>Por favor, accede a </span>
					<a href={"http://localhost:3000/streamhub/login"}>esta página</a>
					<span> para iniciar sesión.</span>
				</div>
			</div>
		);
	}

	// Función para manejar selección y deselección de etiquetas
	const handleTagClick = (tagName: string) => {
		setSelectedTags((prevTags) =>
			prevTags.includes(tagName)
				? prevTags.filter((tag) => tag !== tagName) // Elimina si ya está seleccionada
				: [...prevTags, tagName] // Añade si no está seleccionada
		);
	};

	const handleEtiquetasLoaded = (etiquetas: Etiqueta[]) => {
		const selectedEtiquetas = etiquetas.filter((etiqueta) => selectedTags.includes(etiqueta.nombre));

		// Si hay etiquetas seleccionadas, actualizamos la searchUrl con los parámetros correspondientes
		if (selectedEtiquetas.length > 0) {
			const etiquetasIds = selectedEtiquetas.map((etiqueta) => etiqueta.id_etiqueta);
			const etiquetasQuery = etiquetasIds.map((id) => `etiquetas=${id}`).join('&');
			searchUrl = `http://localhost:8081/StreamHub/contenidos/etiquetas?${etiquetasQuery}`;
		} else {
			// Si no hay etiquetas seleccionadas, mantenemos la URL original
			searchUrl = "http://localhost:8081/StreamHub/contenidos";
		}
	};


	const handleSearch = async () => {
		try {
			const response = await fetch(searchUrl);
			if (!response.ok) {
				throw new Error("Error fetching data");
			}
			let filteredResults: Content[] = [];
			if (response.status === 200) {
				const data: Content[] = await response.json();
				// Filtrar el array para obtener solo los contenidos cuyo título contenga el texto de búsqueda
				filteredResults = data.filter((content) =>
					content.titulo.toLowerCase().includes(searchText.toLowerCase())
				);
			}
			setResults(filteredResults);
		} catch (error) {
			console.error("Error fetching or filtering contents:", error);
		}
	};

	return (
        <div className="main">
            <div className="search-page">
                <h1>Busca algo que ver hoy</h1>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Escribe aquí el título..."
                        className="search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} // Actualizar el texto de búsqueda
                    />
                    <button className="search-button" onClick={handleSearch}>Buscar</button>
                </div>

				{isGestor && (
					<div className="gestor-actions">
						<a href={`http://localhost:3000/streamhub/content/createContent/`} className="create-content">Añade un contenido</a>
					</div>
				)}

                <TagList
                    selectedTags={selectedTags}
                    onTagClick={handleTagClick}
                    onEtiquetasLoaded={handleEtiquetasLoaded}
                />

                <div className="results-section">
                    <h2>Resultados de búsqueda ({results.length})</h2>
                    {results.length === 0 ? (
                        <p>Cambia tus términos de búsqueda y haz clic en "Buscar"</p>
                    ) : (
                        <ul className="results-list">
                            {results.map((content) => {
                                // Determinar URL de enlace según el tipo de contenido
                                const linkUrl = content.tipo === "Serie" || content.tipo === "Temporada"
                                    ? `http://localhost:3000/streamhub/preview/${content.id}`
                                    : `http://localhost:3000/streamhub/watch/${content.id}`;

                                return (
                                    <li key={content.id} className="result-item">
										<span className={"general-options"}>
                                        <a href={linkUrl} rel="noopener noreferrer">
                                            <h3>{content.titulo}</h3>
                                        </a>
                                        <p>{content.descripcion}</p>
                                        <p><strong>Año:</strong> {content.production_year}</p>
                                        <p><strong>Clasificación de edad:</strong> {content.clasificacion_edad}</p>
										</span>
										{isGestor && (
											<div className="gestor-actions">
												<a href={`http://localhost:3000/streamhub/content/updateContent/${content.id}`} className="edit-link">Editar</a>
												<a href={`http://localhost:3000/streamhub/content/deleteContent/${content.id}`} className="delete-link">Borrar</a>
											</div>
										)}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
            <Footer />
        </div>
	);
}
