import './FeedbackSidebar.css'

export default function FeedbackSidebar({ data }) {
    if (!data) return null;

    return (
        <aside className="fb-sidebar">
            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Progreso en el modulo</h3>
                <div className="fb-sidebar__dots">
                    {Array.from({ length: data.ejerciciosTotalModulo || 5 }, (_, i) => (
                        <span
                            key={i}
                            className={`fb-sidebar__dot ${i < (data.ejerciciosModulo || 0) ? 'fb-sidebar__dot--done' : ''}`}
                        />
                    ))}
                </div>
                <p className="fb-sidebar__sub">
                    {data.ejerciciosModulo}/{data.ejerciciosTotalModulo} Ejercicios del modulo completados
                </p>
            </div>

            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Progreso hasta el proximo nivel</h3>
                <div className="fb-sidebar__barra">
                    <div className="fb-sidebar__barra-fill" style={{ width: `${((data.puntosActuales || 0) / (data.puntosParaSiguienteNivel || 1)) * 100}%` }} />
                </div>
                <p className="fb-sidebar__sub">
                    {data.puntosActuales}/{data.puntosParaSiguienteNivel} Puntos totales
                </p>
                <p className="fb-sidebar__nivel">
                    Nivel actual: <strong>{data.nivelActual}</strong>
                </p>
                <p className="fb-sidebar__nivel">
                    Siguiente nivel: <strong className="fb-sidebar__nivel--next">{data.siguienteNivel}</strong>
                </p>
            </div>

            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Decisión del tutor</h3>
                <div className="fb-sidebar__decision-lista">
                    <p><strong>Resultado:</strong> {data.decision?.resultado}</p>
                    <p><strong>Intentos:</strong> {data.decision?.intentos}</p>
                    <p><strong>Nivel actual:</strong> {data.decision?.nivelActual}</p>
                    <p><strong>Decisión:</strong> {data.decision?.accion}</p>
                </div>
                <div className="fb-sidebar__decision-box">
                    <img src="/iconos/iAIcono.png" alt="IA" className="fb-sidebar__ia-icon" />
                    <p>{data.decision?.mensaje}</p>
                </div>
            </div>

            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Conceptos clave reforzados</h3>
                <ul className="fb-sidebar__conceptos">
                    {data.conceptos?.map((c, i) => (
                        <li key={i}>
                            <span className="fb-sidebar__check">✓</span> {c}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="fb-sidebar__card">
                <h3 className="fb-sidebar__card-title">Historial reciente</h3>
                {!data.historial || data.historial.length === 0 ? (
                    <p className="fb-sidebar__vacio">Aún no hay ejercicios completados.</p>
                ) : (
                    <ul className="fb-sidebar__historial">
                        {data.historial.map((h, i) => (
                            <li key={i} className="fb-sidebar__historial-item">
                <span className={`fb-sidebar__historial-check ${h.resultado > 0 ? 'fb-sidebar__historial-check--done' : ''}`}>
                  {h.resultado > 0 ? '✓' : '○'}
                </span>
                                <div className="fb-sidebar__historial-info">
                                    <p className="fb-sidebar__historial-nombre">{h.ejercicio}</p>
                                    <p className="fb-sidebar__historial-tiempo">{h.tiempo}</p>
                                </div>
                                <span className={`fb-sidebar__historial-pct ${h.resultado > 0 ? 'fb-sidebar__historial-pct--done' : ''}`}>
                  {h.resultado}%
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    )
}