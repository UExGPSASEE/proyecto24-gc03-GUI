import React from 'react';
import Logo from "../../../public/images/LogoStreamHub.png";
import FacebookLogo from "../../../public/images/facebookLogo.png";
import InstagramLogo from "../../../public/images/instagramIcon.png";
import TwitterLogo from "../../../public/images/twitterLogo.png";
import NetflixLogo from "../../../public/images/netflixLogo.png";
import PrimeLogo from "../../../public/images/primeLogo.png";
import '../../../public/css/Footer.css';

const Footer = () => {
    return (
        <footer>
            <div id="footerHeader">
                <a href="/"><img src={Logo.src} className="SHlogo" alt="Logo de StreamHub" /></a>
                <div className="TextLogo">StreamHub</div>
                © 2024, StreamHub
                <div id="footerBody">
                    <div>
                        <h1>Información general</h1>
                        <p>Esta plataforma fue lanzada en 2024, en respuesta al creciente interés por el contenido de streaming y la digitalización del entretenimiento.</p>
                        <p>Este sitio web, inspirado en las mejores prácticas de plataformas de streaming, se dedica a ofrecer a los usuarios acceso a una amplia variedad de contenido audiovisual, desde películas hasta series exclusivas.</p>
                        <p>StreamHub se esfuerza por conectar a los amantes del entretenimiento con lo mejor de la industria, facilitando la exploración y el descubrimiento de nuevas experiencias.</p>
                    </div>
                    <div>
                        <h1>Redes sociales</h1>
                        <ul id="socialLinks" className="FooterList">
                            <li><a href="https://www.facebook.com/streamhub"><img src={FacebookLogo.src} className="RRSSLogo" alt="Facebook" /></a></li>
                            <li><a href="https://www.instagram.com/streamhub"><img src={InstagramLogo.src} className="RRSSLogo" alt="Instagram" /></a></li>
                            <li><a href="https://twitter.com/streamhub"><img src={TwitterLogo.src} className="RRSSLogo" alt="Twitter" /></a></li>
                        </ul>
                    </div>
                    <div>
                        <h1>Nuestros referentes</h1>
                        <ul id="referenceLinks" className="FooterList">
                            <li><a href="https://www.netflix.com"><img src={NetflixLogo.src} className="logosReferentes" alt="Logo de Netflix" /></a></li>
                            <li><a href="https://www.primevideo.com"><img src={PrimeLogo.src} className="logosReferentes" alt="Logo de Prime Video" /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
