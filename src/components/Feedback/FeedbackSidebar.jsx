import { feedbackData } from './feedbackData'
import './FeedbackSidebar.css'

export default function FeedbackSidebar() {
  const progresoModulo = (feedbackData.ejerciciosModulo / feedbackData.ejerciciosTotalModulo) * 100
  const progresoNivel  = (feedbackData.ejerciciosTotales / feedbackData.ejerciciosTotalesNivel) * 100

  return (
    <aside className="fb-sidebar">

      {/* Progreso módulo */}
      <div className="fb-sidebar__card">
        <h3 className="fb-sidebar__card-title">Progreso en el modulo</h3>
        <div className="fb-sidebar__dots">
          {Array.from({ length: feedbackData.ejerciciosTotalModulo }, (_, i) => (
            <span
              key={i}
              className={`fb-sidebar__dot ${i < feedbackData.ejerciciosModulo ? 'fb-sidebar__dot--done' : ''}`}
            />
          ))}
        </div>
        <p className="fb-sidebar__sub">
          {feedbackData.ejerciciosModulo}/{feedbackData.ejerciciosTotalModulo} Ejercicios del modulo completados
        </p>
      </div>

      {/* Progreso nivel */}
      <div className="fb-sidebar__card">
        <h3 className="fb-sidebar__card-title">Progreso hasta el proximo nivel</h3>
        <div className="fb-sidebar__barra">
          <div className="fb-sidebar__barra-fill" style={{ width: `${progresoNivel}%` }} />
        </div>
        <p className="fb-sidebar__sub">
          {feedbackData.ejerciciosTotales}/{feedbackData.ejerciciosTotalesNivel} Ejercicios totales completados
        </p>
        <p className="fb-sidebar__nivel">
          Nivel actual: <strong>{feedbackData.nivelActual}</strong>
        </p>
        <p className="fb-sidebar__nivel">
          Siguiente nivel: <strong className="fb-sidebar__nivel--next">{feedbackData.siguienteNivel}</strong>
        </p>
      </div>

      {/* Decisión tutor */}
      <div className="fb-sidebar__card">
        <h3 className="fb-sidebar__card-title">Decisión del tutor</h3>
        <div className="fb-sidebar__decision-lista">
          <p><strong>Resultado:</strong> {feedbackData.decision.resultado}</p>
          <p><strong>Intentos:</strong> {feedbackData.decision.intentos}</p>
          <p><strong>Nivel actual:</strong> {feedbackData.decision.nivelActual}</p>
          <p><strong>Decisión:</strong> {feedbackData.decision.accion}</p>
        </div>
        <div className="fb-sidebar__decision-box">
          <img src="/iAIcono.png" alt="IA" className="fb-sidebar__ia-icon" />
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
        {feedbackData.historial.length === 0 ? (
          <p className="fb-sidebar__vacio">Aún no hay ejercicios completados.</p>
        ) : (
          <ul className="fb-sidebar__historial">
            {feedbackData.historial.map((h, i) => (
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
