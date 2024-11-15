// app/list/page.tsx
import React from 'react';
import '../../../../public/css/myList.css';
import DeleteFromListButton from "./DeleteFromListButton"

// Interfaz para la respuesta de cada contenido
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

// Interfaz para la respuesta que contiene solo los IDs
interface ContentListResponse {
	contenidos: number[]; // Lista de IDs de contenidos
}

// Función para obtener la lista de contenidos de un usuario
async function fetchContentList(apiUrl: string): Promise<ContentListResponse | null> {
	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			console.error("Network response was not ok", response.statusText);
			return null;
		}
		return await response.json(); // Esperamos un array de IDs
	} catch (error) {
		console.error("Fetch error:", error);
		return null;
	}
}

// Función para obtener los detalles de un contenido
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

// El componente Server Component que obtiene los datos y los pasa como props
export default async function UserListPage() {
	const userId = 1;
	const apiUrlForIds = `http://localhost:8080/StreamHub/miLista/${userId}`;
	const listResponse = await fetchContentList(apiUrlForIds);

	if (!listResponse || !listResponse.contenidos) {
		return <div>Error fetching data.</div>;
	}

	// Obtener los detalles de los contenidos a partir de los IDs
	const contentDetails: ApiResponse[] = [];
	for (const id of listResponse.contenidos) {
		const apiUrlForContent = `http://localhost:8081/StreamHub/contenidos/${id}`;
		const content = await fetchContent(apiUrlForContent);
		if (content) {
			contentDetails.push(content);
		}
	}

	// Pasamos los contenidos como props al componente
	return <UserList contentDetails={contentDetails} />;
}

// Componente de presentación que recibe los datos como props
const UserList = ({ contentDetails }: { contentDetails: ApiResponse[] }) => {
	return (
		<div className="user-list-page">
			<h1>Mi Lista</h1>
			<div className="list-container">
				{contentDetails.map((content) => (
					<div key={content.id} className="mylist-item">
						<h2>{content.titulo}</h2>
						<p className="item-description">{content.descripcion}</p>
						<div className="item-actions">
							<a href={"http://localhost:3000/streamhub/watch/" + content.id}
							   className="view-button">Ver</a>
							<DeleteFromListButton contentId={content.id} userId={1}/>
						</div>

					</div>
				))}
			</div>
		</div>
	);
};
