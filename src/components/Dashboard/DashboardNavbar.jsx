import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useEstudiante } from '../../context/EstudianteContext'
import './DashboardNavbar.css'

const PUNTOS_PARA_NIVEL = { 1: 500, 2: 750, 3: 1000 }

export default function DashboardNavbar() {
    const navigate = useNavigate()
    const { estudiante } = useEstudiante()
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const [easterEgg, setEasterEgg] = useState(false)
    const audioRef = useRef(null)

    function handleMouseMove(e) {
        setTooltipPos({ x: e.clientX, y: e.clientY })
    }

    function handleLogoClick() {
        // Reproduce el sonido
        if (!audioRef.current) {
            audioRef.current = new Audio('/sounds/bading.mp3')
        }
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})

        // Muestra el mensaje
        setEasterEgg(true)
        setTimeout(() => setEasterEgg(false), 2500)
    }

    if (!estudiante) return null

    const puntosParaNivel = PUNTOS_PARA_NIVEL[estudiante.nivel_actual] ?? 1000

    return (
        <header className="db-navbar">
            <div className="db-navbar__logo-wrapper">
                <div
                    className="db-navbar__logo"
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="db-navbar__logo-line">
                        <span className="db-navbar__logo-tutor">Tutor</span>
                        <span className="db-navbar__logo-ia">IA</span>
                    </div>
                    <span className="db-navbar__logo-sub">Code</span>
                </div>

                {easterEgg && (
                    <div className="db-navbar__easter-egg">
                        ¡Bienvenido a TutorIA Code!
                    </div>
                )}
            </div>

            <div className="db-navbar__center">
                <button
                    className="db-navbar__username"
                    onClick={() => navigate('/perfil')}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                >
                    {estudiante.nombre} {estudiante.apellido}
                    <span className="db-navbar__username-arrow">›</span>
                </button>

                {tooltipVisible && (
                    <div
                        className="db-navbar__username-tooltip"
                        style={{ left: tooltipPos.x, top: tooltipPos.y - 40 }}
                    >
                        Ver perfil
                    </div>
                )}

                <p className="db-navbar__nivel">
                    Nivel actual: <strong>{estudiante.nivelTexto}</strong>
                </p>
                <div className="db-navbar__progress-bar">
                    <div
                        className="db-navbar__progress-fill"
                        style={{ width: `${Math.min((estudiante.progreso_nivel / puntosParaNivel) * 100, 100)}%` }}
                    />
                </div>
                <p className="db-navbar__progress-text">
                    {estudiante.progreso_nivel}/{puntosParaNivel} puntos para subir de nivel
                </p>
                <p className="db-navbar__lenguaje">
                    Lenguaje de practica: <strong>Python</strong>
                </p>
            </div>

            <div className="db-navbar__sugerencia">
                <p className="db-navbar__sugerencia-title">Sugerencia del tutor</p>
                <div className="db-navbar__sugerencia-body">
                    <img src="/iconos/programacionIcono.png" alt="Código" className="db-navbar__sugerencia-icon" />
                    <p className="db-navbar__sugerencia-text">"Es recomendado practicar condicionales"</p>
                </div>
            </div>
        </header>
    )
}