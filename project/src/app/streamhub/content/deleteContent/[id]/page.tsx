// app/content/[id]/page.tsx
"use client";

import React, {useState, useEffect} from 'react';
import '../../../../../../public/css/DeleteForm.css';
import '../../../../../../public/css/error.css';
import '../../../../../../public/css/Header.css';
import Footer from '../../../Footer.js';
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Bandera from "../../../../../../public/images/bandera_españa.png";
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
	url: string;
}

export default function ContentPage() {
	const {id} = useParams();
	const apiUrl = `http://contenidos:8080/StreamHub/contenidos/${id}`;

	// Estados para almacenar el contenido y el estado del borrado
	const [content, setContent] = useState<ApiResponse | null>(null);
	const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
	let userId: number = -1;

	let isTokenError = false;
	const token = localStorage.getItem('authToken');
	if (token) {
		try {
			const decodedToken = jwtDecode<JwtPayload>(token);
			console.log("Usuario: ", decodedToken.userId);
			userId = decodedToken.userId;
			if (decodedToken.role !== 'ROLE_GESTOR') {
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
				<h1>Error: Debes ser un gestor para acceder a esta página</h1>
				<div>
					<span>Por favor, accede a </span>
					<a href={"http://gui:8080/streamhub/login"}>esta página</a>
					<span> para iniciar sesión.</span>
				</div>
			</div>
		);
	}

	// useEffect para cargar el contenido cuando el componente se monta
	useEffect(() => {
		const fetchContent = async () => {
			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					console.error("Error de red:", response.statusText);
					return;
				}
				const data = await response.json();
				setContent(data);
			} catch (error) {
				console.error("Fetch error:", error);
			}
		};

		fetchContent();
	}, [apiUrl]);

	// Función para manejar la eliminación del contenido
	const handleDelete = async () => {
		try {
			const response = await fetch(apiUrl, {
				method: 'DELETE',
				headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
			});
			if (response.ok) {
				setDeleteStatus("El contenido se ha eliminado con éxito.");
				setContent(null); // Limpia el contenido después de eliminarlo
			} else {
				throw new Error("Error al eliminar el contenido.");
			}
		} catch (error) {
			console.error("Delete error:", error);
			setDeleteStatus("No se pudo eliminar el contenido. Inténtalo de nuevo.");
		}
	};

	// Mostrar mensaje mientras se carga el contenido
	if (!content && !deleteStatus) {
		return <div>Cargando contenido...</div>;
	}

	return (
		<div className="content-page">
			<nav id="header">
				{/* Logo de la empresa */}
				<a href="http://gui:8080/streamhub/search"><img src={Logo.src} className="TBWlogo"
																	  alt="Logo de la empresa"/></a>
				{/* Nombre comercial de la empresa*/}
				<div className="TextLogo">StreamHub</div>
				<ul className="NavLinks">
					<li><a href="http://gui:8080/streamhub/search">Gestionar contenido</a></li>
				</ul>
				{/* Menú de idioma*/}
				<img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
				{/* Iniciar sesión */}
				<div className="iniciarSesion">
					<a className="iniciarSesion" href={`http://gui:8080/streamhub/user/manager/${userId}`}>
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
					<a href={`http://gui:8080/streamhub/user/manager/${userId}`}>Mi Cuenta</a>
				</div>
			</nav>

			<div className="borrar">
				<div className="borrarDatos">
					<h1>¿Desea borrar este contenido?</h1>
				</div>
				{/* Muestra los datos del contenido antes de eliminar */}
				{content && (
					<ul className="datosElemento">
						<li><b>Titulo:</b> {content.titulo}</li>
						<li><b>Tipo:</b> {content.tipo}</li>
						<li><b>Año:</b> {content.production_year}</li>
					</ul>
				)}

				{/* Botón de eliminación */}
				<div className="boton_borrar">
					<button type="button" id="boton_borrar" onClick={handleDelete}>
						Eliminar contenido
					</button>
				</div>
				{deleteStatus && (
					<p className={`delete-status ${deleteStatus.includes("éxito") ? "success" : "error"}`}>{deleteStatus}</p>
				)}

			</div>
			<Footer/>
		</div>
	);
}
