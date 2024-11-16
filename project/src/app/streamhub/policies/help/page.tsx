import React from 'react';
import '../../../../../public/css/policies.css';
import Footer from '../../Footer.js';

// Main function component for the content presentation page
function AboutUsPage() {
    return (
        <div className="main">
            <div className="content-page">
                <h1>Centro de Ayuda</h1>

                <h2>Preguntas Frecuentes</h2>

                <p>Aquí encontrarás respuestas a las preguntas más comunes sobre StreamHub:</p>

                <ul>
                    <li><strong>¿Cómo puedo crear una cuenta?</strong> Visita la página de registro y completa el
                        formulario con tu información.
                    </li>
                    <li><strong>¿Qué tipo de contenido está disponible?</strong> Ofrecemos una amplia variedad de
                        películas, series y documentales.
                    </li>
                    <li><strong>¿Puedo cancelar mi suscripción en cualquier momento?</strong> Sí, puedes cancelar tu
                        suscripción desde tu perfil en cualquier momento.
                    </li>
                    <li><strong>¿Cómo puedo contactar al soporte?</strong> Puedes enviarnos un correo a <a
                        className="correo" href="mailto:support@streamhub.com">support@streamhub.com</a> para cualquier
                        consulta.
                    </li>
                </ul>

                <h2>Consejos Útiles</h2>

                <p>Para mejorar tu experiencia en StreamHub, considera lo siguiente:</p>
                <ul>
                    <li>Explora nuestras listas de recomendaciones personalizadas.</li>
                    <li>Utiliza la función de búsqueda para encontrar contenido específico.</li>
                    <li>Revisa nuestras actualizaciones periódicas para no perderte los nuevos lanzamientos.</li>
                </ul>

                <h2>Contacto</h2>

                <p>Si necesitas más ayuda, no dudes en contactarnos a través del siguiente formulario:</p>

                <form className="form-container" action="#" method="post">
                    <div className="form-group">
                        <label htmlFor="name">Nombre:</label>
                        <input type="text" id="name" className="name" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input type="email" id="email" className="email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Mensaje:</label>
                        <textarea id="message" className="message" rows={4} required></textarea>
                    </div>

                    <button type="submit" className="submit-button">Enviar</button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}

export default AboutUsPage;