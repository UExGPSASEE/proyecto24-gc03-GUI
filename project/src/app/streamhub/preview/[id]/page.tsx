"use client";

import React, {useState, useEffect} from 'react';
import '../../../../../public/css/preview.css';
import '../../../../../public/css/error.css';
import Footer from '../../Footer.js';
import ChildList from './ChildList';
import {useParams} from "next/navigation";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";

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
}

// Función para obtener el contenido por ID
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

// Componente principal para la página de visualización de contenido
export default function ContentPage() {
	const [content, setContent] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const {id} = useParams();
	const apiUrl = `http://localhost:8081/StreamHub/contenidos/${id}`;


	// Efecto para cargar el contenido al montar el componente
	useEffect(() => {
		const loadContent = async () => {
			const data = await fetchContent(apiUrl);
			setContent(data);
			setLoading(false);
		};
		loadContent();
	}, [apiUrl]);

	let isTokenError = false;
	const token = localStorage.getItem('authToken');
	if (token) {
		try {
			const decodedToken = jwtDecode<JwtPayload>(token);
			console.log("Usuario: ", decodedToken.userId);
			if (decodedToken.role !== 'ROLE_CLIENTE') {
				console.error("Error en el rol del usuario");
				isTokenError = true;
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
				<h1>Error: Debes ser un cliente para acceder a esta página</h1>
				<div>
					<span>Por favor, accede a </span>
					<a href={"http://localhost:3000/streamhub/login"}>esta página</a>
					<span> para iniciar sesión.</span>
				</div>
			</div>
		);
	}
	// Mostrar un mensaje de carga mientras los datos están siendo cargados
	if (loading) {
		return <div>Cargando...</div>;
	}

	// Comprobar si el contenido es nulo o vacío
	if (!content) {
		return <div>No hay datos de contenido disponibles.</div>;
	}

	// Comprobar el tipo de contenido
	if (content.tipo !== "Serie" && content.tipo !== "Temporada") {
		return (
			<div className="error-page">
				<h1>Error: Tipo de contenido no válido</h1>
				<div>
					<span>No se pueden ver detalles de un contenido de tipo "{content.tipo}".
					Por favor, accede a </span>
					<a href={`http://localhost:3000/streamhub/watch/${id}`}>esta página</a>
					<span> para visualizar el contenido.</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="content-page">
				{/* Sección del título */}
				<h1>{content.titulo}</h1>

				{/* Atributos del contenido */}
				<p><strong>Año:</strong> {content.production_year}</p>
				<p><strong>Clasificación de edad:</strong> {content.clasificacion_edad}</p>
				<p><strong>Descripción:</strong> {content.descripcion}</p>
				<p>
					<strong>
						{content.tipo === "Serie" ? "Número de temporadas" : "Número de episodios"}:
					</strong>{" "}
					{content.numero_elementos}
				</p>

				{/* Sección de contenido secundario */}
				<ChildList content={content}/>
			</div>
			<Footer/>
		</div>
	);
}
