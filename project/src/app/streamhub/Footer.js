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
                <img src={Logo.src} className="SHlogo" alt="Logo de StreamHub" />
                <div className="TextLogo">StreamHub</div>
                © 2024, StreamHub
                <div id="footerBody">
                    <div>
                        <h1>Información general</h1>
                        <ul id="exploreLinks" className="FooterList">
                            <li><a href="http://localhost:3000/streamhub/policies/aboutUs">Sobre nosotros</a></li>
                            <li><a href="http://localhost:3000/streamhub/policies/help">Ayuda</a></li>
                            <li><a href="http://localhost:3000/streamhub/policies/privacyPolicy">Política de privacidad</a></li>
                            <li><a href="http://localhost:3000/streamhub/policies/termsOfService">Términos y condiciones</a></li>
                        </ul>
                    </div>
                    <div>
                        <h1>Redes sociales</h1>
                        <ul id="socialLinks" className="FooterList">
                            <li><a href="https://www.facebook.com/streamhub"><img src={FacebookLogo.src}
                                                                                  className="RRSSLogo" alt="Facebook" /></a></li>
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
