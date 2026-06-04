import { useState } from 'react'
import './IAPopup.css'

export default function IAPopup({ modulo, onClose }) {
  const [cerrando, setCerrando] = useState(false)

  if (!modulo) return null

  function handleClose() {
    setCerrando(true)
    setTimeout(() => onClose(), 200)
  }

  return (
      <div className={`ia-popup__overlay ${cerrando ? 'ia-popup__overlay--saliendo' : ''}`} onClick={handleClose}>
        <div className={`ia-popup__modal ${cerrando ? 'ia-popup__modal--saliendo' : ''}`} onClick={e => e.stopPropagation()}>

          <div className="ia-popup__header">
            <img src="/iconos/cerebroIcon.png" alt="IA" className="ia-popup__cerebro" />
            <h2 className="ia-popup__title">Practicas generadas por IA</h2>
          </div>

          <p className="ia-popup__desc">
            TutorIA Code utiliza un modelo de lenguaje (LLM) para crear ejercicios
            de programación según:
          </p>

          <ul className="ia-popup__lista">
            <li><span className="ia-popup__check">✓</span> El modulo que estás estudiando.</li>
            <li><span className="ia-popup__check">✓</span> El titulo del ejercicio.</li>
            <li><span className="ia-popup__check">✓</span> Tu nivel actual.</li>
            <li><span className="ia-popup__check">✓</span> Tus intentos anteriores y errores detectados.</li>
          </ul>

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

          <div className="ia-popup__infobox">
            <img src="/iconos/infoIcono.png" alt="Info" className="ia-popup__infobox-icon" />
            <p>
              <span className="ia-popup__infobox-highlight">
                Cada vez que realizas una práctica, TutorIA puede generar una versión diferente
              </span>
              {' '}del ejercicio para ayudarte a seguir aprendiendo.
            </p>
          </div>

          <button className="ia-popup__btn" onClick={handleClose}>
            Entendido
          </button>
        </div>
      </div>
  )
}