import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import TutorIANavbar from '../components/shared/TutorIANavbar.jsx'
import FeedbackHero from '../components/Feedback/FeedbackHero'
import FeedbackResumen from '../components/Feedback/FeedbackResumen'
import FeedbackExplicacion from '../components/Feedback/FeedbackExplicacion'
import FeedbackAcciones from '../components/Feedback/FeedbackAcciones'
import FeedbackSidebar from '../components/Feedback/FeedbackSidebar'
import { useEstudiante } from '../context/EstudianteContext'
import './Feedback.css'

const FASTAPI_URL = 'http://127.0.0.1:8000'

export default function Feedback() {
    const location = useLocation()
    const navigate = useNavigate()
    const { estudiante, resultadoIntento } = useEstudiante()

    const ejercicio = location.state?.ejercicio
    const modulo = location.state?.modulo
    const numeroEjercicio = location.state?.numeroEjercicio
    const totalEjercicios = location.state?.totalEjercicios
    const codigoEstudiante = location.state?.codigoEstudiante || ''
    const descripcionEjercicio = location.state?.descripcionEjercicio || ejercicio?.texto || ''

    const [feedbackIA, setFeedbackIA] = useState(null)
    const [cargandoIA, setCargandoIA] = useState(true)

    const peticionEnviada = useRef(false)

    useEffect(() => {
        if (peticionEnviada.current) return
        if (!ejercicio || !estudiante) return

        peticionEnviada.current = true

        async function generarFeedback() {
            setCargandoIA(true)
            try {
                const res = await fetch(`${FASTAPI_URL}/api/generar_feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        descripcion_ejercicio: descripcionEjercicio,
                        codigo_estudiante: codigoEstudiante,
                        intentos_utilizados: resultadoIntento?.intentos || 1,
                        nivel_actual: estudiante.nivelTexto || 'Basico'
                    })
                })
                const data = await res.json()
                setFeedbackIA(data)
            } catch (error) {
                console.error('Error al generar feedback:', error)
            } finally {
                setCargandoIA(false)
            }
        }

        generarFeedback()
    }, [])

    return (
        <div className="feedback-page">
            <TutorIANavbar breadcrumb={[
                { label: 'Dashboard', path: '/dashboard' },
                { label: modulo?.titulo ?? 'Módulo', path: '/dashboard' },
                { label: ejercicio?.texto ?? 'Ejercicio', path: '/ejercicio' },
                { label: 'Retroalimentación' }
            ]}
                           onLogoClick={() => navigate('/dashboard')}
                           onAvatarClick={() => navigate('/perfil')}
                           onBreadcrumbClick={(path) => navigate(path)}
            />

            <div className="feedback-page__body">
                <div className="feedback-page__main">
                    <div className="feedback-animar" style={{ animationDelay: '0ms' }}>
                        <FeedbackHero />
                    </div>
                    <div className="feedback-animar" style={{ animationDelay: '80ms' }}>
                        <FeedbackResumen
                            codigoEstudiante={codigoEstudiante}
                            feedbackIA={feedbackIA}
                            cargando={cargandoIA}
                        />
                    </div>
                    <div className="feedback-animar" style={{ animationDelay: '160ms' }}>
                        <FeedbackExplicacion
                            feedbackIA={feedbackIA}
                            cargando={cargandoIA}
                        />
                    </div>
                    <div className="feedback-animar" style={{ animationDelay: '240ms' }}>
                        <FeedbackAcciones
                            ejercicio={ejercicio}
                            modulo={modulo}
                            numeroEjercicio={numeroEjercicio}
                            totalEjercicios={totalEjercicios}
                        />
                    </div>
                </div>
                <div className="feedback-animar" style={{ animationDelay: '120ms' }}>
                    <FeedbackSidebar feedbackIA={feedbackIA} />
                </div>
            </div>
        </div>
    )
}