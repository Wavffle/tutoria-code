import { useEstudiante } from '../../context/EstudianteContext'
import { useState, useEffect } from 'react'
import { feedbackData } from './feedbackData'
import './FeedbackSidebar.css'

export default function FeedbackSidebar() {
    const { estudiante, resultadoIntento } = useEstudiante()
    const [historial, setHistorial] = useState([])
    const [ejerciciosModulo, setEjerciciosModulo] = useState(0)

    const puntosActuales = resultadoIntento?.puntosActuales ?? feedbackData.puntosActuales
    const puntosParaSiguienteNivel = resultadoIntento?.puntosParaSiguienteNivel ?? feedbackData.puntosParaSiguienteNivel
    const nivelActual = resultadoIntento?.nivelActual ?? feedbackData.nivelActual
    const siguienteNivel = resultadoIntento?.siguienteNivel ?? feedbackData.siguienteNivel

    useEffect(() => {
        if (!estudiante) return

        async function cargarHistorial() {
            try {
                const res = await fetch(`http://localhost:3001/api/estudiantes/${estudiante.id}/historial`)
                const data = await res.json()
                if (data.success) {
                    setHistorial(data.intentos.slice(0, 8))

                    // Calcular ejercicios completados en el módulo actual
                    if (resultadoIntento?.ejercicio_id) {
                        const res2 = await fetch(`http://localhost:3001/api/ejercicios/${resultadoIntento.ejercicio_id}`)
                        const data2 = await res2.json()
                        if (data2.success) {
                            const moduloActual = data2.ejercicio.modulo
                            const completadosEnModulo = new Set(
                                data.intentos
                                    .filter(i => i.modulo === moduloActual && i.es_correcto)
                                    .map(i => i.titulo)
                            ).size
                            setEjerciciosModulo(completadosEnModulo)
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar historial:', error)
            }
        }

        cargarHistorial()
    }, [estudiante, resultadoIntento])

    return (
        <aside className="fb-sidebar">

            {/* Progreso módulo */}
            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Progreso en el modulo</h3>
                <div className="fb-sidebar__dots">
                    {Array.from({ length: 5 }, (_, i) => (
                        <span
                            key={i}
                            className={`fb-sidebar__dot ${i < ejerciciosModulo ? 'fb-sidebar__dot--done' : ''}`}
                        />
                    ))}
                </div>
                <p className="fb-sidebar__sub">
                    {ejerciciosModulo}/5 Ejercicios del modulo completados
                </p>
            </div>

            {/* Progreso nivel */}
            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Progreso hasta el proximo nivel</h3>
                <div className="fb-sidebar__barra">
                    <div
                        className="fb-sidebar__barra-fill"
                        style={{ width: `${Math.min((puntosActuales / puntosParaSiguienteNivel) * 100, 100)}%` }}
                    />
                </div>
                <p className="fb-sidebar__sub">
                    {puntosActuales}/{puntosParaSiguienteNivel} Puntos totales
                </p>
                <p className="fb-sidebar__nivel">
                    Nivel actual: <strong>{nivelActual}</strong>
                </p>
                <p className="fb-sidebar__nivel">
                    Siguiente nivel: <strong className="fb-sidebar__nivel--next">{siguienteNivel}</strong>
                </p>
            </div>

            {/* Decisión tutor */}
            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Decisión del tutor</h3>
                <div className="fb-sidebar__decision-lista">
                    <p><strong>Resultado:</strong> {feedbackData.decision.resultado}</p>
                    <p><strong>Intentos:</strong> {feedbackData.decision.intentos}</p>
                    <p><strong>Nivel actual:</strong> {nivelActual}</p>
                    <p><strong>Decisión:</strong> {feedbackData.decision.accion}</p>
                </div>
                <div className="fb-sidebar__decision-box">
                    <img src="/iconos/iAIcono.png" alt="IA" className="fb-sidebar__ia-icon" />
                    <p>{feedbackData.decision.mensaje}</p>
                </div>
            </div>

            {/* Conceptos */}
            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Conceptos clave reforzados</h3>
                <ul className="fb-sidebar__conceptos">
                    {feedbackData.conceptos.map((c, i) => (
                        <li key={i}>
                            <span className="fb-sidebar__check">✓</span> {c}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Historial */}
            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Historial reciente</h3>
                {historial.length === 0 ? (
                    <p className="fb-sidebar__vacio">Aún no hay ejercicios completados.</p>
                ) : (
                    <ul className="fb-sidebar__historial">
                        {historial.map((h, i) => (
                            <li key={i} className="fb-sidebar__historial-item">
                                <span className={`fb-sidebar__historial-check ${h.es_correcto ? 'fb-sidebar__historial-check--done' : ''}`}>
                                    {h.es_correcto ? '✓' : '○'}
                                </span>
                                <div className="fb-sidebar__historial-info">
                                    <p className="fb-sidebar__historial-nombre">{h.titulo}</p>
                                    <p className="fb-sidebar__historial-tiempo">{h.titulo_modulo}</p>
                                </div>
                                <span className={`fb-sidebar__historial-pct ${h.es_correcto ? 'fb-sidebar__historial-pct--done' : ''}`}>
                                    {h.puntaje > 0 ? `+${h.puntaje}` : '0'} pts
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </aside>
    )
}