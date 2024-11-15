import React from 'react';
import '../../../../public/css/form.css'; // Import the CSS file for styling
import Logo from "../../../../public/images/LogoStreamHub.png";
import Footer from '../Footer.js'


function LoginPage() {
    return (
        <div className="main">
            <div className="login-container">
                <h1>StreamHub</h1>
                <div id={"logo"}>
                    <img src={Logo.src} alt={"Logo"}></img>
                </div>
                <p>Inicia sesión en tu cuenta</p>
                <form action="/login" method="POST">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <button type="submit" className="login-button">Iniciar sesión</button>
                </form>
                <br></br>
                <a href="./signup" className="signup-link">¿Eres nuevo por aquí? Regístrate</a>
            </div>
            <Footer />
        </div>
    );
}

export default LoginPage;
