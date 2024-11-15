// app/search/page.tsx
import React from 'react';
import '../../../../public/css/search.css';
import Footer from '../Footer.js'; // Import the Footer component

export default function SearchPage() {
	return (
		<div className="main">
			<div className="search-page">
				<h1>Busca algo que ver hoy</h1>

				{/* Search Bar */}
				<div className="search-bar">
					<input
						type="text"
						placeholder="Escribe aquí el título..."
						className="search-input"
					/>
					<button className="search-button">Buscar</button>
				</div>

				{/* Tag Selection */}
				<div className="tag-selection">
					<h2>Añade etiquetas</h2>
					<div className="tag-options">
						<span className="tag">Acción</span>
						<span className="tag">Comedia</span>
						<span className="tag">Drama</span>
						<span className="tag">Terror</span>
						<span className="tag">Ciencia ficción</span>
					</div>
				</div>

				{/* Filter Options */}
				<div className="filter-section">
					<h2>Filter Results</h2>
					<select className="filter-dropdown">
						<option value="a-z">A-Z</option>
						<option value="z-a">Z-A</option>
						<option value="date-asc">Más antiguos primero</option>
						<option value="date-desc">Más recientes primero</option>
					</select>
				</div>

				{/* Results Section (Placeholder) */}
				<div className="results-section">
					<h2>Resultados de búsqueda</h2>
					<ul className="results-list">
						<li className="result-item">Result Item 1</li>
						<li className="result-item">Result Item 2</li>
						<li className="result-item">Result Item 3</li>
					</ul>
				</div>
			</div>
			<Footer />
		</div>
	);
}
