"use client";
import React, {useState, useEffect} from 'react';

import '../../../../../public/css/childContent.css';

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

interface ChildListProps {
    content: ApiResponse;
}

const ChildList: React.FC<ChildListProps> = ({content}) => {
    const [children, setChildren] = useState<ApiResponse[] | null>(null);
    let urlToContent = 'http://localhost:3000/streamhub/';

    useEffect(() => {
        const fetchContentArray = async (apiUrl: string): Promise<ApiResponse[] | null> => {
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
        };

        const fetchChildren = async () => {
            let childrenApiUrl = "http://localhost:8081/StreamHub/contenidos/tipo/";

            if (content.tipo === "Serie") {
                childrenApiUrl += "Temporada";
            } else if (content.tipo === "Temporada") {
                childrenApiUrl += "Episodio";
            }

            let childrenData = await fetchContentArray(childrenApiUrl);
            console.log(childrenData);

            if (childrenData !== null) {
                childrenData = childrenData.filter((child) => child.pertenece_a === content.id);
            }
            console.log(urlToContent);

            setChildren(childrenData);
        };

        fetchChildren();
    }, [content]);

    const tipo = content.tipo === "Serie" ? "Temporadas" : "Episodios";

    return (
        <div className="child-content">
            <h2>{tipo}</h2>
            <ul>
                {children ? (
                    children.map((child) => (
                        <li key={child.id}><a
                            href={urlToContent + (content.tipo === "Serie" ? "preview/" + child.id : "watch/" + child.id)}>
                            {child.titulo} </a></li>
                    ))
                ) : (
                    <li>Cargando {tipo === "Temporadas" ? "temporadas" : "episodios"}... </li>
                )}
            </ul>
        </div>
    );
};

export default ChildList;