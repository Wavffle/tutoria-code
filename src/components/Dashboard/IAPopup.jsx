import './IAPopup.css'

export default function IAPopup({ modulo, onClose }) {
  if (!modulo) return null

  return (
      <div className="ia-popup__overlay" onClick={onClose}>
        <div className="ia-popup__modal" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="ia-popup__header">
            <img src="/iconos/cerebroIcon.png" alt="IA" className="ia-popup__cerebro" />
            <h2 className="ia-popup__title">Practicas generadas por IA</h2>
          </div>

          {/* Descripción */}
          <p className="ia-popup__desc">
            TutorIA Code utiliza un modelo de lenguaje (LLM) para crear ejercicios
            de programación según:
          </p>

          {/* Lista con checks */}
          <ul className="ia-popup__lista">
            <li><span className="ia-popup__check">✓</span> El modulo que estás estudiando.</li>
            <li><span className="ia-popup__check">✓</span> El titulo del ejercicio.</li>
            <li><span className="ia-popup__check">✓</span> Tu nivel actual.</li>
            <li><span className="ia-popup__check">✓</span> Tus intentos anteriores y errores detectados.</li>
          </ul>

          {/* Box roles */}
          <div className="ia-popup__roles">
            <div className="ia-popup__role">
              <img src="/iconos/siluetaIcon.png" alt="TutorIA" className="ia-popup__role-icon" />
              <p><strong>TutorIA (el sistema)</strong> define tu nivel, las reglas de avance y tu progreso.</p>
            </div>
            <div className="ia-popup__role">
              <img src="/logos/ollamaLogo.png" alt="LLM" className="ia-popup__role-icon" />
              <p><strong>El LLM (IA)</strong> genera el ejercicio, analiza tu respuesta y redacta el feedback</p>
            </div>
          </div>

          {/* Info box */}
          <div className="ia-popup__infobox">
            <img src="/iconos/infoIcono.png" alt="Info" className="ia-popup__infobox-icon" />
            <p>
              <span className="ia-popup__infobox-highlight">
                Cada vez que realizas una práctica, TutorIA puede generar una versión diferente
              </span>
              {' '}del ejercicio para ayudarte a seguir aprendiendo.
            </p>
          </div>

          {/* Botón */}
          <button className="ia-popup__btn" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
  )
}