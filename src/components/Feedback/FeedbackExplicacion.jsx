import { feedbackData } from './feedbackData'
import './FeedbackExplicacion.css'

export default function FeedbackExplicacion() {
  const { explicacion } = feedbackData

  return (
    <div className="fb-explicacion">
      <div className="fb-explicacion__header">
        <span className="fb-explicacion__code-icon">&lt;/&gt;</span>
        <h2 className="fb-explicacion__title">Explicación de la IA</h2>
      </div>

      <p className="fb-explicacion__intro">{explicacion.intro}</p>

      <ul className="fb-explicacion__lista">
        {explicacion.puntos.map((p, i) => (
          <li key={i}>
            <span className="fb-explicacion__check">✓</span>
            <span>
              {p.texto}
              {p.bold && <strong>{p.bold}</strong>}
              {p.texto2}
              {p.bold2 && <strong>{p.bold2}</strong>}
              {p.texto3}
              {!p.bold && !p.texto2 && p.texto}
            </span>
          </li>
        ))}
      </ul>

      <p className="fb-explicacion__recuerda">{explicacion.recuerda}</p>
    </div>
  )
}
