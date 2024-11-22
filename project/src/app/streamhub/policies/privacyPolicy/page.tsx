import React from 'react';
import '../../../../../public/css/policies.css';
import Footer from '../../Footer.js';

// Main function component for the content presentation page
function PrivacyPolicyPage() {
    return (
        <div className="main">
            <div className="content-page">
                <h1>Política de Privacidad de StreamHub</h1>
                <p><strong>Última actualización:</strong> 15 de noviembre de 2024</p>

                <p> En StreamHub, valoramos tu privacidad y estamos comprometidos a proteger tus datos personales. Esta
                    Política de Privacidad explica cómo recopilamos, usamos y compartimos tu información cuando utilizas
                    nuestros servicios.</p>

                <h2>1. Información que Recopilamos</h2>
                <p>Recopilamos varios tipos de información para ofrecerte una experiencia personalizada y mejorar
                    nuestros servicios:</p>
                <ul>
                    <li><strong>Información Personal:</strong> Al registrarte, recopilamos datos como tu nombre,
                        dirección de correo electrónico, número de teléfono y datos de pago.
                    </li>
                    <li><strong>Información de Uso:</strong> Recopilamos datos sobre cómo interactúas con nuestra
                        plataforma, incluyendo el contenido que ves, la duración de las visualizaciones y tus
                        preferencias.
                    </li>
                    <li><strong>Información Técnica:</strong> Recopilamos información sobre el dispositivo que utilizas
                        para acceder a StreamHub, como la dirección IP, el tipo de navegador y el sistema operativo.
                    </li>
                </ul>

                <h2>2. Uso de la Información</h2>
                <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
                <ul>
                    <li><strong>Provisión del Servicio:</strong> Para ofrecerte acceso a nuestro contenido y mejorar tu
                        experiencia de usuario.
                    </li>
                    <li><strong>Personalización:</strong> Para recomendarte contenido basado en tus preferencias y
                        hábitos de visualización.
                    </li>
                    <li><strong>Comunicación:</strong> Para enviarte actualizaciones, promociones y noticias sobre
                        StreamHub.
                    </li>
                    <li><strong>Análisis:</strong> Para entender cómo se utiliza nuestra plataforma y mejorar nuestros
                        servicios.
                    </li>
                </ul>

                <h2>3. Compartir tu Información</h2>
                <p>No vendemos ni alquilamos tu información personal a terceros. Sin embargo, podemos compartir tu
                    información en las siguientes circunstancias:</p>
                <ul>
                    <li><strong>Proveedores de Servicios:</strong> Podemos compartir información con terceros que nos
                        ayudan a operar nuestra plataforma, como procesadores de pagos y servicios de análisis, siempre
                        bajo estrictas condiciones de confidencialidad.
                    </li>
                    <li><strong>Cumplimiento Legal:</strong> Podemos divulgar tu información si es requerido por la ley
                        o en respuesta a solicitudes legales.
                    </li>
                </ul>

                <h2>4. Seguridad de la Información</h2>
                <p>Implementamos medidas de seguridad razonables para proteger tu información personal. Sin embargo,
                    ninguna transmisión de datos por Internet es completamente segura, y no podemos garantizar la
                    seguridad absoluta de tu información.</p>

                <h2>5. Tus Derechos</h2>
                <p>Tienes derechos sobre tu información personal, que incluyen:</p>
                <ul>
                    <li><strong>Acceso:</strong> Puedes solicitar acceso a la información que tenemos sobre ti.</li>
                    <li><strong>Corrección:</strong> Puedes solicitar la corrección de información inexacta o
                        incompleta.
                    </li>
                    <li><strong>Eliminación:</strong> Puedes solicitar la eliminación de tu información personal, sujeto
                        a ciertas excepciones.
                    </li>
                </ul>

                <h2>6. Cookies y Tecnologías Similares</h2>
                <p>Utilizamos cookies y tecnologías similares para mejorar tu experiencia en StreamHub. Puedes gestionar
                    tus preferencias de cookies a través de la configuración de tu navegador.</p>

                <h2>7. Cambios a esta Política</h2>
                <p>Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos sobre cambios
                    significativos y te recomendamos revisar esta política periódicamente para estar informado sobre
                    cómo protegemos tu información.</p>

                <h2>8. Contacto</h2>
                <p>Si tienes preguntas o inquietudes sobre esta Política de Privacidad, contáctanos en <a
                    className="correo" href="mailto:support@streamhub.com">support@streamhub.com</a>.</p>
            </div>
            <Footer/>
        </div>
    );
}

export default PrivacyPolicyPage;