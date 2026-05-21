import { useState } from 'react'
import './Demo.css'

const defaultCode = `def suma (a, b):
    return a + b`

export default function Demo() {
  const [code, setCode] = useState(defaultCode)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="demo">
      <div className="demo__inner">

        {/* Code editor panel */}
        <div className="demo__editor">
          <div className="demo__editor-header">
            <span className="demo__dot demo__dot--red" />
            <span className="demo__dot demo__dot--yellow" />
            <span className="demo__dot demo__dot--green" />
          </div>
          <div className="demo__editor-body">
            <div className="demo__line-numbers" aria-hidden="true">
              {code.split('\n').map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              className="demo__code-area"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              aria-label="Editor de código"
            />
          </div>
          <div className="demo__editor-footer">
            <button
              className="btn btn--primary demo__submit-btn"
              onClick={handleSubmit}
            >
              Enviar
            </button>
          </div>
        </div>

        {/* Tutor feedback panel */}
        <div className="demo__tutor">
          <div className={`demo__bubble ${submitted ? 'demo__bubble--visible' : ''}`}>
            <p className="demo__bubble-good">¡Buena trabajo!</p>
            <p className="demo__bubble-suggestion">
              <strong>Sugerencia:</strong> prueba a validar tipos de entrada
            </p>
          </div>

          {/* Robot image placeholder */}
          <img src="/robot1.png" alt="Robot tutor" className="demo__robot-img" />
        </div>

      </div>
    </section>
  )
}
