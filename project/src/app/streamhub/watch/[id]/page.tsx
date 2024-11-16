"use client";
import React, { useEffect, useState } from 'react';
import '../../../../../public/css/watch.css';
import '../../../../../public/css/error.css';
import Footer from '../../Footer.js';
import AddToListButton from "./AddToListButton";
import LikeButton from './LikeButton';
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";
import {useParams} from "next/navigation";

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

interface VideoPageProps {
	params: { id: string };
}

const VideoPage: React.FC<VideoPageProps> = () => {
	const [content, setContent] = useState<ApiResponse | null>(null);
	const [userId, setUserId] = useState<number | null>(null);
	const { id } = useParams();
	let roleError = false;

	// Obtener el contenido y el token al cargar el componente
	useEffect(() => {
		const apiUrl = `http://localhost:8081/StreamHub/contenidos/${id}`;

		// Función para obtener contenido de la API
		async function fetchContent() {
			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					console.error("Network response was not ok", response.statusText);
					return;
				}
				const data = await response.json();
				setContent(data);
			} catch (error) {
				console.error("Fetch error:", error);
			}
		}

		// Obtener token desde localStorage y decodificar el userId
		const token = localStorage.getItem('authToken');
		if (token) {
			try {
				const decodedToken = jwtDecode<JwtPayload>(token);
				console.log("Usuario: ", decodedToken.userId);
				setUserId(decodedToken.userId);
				if (decodedToken.role !== 'ROLE_CLIENTE') {
					roleError = true;
				}
			} catch (error) {
				console.error("Error decoding token:", error);
			}
		} else {
			console.error("Error al obtener el token.");
		}

		// Llamar a la función fetchContent para obtener el contenido
		fetchContent();
	}, [id]);

	if (!content) {
		return <div className="loading-screen">
			<div className="spinner"></div>
			<p>Por favor, espera mientras cargamos el contenido...</p>
		</div>;
	}

	if (!userId) {
		return <div className={"error-page"}>
			<h1>Error: no se pudo obtener el usuario</h1>
			<div>
				<span>Por favor, accede a </span>
				<a href={"http://localhost:3000/streamhub/login"}>esta página</a>
				<span> para iniciar sesión.</span>
			</div>
		</div>;
	}

	if (roleError) {
		return <div className={"error-page"}>
			<h1>Error: debes ser un cliente para acceder a esta página</h1>
			<div>
				<span>Por favor, accede a </span>
				<a href={"http://localhost:3000/streamhub/login"}>esta página</a>
				<span> para iniciar sesión.</span>
			</div>
		</div>;
	}

	if (content.tipo === "Serie" || content.tipo === "Temporada") {
		return (
			<div className="error-page">
				<h1>Error: Tipo de contenido no válido</h1>
				<div>
					<span>No se puede visualizar un contenido de tipo "{content.tipo}". Por favor, accede a </span>
					<a href={`http://localhost:3000/streamhub/preview/${content.id}`}>esta página</a>
					<span> para ver los detalles del contenido.</span>
				</div>
			</div>
		);
	}

	const minutes = content.duracion !== null ? content.duracion / 60 : -1;

	return (
		<div>
			<div className="video-page">
				<div className="video-container">
					<div>
						{YouTubeEmbed(content.url)}
					</div>
					<div className="video-details">
						<h1>{content.titulo}</h1>
						<p className="description">{content.descripcion}</p>
						<p className="metadata">
							{minutes > -1 && <span>{minutes} minutos • </span>}
							Clasificación de edad: {content.clasificacion_edad} • Año: {content.production_year}
						</p>
						<AddToListButton contentId={content.id} userId={userId} />
						<LikeButton contentId={content.id} userId={userId} />
					</div>
				</div>
				<div className="suggested-videos">
					<h2>¿Te interesa ver otro contenido?</h2>
					<a href="http://localhost:3000/streamhub/search">Volver a la búsqueda</a>
				</div>
			</div>
			<Footer />
		</div>
	);
};

// Función para renderizar el video de YouTube
function YouTubeEmbed(url: string) {
	const videoId = url.split("v=")[1]?.split("&")[0];
	return (
		<div>
			<iframe
				className="video-player"
				src={`https://www.youtube.com/embed/${videoId}`}
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		</div>
	);
}

export default VideoPage;
