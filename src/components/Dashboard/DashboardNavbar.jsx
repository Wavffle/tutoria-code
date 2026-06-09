import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEstudiante } from '../../context/EstudianteContext'
import './DashboardNavbar.css'

export default function DashboardNavbar() {
    const navigate = useNavigate()
    const { estudiante } = useEstudiante()
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
    const [tooltipVisible, setTooltipVisible] = useState(false)

    function handleMouseMove(e) {
        setTooltipPos({ x: e.clientX, y: e.clientY })
    }

    if (!estudiante) return null

    return (
        <header className="db-navbar">
            <div
                className="db-navbar__logo"
                onClick={() => navigate('/dashboard')}
                style={{ cursor: 'pointer' }}
            >
                <div className="db-navbar__logo-line">
                    <span className="db-navbar__logo-tutor">Tutor</span>
                    <span className="db-navbar__logo-ia">IA</span>
                </div>
                <span className="db-navbar__logo-sub">Code</span>
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
                        style={{ width: `${(estudiante.progreso_nivel / (estudiante.nivel_actual === 1 ? 500 : estudiante.nivel_actual === 2 ? 750 : 1000)) * 100}%` }}
                    />
                </div>
                <p className="db-navbar__progress-text">
                    {estudiante.progreso_nivel}/{estudiante.nivel_actual === 1 ? 500 : estudiante.nivel_actual === 2 ? 750 : 1000} puntos para subir de nivel
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