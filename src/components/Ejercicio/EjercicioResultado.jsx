import { useNavigate } from 'react-router-dom'
import { ejercicioData } from './ejercicioData'
import './EjercicioResultado.css'

export default function EjercicioResultado({ estado, salida, onReintentar, onRefuerzo }) {
    const navigate = useNavigate()

    if (estado === 'pendiente') {
        return (
            <div className="ej-resultado ej-resultado--pendiente">
                <div className="ej-resultado__pending-header">
                    <img src="/iAIcono.png" alt="IA" className="ej-resultado__ia-icon" />
                    <p className="ej-resultado__pending-title">Aún no has ejecutado código.</p>
                </div>
                <p className="ej-resultado__pending-desc">
                    Una vez que termines tu programa, presiona "Ejecutar" para ver el resultado en pantalla
                </p>
                <div className="ej-resultado__steps">
                    <div className="ej-resultado__step">
                        <div className="ej-resultado__step-num">1</div>
                        <img src="/escribeCodigo.png" alt="Escribe" className="ej-resultado__step-img" />
                        <p>Escribe tu codigo</p>
                    </div>
                    <span className="ej-resultado__arrow">→</span>
                    <div className="ej-resultado__step">
                        <div className="ej-resultado__step-num">2</div>
                        <img src="/ejecutaPrograma.png" alt="Ejecuta" className="ej-resultado__step-img" />
                        <p>Ejecuta el programa</p>
                    </div>
                    <span className="ej-resultado__arrow">→</span>
                    <div className="ej-resultado__step">
                        <div className="ej-resultado__step-num">3</div>
                        <img src="/revisaResultado.png" alt="Revisa" className="ej-resultado__step-img" />
                        <p>Revisa el resultado</p>
                    </div>
                </div>
            </div>
        )
    }

    if (estado === 'correcto') {
        const fb = ejercicioData.feedbackCorrecto
        return (
            <div className="ej-resultado ej-resultado--correcto">
                <p className="ej-resultado__correcto-texto">
                    <strong>¡Correcto!</strong> {fb.texto.replace('¡Correcto! ', '')}
                </p>
                <div className="ej-resultado__tags">
                    {fb.conceptosLogrados.map((c, i) => (
                        <span key={i} className="ej-resultado__tag ej-resultado__tag--verde">✓ {c}</span>
                    ))}
                </div>
                <button
                    className="ej-resultado__continuar-btn"
                    onClick={() => navigate('/feedback')}
                >
                    CONTINUAR
                </button>
            </div>
        )
    }

    if (estado === 'incorrecto') {
        const fb = ejercicioData.feedbackIncorrecto
        return (
            <div className="ej-resultado ej-resultado--incorrecto">
                <div className="ej-resultado__incorrecto-left">
                    <p className="ej-resultado__incorrecto-texto">
                        <strong>Incorrecto.</strong> {fb.texto.replace('Incorrecto. ', '')}
                    </p>
                    <div className="ej-resultado__error-box">
                        <div className="ej-resultado__error-header">
                            <img src="/xIcono.png" alt="Error" className="ej-resultado__x-icon" />
                            <strong>{fb.errorTitulo}</strong>
                        </div>
                        <p className="ej-resultado__error-desc">{fb.errorDesc}</p>
                    </div>
                    <div className="ej-resultado__tags">
                        {fb.conceptosLogrados.map((c, i) => (
                            <span key={i} className="ej-resultado__tag ej-resultado__tag--verde">✓ {c}</span>
                        ))}
                    </div>
                </div>
                <div className="ej-resultado__incorrecto-right">
                    <div className="ej-resultado__decision-box">
                        <p className="ej-resultado__decision-title">Decisión de TutorIA</p>
                        <p className="ej-resultado__decision-desc">{fb.decisionTutor}</p>
                    </div>
                    <div className="ej-resultado__incorrecto-btns">
                        <button className="ej-resultado__btn ej-resultado__btn--reintentar" onClick={onReintentar}>
                            <img src="/repetirIcono.png" alt="Reintentar" className="ej-resultado__btn-icon" />
                            Reintentar el mismo ejercicio
                        </button>
                        <button className="ej-resultado__btn ej-resultado__btn--refuerzo" onClick={onRefuerzo}>
                            <img src="/iAIcono.png" alt="IA" className="ej-resultado__btn-icon" />
                            Generar ejercicio de refuerzo
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}