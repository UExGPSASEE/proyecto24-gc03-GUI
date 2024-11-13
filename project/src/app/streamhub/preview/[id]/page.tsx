// app/content/[id]/page.tsx
import React from 'react';
import './preview.css';
import '../../error.css';

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

// Function to fetch content by ID
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

// Main function component for the content presentation page
export default async function ContentPage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const apiUrl = `http://localhost:8081/StreamHub/contenidos/${params.id}`;
	const content = await fetchContent(apiUrl);

	if (!content) {
		return <div>No content data available</div>; // Display if data is unavailable
	}

	// Check the tipo attribute for valid values
	if (content.tipo !== "Serie" && content.tipo !== "Temporada") {
		return (
			<div className="error-page">
				<h1>Error: Tipo de contenido no válido</h1>
				<div>
					<span>No se pueden ver detalles de un contenido de tipo "{content.tipo}".
					Por favor, accede a </span>
					<a href={`http://localhost:3000/streamhub/watch/${params.id}`}>esta página</a>
					<span> para visualizar el contenido.</span>
				</div>
			</div>
		); // Render error message for invalid types
	}

	// Calculate duration in minutes if available
	const minutes = content.duracion !== null ? Math.floor(content.duracion / 60) : -1;

	return (
		<div className="content-page">
			{/* Title Section */}
			<h1>{content.titulo}</h1>

			{/* Attributes */}
			<p><strong>Año:</strong> {content.production_year}</p>
			<p><strong>Clasificación de edad:</strong> {content.clasificacion_edad}</p>
			<p><strong>Descripción:</strong> {content.descripcion}</p>
			<p>
				<strong>
					{content.tipo === "Serie" ? "Número de temporadas" : "Número de episodios"}:
				</strong>{" "}
				{content.numero_elementos}
			</p>

			{/* Child Content Section */}
			<div className="child-content">
				<h2>{content.tipo === "Serie" ? "Temporadas" : "Episodios"}</h2>
				<ul>
					<li>Child Content 1</li>
					<li>Child Content 2</li>
					<li>Child Content 3</li>
				</ul>
			</div>
		</div>
	);
}
