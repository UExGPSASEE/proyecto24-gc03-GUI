import React from 'react';
import '../../../../../public/css/policies.css';
import Footer from '../../Footer.js';

// Main function component for the content presentation page
function AboutUsPage() {
    return (
        <div className="main">
            <div className="content-page">
                <h1>Sobre Nosotros</h1>

                <h2><strong>Bienvenido a StreamHub</strong></h2>

                <p>Lanzada en 2024, StreamHub surge como respuesta al creciente interés por el contenido de streaming y
                    la digitalización del entretenimiento. En un mundo donde la forma de consumir medios está en
                    constante evolución, nuestra plataforma se dedica a ofrecer una experiencia única y accesible para
                    todos los amantes del cine y la televisión.</p>

                <h2><strong>Nuestra Misión</strong></h2>

                <p>En StreamHub, nos inspiramos en las mejores prácticas de las plataformas de streaming para brindar a
                    nuestros usuarios acceso a una amplia variedad de contenido audiovisual. Desde las últimas películas
                    hasta series exclusivas, nuestro objetivo es ser el destino preferido para quienes buscan
                    entretenimiento de calidad.</p>

                <h2><strong>Conectando Pasiones</strong></h2>

                <p>Nos esforzamos por conectar a los amantes del entretenimiento con lo mejor de la industria.
                    Facilitamos la exploración y el descubrimiento de nuevas experiencias, permitiendo que cada usuario
                    encuentre algo que resuene con sus gustos y preferencias. Creemos que cada historia tiene el poder
                    de inspirar, entretener y unir a las personas.</p>

                <h2><strong>Únete a Nuestra Comunidad</strong></h2>

                <p>Te invitamos a ser parte de nuestra comunidad en crecimiento. En StreamHub, no solo ofrecemos
                    contenido; también fomentamos un espacio donde los usuarios pueden compartir sus opiniones,
                    recomendaciones y experiencias. Juntos, podemos explorar el vasto universo del entretenimiento
                    digital.</p>
            </div>
            <Footer/>
        </div>
    );
}

export default AboutUsPage;