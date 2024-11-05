import './HomePage.css'; // Import the CSS file for styling
import Logo from "../../../public/images/LogoStreamHub.png";
import React from 'react';
import Footer from './Footer.js'; // Import the Footer component

function HomePage() {
  return (
      <div className="main">
          <div className="home-container">
              <h1>Bienvenido a StreamHub</h1>
              <div id="logo">
                  <img src={Logo.src} alt="Logo"/>
              </div>
              <p>Tu destino para explorar contenido exclusivo y emocionante.</p>
              <div className="content-section">
                  <div className="content-item">
                      <h2>Empieza a disfrutar del contenido de StreamHub hoy</h2>
                      {/* Aquí puedes mapear una lista de videos */}
                  </div>
              </div>
              <div className="cta-section">
                  <a href="streamhub/login" className="cta-link">Iniciar sesión</a>
                  <a href="streamhub/signup" className="cta-link">Regístrate</a>
              </div>
          </div>
          <Footer />
      </div>
);
}

export default HomePage;