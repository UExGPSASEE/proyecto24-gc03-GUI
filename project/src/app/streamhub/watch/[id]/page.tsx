'use client';

import React from 'react';
import '../../../../../public/css/watch.css';
import '../../../../../public/css/error.css';
import Footer from '../../Footer.js'
import AddToListButton from "./AddToListButton";
import LikeButton from './LikeButton';
import {JwtPayload} from "@/app/streamhub/login/page";
import {jwtDecode} from "jwt-decode";

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
	params: Promise<{ id: string }>;
}

const VideoPage: React.FC<VideoPageProps> = async ({ params }) => {
	const { id } = await params;
	const apiUrl = `http://localhost:8081/StreamHub/contenidos/${id}`;
	const content = await fetchContent(apiUrl);
	const token = localStorage.getItem('authToken');
	const decodedToken = token  ?  jwtDecode<JwtPayload>(token) : null;
	const userId = decodedToken.userId;

	if (!content) {
		return <div>No video data available</div>;
	}

	if (content.tipo === "Serie" || content.tipo === "Temporada") {
		return (
			<div className="error-page">
				<h1>Error: Tipo de contenido no válido</h1>
				<div>
                    <span>No se puede visualizar un contenido de tipo "{content.tipo}".
                    Por favor, accede a </span>
					<a href={`http://localhost:3000/streamhub/preview/${content.id}`}>esta página</a>
					<span> para ver los detalles del contenido.</span>
				</div>
			</div>
		);
	}

	let minutes = -1;
	if (content.duracion !== null) {
		minutes = content.duracion / 60;
	}

	return (
        <div>
            <div className="video-page">
                <div className="video-container">
                    <div>
                        {YouTubeEmbed(content.url)} {/* Use the URL from the fetched data */}
                    </div>
                    <div className="video-details">
                        <h1>{content.titulo}</h1> {/* Use the title from the fetched data */}
                        <p className="description">
                            {content.descripcion} {/* Use the description from the fetched data */}
                        </p>
                        <p className="metadata">{minutes > -1 && (<span>{minutes} minutos • </span>)}
                            Clasificación de edad: {content.clasificacion_edad} • Año: {content.production_year}</p>
                        {/* Cuando integremos en esta parte de la aplicación JWT, el userId se obtendrá de él*/}
                        <AddToListButton contentId={content.id} userId={userId}/>
                        {/* Cuando integremos en esta parte de la aplicación JWT, el userId se obtendrá de él*/}
                        <LikeButton contentId={content.id} userId={userId}/>
                    </div>
                </div>
                <div className="suggested-videos">
                    <h2>¿Te interesa ver otro contenido?</h2>
					<a href="http://localhost:3000/streamhub/search"> Volver a la búsqueda </a>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

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

function YouTubeEmbed(url: string) {
	const videoId = url.split("v=")[1].split("&")[0];
	return (
		<div>
			<iframe className={"video-player"}
					src={`https://www.youtube.com/embed/${videoId}`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
			></iframe>
		</div>
	);
}

export default VideoPage;