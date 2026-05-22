import { feedbackData } from './feedbackData'
import './FeedbackResumen.css'

function MiniEditor({ code, titulo, check }) {
  const lines = code.split('\n')
  return (
    <div className="fb-mini-editor">
      <p className="fb-mini-editor__titulo">
        {titulo} {check && <span className="fb-mini-editor__check">✓</span>}
      </p>
      <div className="fb-mini-editor__body">
        <div className="fb-mini-editor__lines">
          {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
        </div>
        <pre className="fb-mini-editor__code">{code}</pre>
      </div>
    </div>
  )
}

export default function FeedbackResumen() {
  return (
    <div className="fb-resumen">
      <h2 className="fb-resumen__title">Resumen de tu solución</h2>

      <div className="fb-resumen__grid">
        <MiniEditor
          code={feedbackData.codigoEstudiante}
          titulo="Tu código"
        />
        <MiniEditor
          code={feedbackData.codigoSolucion}
          titulo="Solución esperada"
          check
        />
      </div>

      <div className="fb-resumen__mensaje">
        <span className="fb-resumen__check">✓</span>
        <p>
          <span className="fb-resumen__msg-verde">Tu solución es correcta.</span>
          {' '}<strong>{feedbackData.mensajeResumen.replace('Tu solución es correcta. ', '')}</strong>
        </p>
      </div>
    </div>
  )
}
