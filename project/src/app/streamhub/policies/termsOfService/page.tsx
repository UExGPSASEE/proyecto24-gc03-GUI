// app/content/[id]/page.tsx
import React from 'react';
import '../../../../../public/css/policies.css';
import Footer from '../../Footer.js';

// Main function component for the content presentation page
function TermsOfServicePage() {
    return (
        <div className="main">
            <div className="content-page">
                <h1>Términos y Servicios de StreamHub</h1>
                <p><strong>Última actualización:</strong> 15 de noviembre de 2024</p>
                <p>Bienvenido a StreamHub. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes
                    términos y condiciones. Si no estás de acuerdo con estos términos, te pedimos que no utilices
                    nuestros servicios.</p>

                <h2>1. Aceptación de los Términos</h2>
                <p>Al registrarte en StreamHub, confirmas que tienes al menos 18 años o que cuentas con el
                    consentimiento de un padre o tutor. Estos términos son vinculantes y se aplican a todos los usuarios
                    de la plataforma.</p>

                <h2>2. Descripción del Servicio</h2>
                <p>StreamHub es una plataforma de streaming que ofrece acceso a una amplia variedad de contenido,
                    incluyendo películas, series, documentales y programas originales. Nos reservamos el derecho de
                    modificar, actualizar o eliminar contenido en cualquier momento.</p>

                <h2>3. Registro y Cuenta</h2>
                <p>Para acceder a ciertos servicios, deberás crear una cuenta. Eres responsable de mantener la
                    confidencialidad de tu información de cuenta y de todas las actividades que ocurran bajo tu cuenta.
                    Notifícanos inmediatamente si sospechas de un uso no autorizado de tu cuenta.</p>

                <h2>4. Suscripciones y Pagos</h2>
                <ul>
                    <li><strong>Planes de Suscripción:</strong> Ofrecemos diferentes planes de suscripción que pueden
                        variar en precio y características. Los detalles de cada plan se encuentran en nuestra página de
                        suscripción.
                    </li>
                    <li><strong>Facturación:</strong> Los pagos se realizarán de forma mensual o anual, según la opción
                        elegida. Aceptamos varios métodos de pago y te notificaremos sobre cualquier cambio en las
                        tarifas con antelación.
                    </li>
                    <li><strong>Política de Cancelación:</strong> Puedes cancelar tu suscripción en cualquier momento a
                        través de tu cuenta. La cancelación será efectiva al final del período de facturación actual.
                    </li>
                </ul>

                <h2>5. Uso del Servicio</h2>
                <p>Te otorgamos una licencia limitada, no exclusiva e intransferible para acceder y utilizar el servicio
                    para tu uso personal y no comercial. No puedes reproducir, distribuir, modificar o crear obras
                    derivadas del contenido sin nuestro consentimiento previo.</p>

                <h2>6. Contenido Generado por el Usuario</h2>
                <p>Si permitimos que los usuarios envíen contenido (como comentarios o reseñas), mantendremos el derecho
                    de moderar y eliminar cualquier contenido que consideremos inapropiado o que infrinja estos
                    términos.</p>

                <h2>7. Limitación de Responsabilidad</h2>
                <p>StreamHub no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso
                    o la incapacidad de uso del servicio. Esto incluye, pero no se limita a, la pérdida de datos o
                    beneficios.</p>

                <h2>8. Modificaciones a los Términos</h2>
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre
                    cambios significativos y tu uso continuado del servicio después de dichos cambios constituirá tu
                    aceptación de los nuevos términos.</p>

                <h2>9. Ley Aplicable</h2>
                <p>Estos términos se regirán e interpretarán de acuerdo con las leyes de la Unión Europea, incluyendo,
                    pero no limitándose a:</p>
                <ul className="leyes">
                    <li><a href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32016R0679">Reglamento
                        General de Protección de Datos (RPGD) [Reglamento (UE) 2016/679]</a></li>
                    <li><a href="https://www.boe.es/eli/es/lo/2018/12/05/3/con">Ley Orgánica 3/2018 de Protección de
                        Datos Personales y garantía de los derechos digitales (LOPDGDD)</a></li>
                    <li><a href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2065">Ley de
                        Servicios Digitales (DSA) [Reglamento (UE) 2022/2065]</a></li>
                    <li><a href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R1925">Ley de
                        Mercados Digitales (DMA) [Reglamento (UE) 2022/1925]</a></li>
                    <li><a
                        href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202302854&qid=1731697984770">Ley
                        Europea de Datos (DA) [Reglamento (UE) 2023/2854]</a></li>
                    <li><a href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R0868">Ley de
                        Gobernanza de Datos [Reglamento (UE) 2022/868]</a></li>
                </ul>

                <h2>10. Contacto</h2>
                <p>Si tienes preguntas sobre estos Términos y Servicios, contáctanos en <a
                    className="correo" href="mailto:support@streamhub.com">support@streamhub.com</a>.</p>
            </div>
            <Footer/>
        </div>
    );
}

export default TermsOfServicePage;