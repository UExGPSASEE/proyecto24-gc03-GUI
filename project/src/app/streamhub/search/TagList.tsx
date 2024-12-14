// components/TagList.tsx
"use client";

import React, { useEffect, useState } from 'react';
import '../../../../public/css/search.css';

export interface Etiqueta {
	nombre: string;
	id_etiqueta: number;
}

interface TagListProps {
	onEtiquetasLoaded: (etiquetas: Etiqueta[]) => void;
	selectedTags: string[];
	onTagClick: (tagName: string) => void;
}

const TagList: React.FC<TagListProps> = ({ onEtiquetasLoaded, selectedTags, onTagClick }) => {
	const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

	useEffect(() => {
		const fetchEtiquetas = async () => {
			try {
				const response = await fetch('http://funcionalidades_extra:8080/StreamHub/etiquetas');
				if (response.ok) {
					const data = await response.json();
					setEtiquetas(data);
					onEtiquetasLoaded(data); // Envía las etiquetas a SearchPage
				} else {
					console.error("Error al obtener las etiquetas:", response.statusText);
				}
			} catch (error) {
				console.error("Error en la solicitud de etiquetas:", error);
			}
		};

		fetchEtiquetas();
	}, [onEtiquetasLoaded]);

	return (
		<div className="tag-selection">
			<h2>Añade etiquetas</h2>
			<div className="tag-options">
				{etiquetas.map((etiqueta) => (
					<span
						key={etiqueta.id_etiqueta}
						className={`tag ${selectedTags.includes(etiqueta.nombre) ? 'selected' : ''}`}
						onClick={() => onTagClick(etiqueta.nombre)}
					>
                        {etiqueta.nombre}
                    </span>
				))}
			</div>
		</div>
	);
};

export default TagList;
