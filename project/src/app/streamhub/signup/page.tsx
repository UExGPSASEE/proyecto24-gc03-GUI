import React from 'react';
import './signup.css'; // Import the CSS file for styling
import Logo from "./LogoStreamHub.png";


function LoginPage() {
    return (
        <div className="login-container">
            <h1>StreamHub</h1>
            <div id={"logo"}>
                <img src={Logo.src} alt={"Logo"}></img>
            </div>
            <p>Regístrate</p>
            <form action="/login" method="POST">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input type="text" id="apellidos" name="apellidos" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="fechaDeNacimiento">Fecha de Nacimiento</label>
                    <input type="date" id="fechaDeNacimiento" name="fechaDeNacimiento" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="numeroTarjetaDeCredito">Número de Tarjeta de Crédito</label>
                    <input type="text" id="numeroTarjetaDeCredito" name="numeroTarjetaDeCredito" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="ccv">CCV</label>
                    <input type="text" id="ccv" name="ccv" maxLength={3} required/>
                </div>

                <button type="submit" className="login-button">Registrarse</button>
            </form>
            <br></br>
            <a href="/login" className="signup-link">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
    );
}

export default LoginPage;
