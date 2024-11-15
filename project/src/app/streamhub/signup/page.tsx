"use client"

import React, {useState} from 'react';
import { useRouter } from 'next/navigation'
import '../../../../public/css/form.css'; // Import the CSS file for styling
import Logo from "../../../../public/images/LogoStreamHub.png";
import Footer from '../Footer.js';

function SignInPage() {
    // Definir los estados para cada campo del formulario
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fecha_de_nacimiento, setFechaDeNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [numero_tarjeta_de_credito, setNumeroTarjetaDeCredito] = useState('');
    const [ccv, setCcv] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    // Variable para obtener el año actual y limitar el rango de años de nacimiento
    const currentYear = new Date().getFullYear();

    const handleClick = () => {
        if(message?.type === 'success'){
            router.push(`http://localhost:3000/streamhub`)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Using Date.parse method
        const parse = Date.parse(fecha_de_nacimiento);
        // Converting to date object
        const date = new Date(parse)
        // Verificacion  de campos
        if (date.getFullYear() > (currentYear - 18)) {
            setMessage({type: 'error', text: `Tienes que ser mayor de 18 años para gestionar tu cuenta`});
            return;
        }

        //Creacion de objeto con los datos del formulario
        const contentData = {
            id: 0,
            nombre,
            apellidos,
            fecha_de_nacimiento,
            email,
            password,
            numero_tarjeta_de_credito,
            ccv
        };

        //Envio de datos al servidor
        try {
            const response = await fetch(`http://localhost:8080/StreamHub/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contentData),
            });
            console.log("Before sending:", JSON.stringify(contentData));
            //Verificacion de respuesta
            if (response.ok) {
                setMessage({type: 'success', text: 'Usuario registrado exitosamente'});
            } else {
                const errorMessage = await response.text();
                setMessage({
                    type: 'error',
                    text: `Error al registrar el usuario: ${errorMessage || 'Error desconocido'}`
                });
            }
        } catch (error) {
            console.error('Error al hacer la petición:', error);
            alert('Hubo un error al enviar la solicitud');
        }
    };

    return (
        <div className="main">
            <div className="login-container">
                <h1>StreamHub</h1>
                <div id={"logo"}>
                    <img src={Logo.src} alt={"Logo"}></img>
                </div>
                <p>Regístrate</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" required
                               value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="apellidos">Apellidos</label>
                        <input type="text" id="apellidos" name="apellidos" value={apellidos} required
                               onChange={(e) => setApellidos(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeNacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="fechaDeNacimiento" name="fechaDeNacimiento" value={fecha_de_nacimiento}
                               required onChange={(e) => setFechaDeNacimiento(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} required
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} required
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numeroTarjetaDeCredito">Número de Tarjeta de Crédito</label>
                        <input type="text" id="numeroTarjetaDeCredito" name="numeroTarjetaDeCredito"
                               value={numero_tarjeta_de_credito}
                               required onChange={(e) => setNumeroTarjetaDeCredito(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ccv">CCV</label>
                        <input type="text" id="ccv" name="ccv" maxLength={3} value={ccv} required
                               onChange={(e) => setCcv(e.target.value)}/>
                    </div>

                    <button type="submit" className="login-button" onClick={handleClick}>Registrarse</button>
                </form>
                <br></br>
                <a href="./login" className="signup-link">¿Ya tienes cuenta? Inicia sesión</a>
                {/* Notificación push-up */}
                {message && (
                    <div className={`notification ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default SignInPage;
