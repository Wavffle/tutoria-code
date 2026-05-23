import { useNavigate } from 'react-router-dom'
import './Error.css'

export default function Error() {
    const navigate = useNavigate()

    return (
        <div className="error-page">
            <div className="error-page__card">
                <div className="error-page__content">
                    <h1 className="error-page__title">¡Ups! Algo salió mal</h1>
                    <p className="error-page__desc">
                        Esta función aún no está disponible en el prototipo actual.
                        La integración con Moodle se habilitará próximamente.
                        Por ahora, puedes explorar TutorIA sin iniciar sesión.
                    </p>
                    <div className="error-page__actions">
                        <button
                            className="error-page__btn error-page__btn--primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Explorar TutorIA
                        </button>
                        <button
                            className="error-page__btn error-page__btn--outline"
                            onClick={() => navigate('/')}
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                </div>
                <div className="error-page__robot-container">
                    <img
                        src="/robotTutorIA/tutorIAProblema.png"
                        alt="TutorIA con problema"
                        className="error-page__robot"
                    />
                </div>
            </div>
        </div>
    )
}