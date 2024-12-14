"use client";

import React, {useState, useEffect} from 'react';
import '../../../../../public/css/preview.css';
import '../../../../../public/css/error.css';
import Footer from '../../Footer.js';
import ChildList from './ChildList';
import {useParams} from "next/navigation";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";
import Logo from "../../../../../public/images/LogoStreamHub.png";
import Bandera from "../../../../../public/images/bandera_españa.png";
import '../../../../../public/css/Header.css';

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
	const apiUrl = `http://contenidos:8080/StreamHub/contenidos/${id}`;
	let userId: number = -1;

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
			userId = decodedToken.userId;
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
					<a href={"http://gui:8080/streamhub/login"}>esta página</a>
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
					<a href={`http://gui:8080/streamhub/watch/${id}`}>esta página</a>
					<span> para visualizar el contenido.</span>
				</div>
			</div>
		);
	}

	return (
		<div>
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
					<a className="iniciarSesion" href={`http://gui:8080/streamhub/user/client/${userId}`}>
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
					<a href={`http://gui:8080/streamhub/user/client/${userId}`}>Mi Cuenta</a>
				</div>
			</nav>

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
