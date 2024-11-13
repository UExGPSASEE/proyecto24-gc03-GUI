"use client";

import React, { useState } from 'react';
import '../../../../public/css/InsertContent.css'; // Importa el archivo CSS
import Logo from "../../../../public/images/LogoStreamHub.png";

function InsertContent() {
    // Definir los estados para cada campo del formulario
    const [tipo, setTipo] = useState('');
    const [titulo, setTitulo] = useState('');
    const [productionYear, setProductionYear] = useState<number | undefined>(undefined);
    const [clasificacionEdad, setClasificacionEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [perteneceA, setPerteneceA] = useState<number | undefined>(undefined);
    const [numeroElementos, setNumeroElementos] = useState<number | undefined>(undefined);
    const [duracion, setDuracion] = useState<number | undefined>(undefined);
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Variable para obtener el año actual y limitar el rango de años de producción
    const currentYear = new Date().getFullYear();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // Verificacion  de campos
        if (productionYear && (productionYear < 1895 || productionYear > currentYear)) {
            setMessage({ type: 'error', text: `El año de producción debe estar entre 1895 y ${currentYear}.` });
            return;
        }

        if (duracion && duracion < 0) {
            setMessage({ type: 'error', text: 'La duración no puede ser negativa.' });
            return;
        }
        //Creacion de objeto con los datos del formulario
        const contentData = {
            id: 0,
            tipo,
            titulo,
            production_year: productionYear ?? null,
            clasificacion_edad: clasificacionEdad,
            descripcion,
            pertenece_a: perteneceA ?? null,
            numero_elementos: numeroElementos ?? null,
            duracion: duracion ?? null,
            url
        };
        //Envio de datos al servidor
        try {
            const response = await fetch('http://localhost:8080/StreamHub/contenidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contentData)
            });
            //Verificacion de respuesta
            if (response.ok) {
                setMessage({ type: 'success', text: 'Contenido publicado exitosamente' });
            } else {
                const errorMessage = await response.text();
                setMessage({ type: 'error', text: `Error al publicar contenido: ${errorMessage || 'Error desconocido'}` });
            }
        } catch (error) {
            console.error('Error al hacer la petición:', error);
            alert('Hubo un error al enviar la solicitud');
        }
    };
    //Verificacion de si el contenido es una serie o temporada para saber que campos mostrar en el formulario
    const isSeriesOrSeason = tipo === 'Serie' || tipo === 'Temporada';

    return (
        <div className="insert-content-container">
            <h1>StreamHub</h1>
            <div id="logo">
                <img src={Logo.src} alt="Logo"/>
            </div>
            <p>Inserta un nuevo contenido</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Contenido</label>
                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Pelicula">Pelicula</option>
                        <option value="Serie">Serie</option>
                        <option value="Temporada">Temporada</option>
                        <option value="Episodio">Episodio</option>
                        <option value="Documental">Documental</option>
                        <option value="Corto">Corto</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="productionYear">Año de Producción</label>
                    <input
                        type="number"
                        id="productionYear"
                        value={productionYear || ''}
                        onChange={(e) => setProductionYear(e.target.value ? Number(e.target.value) : undefined)}
                        min="1895"
                        max={currentYear}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="clasificacionEdad">Clasificación de Edad</label>
                    <input
                        type="text"
                        id="clasificacionEdad"
                        value={clasificacionEdad}
                        onChange={(e) => setClasificacionEdad(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>

                {isSeriesOrSeason && (
                    <div className="form-group">
                        <label htmlFor="perteneceA">Pertenece a</label>
                        <input
                            type="number"
                            id="perteneceA"
                            value={perteneceA || ''}
                            onChange={(e) => setPerteneceA(e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>
                )}

                {isSeriesOrSeason && (
                    <div className="form-group">
                        <label htmlFor="numeroElementos">Número de Elementos</label>
                        <input
                            type="number"
                            id="numeroElementos"
                            value={numeroElementos || ''}
                            onChange={(e) => setNumeroElementos(e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="duracion">Duración (min)</label>
                    <input
                        type="number"
                        id="duracion"
                        value={duracion || ''}
                        onChange={(e) => setDuracion(e.target.value ? Number(e.target.value) : undefined)}
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="url">URL</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Publicar Contenido</button>
            </form>

            {/* Notificación push-up */}
            {message && (
                <div className={`notification ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default InsertContent;
