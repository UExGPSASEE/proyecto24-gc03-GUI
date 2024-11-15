import React from 'react';
import Logo from "../../../public/images/LogoStreamHub.png";
import Bandera from "../../../public/images/bandera_españa.png";
import '../../../public/css/Header.css';
const Header = () => {
    return (
        <nav id="header">
            {/* Logo de la empresa */}
            <a href="/"><img src={Logo.src} className="TBWlogo" alt="Logo de la empresa"/></a>
            {/* Nombre comercial de la empresa*/}
            <div className="TextLogo">StreamHub</div>
            <ul className="NavLinks">
                <li><a href="http://localhost:3000/streamhub/search">Buscar</a></li>
                <li><a href="http://localhost:3000/streamhub/myList">Mi Lista</a></li>
            </ul>
            {/* Menú de idioma*/}
            <img src={Bandera.src} className="Flag" alt="Menú desplegable de idioma"/>
                {/* Iniciar sesión */}
                <div>
                    <a className="iniciarSesion" href={'http://localhost:3000/streamhub/login'}>
                        <svg height="70" width="70" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                                style={{fill: "white"}}
                            />
                        </svg>
                        Mi Cuenta</a>
                </div>
        </nav>
    );
};

export default Header;