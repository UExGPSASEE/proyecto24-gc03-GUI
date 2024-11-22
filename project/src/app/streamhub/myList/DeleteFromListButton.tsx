/*
async function DeleteFromList(contentId: number, userId: number): Promise<void> {
	try {
		const response = await fetch(`http://localhost:8080/StreamHub/miLista/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contenidos: [contentId], // Agregar el ID del contenido al array
			}),
		});

		if (response.status === 400) {
			console.log("Ya has añadido el contenido a tu lista.");
		} else if (!response.ok) {
			throw new Error('Error al agregar contenido a mi lista');
		}

		alert('Contenido agregado a tu lista');
	} catch (error) {
		console.error('Error:', error);
		alert('No se pudo agregar el contenido a la lista');
	}
}
* */

'use client';

import React from 'react';
import '../../../../public/css/myList.css';

interface DeleteFromListButtonProps {
	contentId: number;
	userId: number;
}

const DeleteFromListButton: React.FC<DeleteFromListButtonProps> = ({ contentId, userId }) => {

	const toggleListStatus = async () => {
		try {
			let response = null;

			response = await fetch(`http://localhost:8080/StreamHub/miLista/${userId}/${contentId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (response.status === 404) {
				alert("El contenido no pertenece a tu lista.");
			} else if (!response.ok) {
				throw new Error('Error al borrar el contenido de mi lista');
			} else {
				alert("Se ha borrado el contenido de la lista.");
			}

		} catch (error) {
			console.error("Error updating list status:", error);
		}
	};

	return (
		<button className="remove-button" onClick={toggleListStatus}>Eliminar</button>
	);
};

export default DeleteFromListButton;
