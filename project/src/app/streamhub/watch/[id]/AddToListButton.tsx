/*
async function addToList(contentId: number, userId: number): Promise<void> {
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
import './watch.css';

interface AddToListButtonProps {
	contentId: number;
	userId: number;
}

const AddToListButton: React.FC<AddToListButtonProps> = ({ contentId, userId }) => {

	const toggleListStatus = async () => {
		try {
			let response = null;

			response = await fetch(`http://localhost:8080/StreamHub/miLista/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ contenidos: [contentId] }),
			});

			if (response.status === 400) {
				alert("Ya has añadido el contenido a tu lista.");
			} else if (!response.ok) {
				throw new Error('Error al agregar contenido a mi lista');
			} else {
				alert("Se ha añadido el contenido a la lista.");
			}

		} catch (error) {
			console.error("Error updating list status:", error);
		}
	};

	return (
		<div className="add-to-list-container">
			<button className="add-to-list-button" onClick={toggleListStatus}>
				Añadir a mi lista
			</button>
		</div>
	);
};

export default AddToListButton;
