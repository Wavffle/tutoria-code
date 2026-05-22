import { feedbackData } from './feedbackData'
import './FeedbackHero.css'

export default function FeedbackHero() {
  return (
    <div className="fb-hero">
      <div className="fb-hero__left">
        <img src="/robotFeedback.png" alt="Robot" className="fb-hero__robot" />
        <div className="fb-hero__texto">
          <h1 className="fb-hero__titulo">¡Excelente trabajo!</h1>
          <p className="fb-hero__desc">
            Has completado correctamente el ejercicio.
            Aqui tienes la retroalimentacion de la IA para seguir aprendiendo.
          </p>
        </div>
      </div>
      <div className="fb-hero__puntaje">
        <div className="fb-hero__puntaje-circle">
          <span className="fb-hero__puntaje-num">{feedbackData.puntaje}%</span>
          <span className="fb-hero__puntaje-label">Puntaje</span>
        </div>
      </div>
    </div>
  )
}
