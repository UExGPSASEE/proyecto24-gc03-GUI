// app/video/[id]/page.tsx
import React from 'react';
import '../../../../../public/css/watch.css';
import '../../../../../public/css/error.css';

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

// This component will be server-side rendered by default
export default async function VideoPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const apiUrl = `http://localhost:8080/StreamHub/contenidos/${params.id}`;
    const content = await fetchContent(apiUrl);

    if (!content) {
		return <div>No video data available</div>; // Handle empty data
	}

	// Check the tipo attribute for valid values
	if (content.tipo === "Serie" || content.tipo === "Temporada") {
		return (
			<div className="error-page">
				<h1>Error: Tipo de contenido no válido</h1>
				<div>
					<span>No se puede visualizar un contenido de tipo "{content.tipo}".
					Por favor, accede a </span>
					<a href={`http://localhost:3000/preview/${params.id}`}>esta página</a>
					<span> para ver los detalles del contenido.</span>
				</div>
			</div>
		); // Render error message for invalid types
	}

	let minutes = -1;
	if (content.duracion !== null) {
		minutes = content.duracion / 60;
	}

    return (
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
				</div>
			</div>
			<div className="suggested-videos">
				<h2>También te podría gustar</h2>
				<ul>
					<li>Suggested video 1</li>
					<li>Suggested video 2</li>
					<li>Suggested video 3</li>
					<li>Suggested video 4</li>
				</ul>
			</div>
		</div>
	);
}
