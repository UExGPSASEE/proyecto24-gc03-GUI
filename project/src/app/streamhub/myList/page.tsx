"use client";

import React, { useState, useEffect } from 'react';
import '../../../../public/css/myList.css';
import '../../../../public/css/error.css';
import DeleteFromListButton from "./DeleteFromListButton";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/streamhub/login/page";
import Logo from "../../../../public/images/LogoStreamHub.png";
import Footer from "../Footer.js";
import Bandera from "../../../../public/images/bandera_españa.png";
import '../../../../public/css/Header.css';

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

const UserListPage = () => {
	const [contentDetails, setContentDetails] = useState<ApiResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	let isTokenError = false;
	let userId: number = -1;
	const token = localStorage.getItem('authToken');
	if (token) {
		try {
			const decodedToken = jwtDecode<JwtPayload>(token);
			console.log("Usuario: ", decodedToken.userId);
			userId = decodedToken.userId;
			if (decodedToken.role !== 'ROLE_CLIENTE') {
				console.error("Error en el rol del usuario");
				isTokenError = true;
			} else {
				userId = decodedToken.userId;
			}
		} catch (error) {
			isTokenError = true;
			console.error("Error decoding token:", error);
		}
	} else {
		isTokenError = true;
		console.error("Error al obtener el token.");
	}
	useEffect(() => {
		const fetchData = async () => {
			try {
				const apiUrlForIds = `http://localhost:8080/StreamHub/miLista/${userId}`;
				const listResponse = await fetch(apiUrlForIds).then((res) => res.json());

				if (!listResponse || !listResponse.contenidos) {
					setError('Error fetching content list.');
					return;
				}

				// Obtener los detalles de los contenidos a partir de los IDs
				const contentDetailsArray: ApiResponse[] = [];
				for (const id of listResponse.contenidos) {
					const apiUrlForContent = `http://localhost:8081/StreamHub/contenidos/${id}`;
					const content = await fetch(apiUrlForContent).then((res) => res.json());
					if (content) {
						contentDetailsArray.push(content);
					}
				}

				setContentDetails(contentDetailsArray);
			} catch (error) {
				setError('An error occurred while fetching data.');
				console.error('Error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (userId === -1) {
		return <div className={"error-page"}>Error con la id del usuario</div>;
	}

	if (error) {
		return <div className={"error-page"}>{error}</div>;
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


	return <UserList contentDetails={contentDetails} userId={userId} />;
};

// Componente de presentación que recibe los datos como props
const UserList = ({ contentDetails, userId }: { contentDetails: ApiResponse[], userId: number }) => {
	return (
		<div className="main">
			<nav id="header">
				{/* Logo de la empresa */}
				<a href="http://localhost:3000/streamhub/search"><img src={Logo.src} className="TBWlogo" alt="Logo de la empresa"/></a>
				{/* Nombre comercial de la empresa*/}
				<div className="TextLogo">StreamHub</div>
				<ul className="NavLinks">
					<li><a href="http://localhost:3000/streamhub/search">Buscar</a></li>
					<li><a href="http://localhost:3000/streamhub/myList">Mi Lista</a></li>
				</ul>
				{/* Menú de idioma*/}
				<img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
				{/* Iniciar sesión */}
				<div className="iniciarSesion">
					<a className="iniciarSesion" href={`http://localhost:3000/streamhub/user/client/${userId}`}>
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
					<a href={`http://localhost:3000/streamhub/user/client/${userId}`}>Mi Cuenta</a>
				</div>
			</nav>
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
								<DeleteFromListButton contentId={content.id} userId={userId}/>
							</div>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default UserListPage;
