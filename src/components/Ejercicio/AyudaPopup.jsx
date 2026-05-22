import './AyudaPopup.css'

export default function AyudaPopup({ onClose }) {
  return (
    <div className="ayuda-overlay" onClick={onClose}>
      <div className="ayuda-modal" onClick={e => e.stopPropagation()}>

        <div className="ayuda-modal__header">
          <img src="/interrogacionIcono.png" alt="Ayuda" className="ayuda-modal__header-icon" />
          <div>
            <h2 className="ayuda-modal__titulo">¿Necesitas ayuda?</h2>
            <p className="ayuda-modal__subtitulo">La IA puede acompañarte en tu aprendizaje.</p>
          </div>
        </div>

        <p className="ayuda-modal__intro">
          Si tienes dudas o te está costando resolver el ejercicio, la IA de TutorIA
          puede ayudarte de diferentes formas:
        </p>

        <div className="ayuda-modal__cards">
          <div className="ayuda-modal__card">
            <img src="/ampolletaIcono2.png" alt="Pistas" className="ayuda-modal__card-icon ayuda-modal__card-icon--blue" />
            <div>
              <p className="ayuda-modal__card-titulo">Pistas guiadas</p>
              <p className="ayuda-modal__card-desc">Recibe pistas paso a paso para orientarte sin darte la solución directa.</p>
            </div>
          </div>
          <div className="ayuda-modal__card">
            <img src="/lupaIcono.png" alt="Revisión" className="ayuda-modal__card-icon" />
            <div>
              <p className="ayuda-modal__card-titulo">Revisión de errores</p>
              <p className="ayuda-modal__card-desc">Si tu código no funciona, la IA te ayudará a entender qué salió mal.</p>
            </div>
          </div>
          <div className="ayuda-modal__card">
            <img src="/puzzleIcono.png" alt="Refuerzo" className="ayuda-modal__card-icon" />
            <div>
              <p className="ayuda-modal__card-titulo">Ejercicios de refuerzo</p>
              <p className="ayuda-modal__card-desc">Si lo necesitas, te puede generar ejercicios para que practiques.</p>
            </div>
          </div>
        </div>

        <div className="ayuda-modal__consejos">
          <p className="ayuda-modal__consejos-titulo">Consejos si te está costando:</p>
          <ul className="ayuda-modal__consejos-lista">
            <li>Lee bien la descripción y el ejemplo de salida esperada.</li>
            <li>Piensa qué datos necesitas guardar y qué operación debes realizar.</li>
            <li>Prueba tu código por partes y verifica los resultados.</li>
            <li>Usa las pistas de la IA para avanzar sin frustrarte.</li>
          </ul>
        </div>

        <button className="ayuda-modal__btn" onClick={onClose}>
          Entendido
        </button>

      </div>
    </div>
  )
}
