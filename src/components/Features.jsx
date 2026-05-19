import './Features.css'

export default function Features() {
  return (
    <section className="features">
      <div className="features__grid">

        {/* Card 1 — Ventajas */}
        <div className="feature-card">
          <span className="feature-card__tag">Ventajas</span>
          <h2 className="feature-card__title">¿Por qué usar TutorIA code?</h2>
          <ul className="feature-card__list">
            <li>
              <span className="feature-card__check" aria-hidden="true">✓</span>
              Retroalimentación automática en cada ejercicio
            </li>
            <li>
              <span className="feature-card__check" aria-hidden="true">✓</span>
              Dificultad adaptativa según tu nivel
            </li>
            <li>
              <span className="feature-card__check" aria-hidden="true">✓</span>
              Aprendizaje progresivo y guiado
            </li>
          </ul>

          {/* Image placeholder */}
          <div className="feature-card__image-placeholder" aria-label="Ilustración de estación de trabajo">
            <div className="placeholder__inner"></div>
          </div>
        </div>

        {/* Card 2 — Aprende */}
        <div className="feature-card">
          <span className="feature-card__tag">Aprende</span>
          <h2 className="feature-card__title">¿Como funciona?</h2>
          <ol className="feature-card__steps">
            <li>
              <span className="step-number">1.</span>
              Resuelve ejercicios
            </li>
            <li>
              <span className="step-number">2.</span>
              Recibe retroalimentación del tutor
            </li>
            <li>
              <span className="step-number">3.</span>
              Avanza según tu desempeño
            </li>
          </ol>

          {/* Image placeholder */}
          <div className="feature-card__image-placeholder" aria-label="Ilustración de IA">
            <div className="placeholder__inner"></div>
          </div>
        </div>

      </div>
    </section>
  )
}
