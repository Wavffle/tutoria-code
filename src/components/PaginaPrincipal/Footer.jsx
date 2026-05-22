import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">

                <div className="footer__item">
                    <img src="/logos/LogoMoodle.png" alt="Moodle" className="footer__icon-img" />
                    <p className="footer__text">TutorIA Code está integrado con Moodle</p>
                </div>

                <div className="footer__item">
                    <img src="/iconos/SincronizacionIcono.png" alt="Sincronización" className="footer__icon-img" />
                    <div>
                        <p className="footer__label">Sincronización</p>
                        <p className="footer__sub">Tu progreso se guarda y es sincronizado con tu curso</p>
                    </div>
                </div>

                <div className="footer__item">
                    <img src="/iconos/PrivacidadIcono.png" alt="Privacidad" className="footer__icon-img" />
                    <div>
                        <p className="footer__label">Privacidad</p>
                        <p className="footer__sub">Tus datos están protegidos y son utilizados con fines educativos</p>
                    </div>
                </div>

            </div>
        </footer>
    )
}