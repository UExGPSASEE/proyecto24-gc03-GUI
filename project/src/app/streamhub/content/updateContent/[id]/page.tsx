"use client";

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import '../../../../../../public/css/InsertContent.css';
import '../../../../../../public/css/error.css';
import '../../../../../../public/css/Header.css';
import Logo from "../../../../../../public/images/LogoStreamHub.png";
import Footer from "../../../Footer.js";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";
import Bandera from "../../../../../../public/images/bandera_españa.png";

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

function UpdateContent() {
	const [tipo, setTipo] = useState('');
	const [titulo, setTitulo] = useState('');
	const [productionYear, setProductionYear] = useState<number | undefined>(undefined);
	const [clasificacionEdad, setClasificacionEdad] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [perteneceA, setPerteneceA] = useState<number | undefined>(undefined);
	const [numeroElementos, setNumeroElementos] = useState<number | undefined>(undefined);
	const [duracion, setDuracion] = useState<number | undefined>(undefined);
	const [url, setUrl] = useState('');
	const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
	const { id } = useParams();
	let userId: number = -1;
	const currentYear = new Date().getFullYear();

	useEffect(() => {
		if (id && !isNaN(Number(id))) {
			fetchContent(Number(id)); // Llama a fetchContent cuando haya un ID válido
		}
	}, [id]);

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
					<a href={"http://localhost:3000/streamhub/login"}>esta página</a>
					<span> para iniciar sesión.</span>
				</div>
			</div>
		);
	}

	async function fetchContent(contentId: number) {
		const apiUrl = `http://localhost:8081/StreamHub/contenidos/${contentId}`;
		try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
				console.error("Network response was not ok", response.statusText);
				setMessage({type: 'error', text: 'Error al obtener los datos del contenido.'});
				return;
			}
			const data: ApiResponse = await response.json();
			setTipo(data.tipo);
			setTitulo(data.titulo);
			setProductionYear(data.production_year);
			setClasificacionEdad(data.clasificacion_edad);
			setDescripcion(data.descripcion);
			setPerteneceA(data.pertenece_a);
			setNumeroElementos(data.numero_elementos);
			if (data.duracion === null) {
				setDuracion(0);
			} else {
				setDuracion(data.duracion / 60);
			}
			setUrl(data.url);
		} catch (error) {
			console.error("Fetch error:", error);
			setMessage({type: 'error', text: 'Error al cargar los datos del contenido.'});
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!id) {
			setMessage({type: 'error', text: 'Por favor, ingresa un ID válido para actualizar el contenido.'});
			return;
		}

		if (productionYear && (productionYear < 1895 || productionYear > currentYear)) {
			setMessage({type: 'error', text: `El año de producción debe estar entre 1895 y ${currentYear}.`});
			return;
		}

		if (duracion && duracion < 0) {
			setMessage({type: 'error', text: 'La duración no puede ser negativa.'});
			return;
		}

		const contentData = {
			tipo,
			titulo,
			production_year: productionYear ?? null,
			clasificacion_edad: clasificacionEdad,
			descripcion,
			pertenece_a: perteneceA ?? null,
			numero_elementos: numeroElementos ?? null,
			duracion: duracion ?? null,
			url
		};

		try {
			if (contentData.duracion != null) contentData.duracion *= 60;
			const response = await fetch(`http://localhost:8081/StreamHub/contenidos/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(contentData)
			});

			if (response.ok) {
				setMessage({type: 'success', text: 'Contenido actualizado exitosamente'});
			} else {
				const errorMessage = await response.text();
				setMessage({
					type: 'error',
					text: `Error al actualizar contenido: ${errorMessage || 'Error desconocido'}`
				});
			}
		} catch (error) {
			console.error('Error al hacer la petición:', error);
			setMessage({type: 'error', text: 'Hubo un error al enviar la solicitud.'});
		}
	};

	const isSeriesOrSeason = tipo === 'Serie' || tipo === 'Temporada';
	const isSeasonOrEpisode = tipo === 'Temporada' || tipo === 'Episodio';

	return (
		<div className="main">
			<nav id="header">
				{/* Logo de la empresa */}
				<a href="http://localhost:3000/streamhub/search"><img src={Logo.src} className="TBWlogo"
																	  alt="Logo de la empresa"/></a>
				{/* Nombre comercial de la empresa*/}
				<div className="TextLogo">StreamHub</div>
				<ul className="NavLinks">
					<li><a href="http://localhost:3000/streamhub/search">Gestionar contenido</a></li>
				</ul>
				{/* Menú de idioma*/}
				<img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
				{/* Iniciar sesión */}
				<div className="iniciarSesion">
					<a className="iniciarSesion" href={`http://localhost:3000/streamhub/user/manager/${userId}`}>
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
					<a href={`http://localhost:3000/streamhub/user/manager/${userId}`}>Mi Cuenta</a>
				</div>
			</nav>

			<div className="insert-content-container">
				<h1>Editar Contenido</h1>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="id">ID del Contenido</label>
						<input
							type="number"
							id="id"
							value={id || ''}
							required
							disabled
						/>
					</div>

					<div className="form-group">
						<label htmlFor="tipo">Tipo de Contenido</label>
						<select
							id="tipo"
							value={tipo}
							onChange={(e) => setTipo(e.target.value)}
							required
						>
							<option value="">Selecciona un tipo</option>
							<option value="Pelicula">Pelicula</option>
							<option value="Serie">Serie</option>
							<option value="Temporada">Temporada</option>
							<option value="Episodio">Episodio</option>
							<option value="Documental">Documental</option>
							<option value="Corto">Corto</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="titulo">Título</label>
						<input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)}
							   required/>
					</div>

					<div className="form-group">
						<label htmlFor="productionYear">Año de Producción</label>
						<input
							type="number"
							id="productionYear"
							value={productionYear || ''}
							onChange={(e) => setProductionYear(e.target.value ? Number(e.target.value) : undefined)}
							min="1895"
							max={currentYear}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="clasificacionEdad">Clasificación de Edad</label>
						<input
							type="text"
							id="clasificacionEdad"
							value={clasificacionEdad}
							onChange={(e) => setClasificacionEdad(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="descripcion">Descripción</label>
						<textarea
							id="descripcion"
							value={descripcion}
							onChange={(e) => setDescripcion(e.target.value)}
							required
						/>
					</div>

					{isSeasonOrEpisode && (
						<div className="form-group">
							<label htmlFor="perteneceA">Pertenece a</label>
							<input
								type="number"
								id="perteneceA"
								value={perteneceA || ''}
								onChange={(e) => setPerteneceA(e.target.value ? Number(e.target.value) : undefined)}
							/>
						</div>
					)}

					{isSeriesOrSeason && (
						<div className="form-group">
							<label htmlFor="numeroElementos">Número de Elementos</label>
							<input
								type="number"
								id="numeroElementos"
								value={numeroElementos || ''}
								onChange={(e) => setNumeroElementos(e.target.value ? Number(e.target.value) : undefined)}
							/>
						</div>
					)}

					<div className="form-group">
						<label htmlFor="duracion">Duración (min)</label>
						<input
							type="number"
							id="duracion"
							value={duracion || ''}
							onChange={(e) => setDuracion(e.target.value ? Number(e.target.value) : undefined)}
							min="0"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="url">URL</label>
						<input
							type="url"
							id="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							required
						/>
					</div>

					<button type="submit" className="submit-button">Actualizar Contenido</button>
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

export default UpdateContent;
