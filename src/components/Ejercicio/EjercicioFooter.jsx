import { useState, useEffect } from 'react'
import AyudaPopup from './AyudaPopup'
import './EjercicioFooter.css'

const robotImg = {
  pendiente: '/robotTutorIA/robotSentado.png',
  correcto: '/robotTutorIA/robotCorrecto.png',
  incorrecto: '/robotTutorIA/robotIncorrecto.png',
}

export default function EjercicioFooter({ estado, onNuevoEjercicio, onIrDashboard, onPedirPista, pistaTexto, cargandoPista, cargandoEvaluacion, cargandoIA }) {
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [mostrarPista, setMostrarPista] = useState(false)
  const [cerrando, setCerrando] = useState(false)
  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [robotSrc, setRobotSrc] = useState(robotImg[estado] || robotImg.pendiente)
  const [robotFading, setRobotFading] = useState(false)

  useEffect(() => {
    const nuevaSrc = robotImg[estado] || robotImg.pendiente
    if (nuevaSrc === robotSrc) return
    setRobotFading(true)
    const timer = setTimeout(() => {
      setRobotSrc(nuevaSrc)
      setRobotFading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [estado])

  useEffect(() => {
    if (!pistaTexto) {
      setMostrarPista(false)
    }
  }, [pistaTexto])

  const estadoConfig = {
    pendiente:  { color: '#b07801', texto: 'Ejercicio sin completar' },
    correcto:   { color: '#4a5c3a', texto: 'Ejercicio correcto' },
    incorrecto: { color: '#c0392b', texto: 'Ejercicio incorrecto' },
  }
  const { color, texto } = estadoConfig[estado] || estadoConfig.pendiente
  const nuevoDeshabilitado = estado === 'incorrecto' || estado === 'correcto' || cargandoEvaluacion || cargandoIA
  const pistaDeshabilitada = cargandoIA || cargandoPista

  function cerrarPista() {
    setCerrando(true)
    setTimeout(() => { setMostrarPista(false); setCerrando(false) }, 200)
  }

  function togglePista() {
    if (mostrarPista) {
      cerrarPista()
    } else {
      setMostrarPista(true)
      if (!pistaTexto?.texto) onPedirPista()
    }
  }

  function handleNuevoClick() {
    if (nuevoDeshabilitado) {
      if (!cargandoIA && !cargandoEvaluacion) {
        setMostrarAviso(true)
        setTimeout(() => setMostrarAviso(false), 2500)
      }
    } else {
      onNuevoEjercicio()
    }
  }

  return (
      <div className="ej-footer">
        <div className="ej-footer__left">
          <img
              src={robotSrc}
              alt="Tutor"
              className={`ej-footer__robot ej-footer__robot--${estado} ${robotFading ? 'ej-footer__robot--fading' : ''}`}
          />
          <span className="ej-footer__label">Tutor IA</span>
          <span className="ej-footer__dot" style={{ backgroundColor: color }} />
          <span className="ej-footer__estado" style={{ color }}>{texto}</span>
        </div>

        <div className="ej-footer__center">
          <div className="ej-footer__pista-wrapper">
            {mostrarPista && (
                <div className={`ej-footer__pista-panel ${cerrando ? 'ej-footer__pista-panel--saliendo' : ''}`}>
                  <div className="ej-footer__pista-header">
                    <div className="ej-footer__pista-label">
                      <img src="/iconos/ampolletaIcono2.png" alt="Pista" className="ej-footer__pista-label-icon" />
                      <span>Pista</span>
                    </div>
                  </div>
                  {cargandoPista ? (
                      <p className="ej-footer__pista-texto">TutorIA está analizando el ejercicio...</p>
                  ) : pistaTexto?.texto ? (
                      <>
                        <p className="ej-footer__pista-texto">{pistaTexto.texto}</p>
                        {pistaTexto.codigo && (
                            <pre className="ej-footer__pista-codigo">{pistaTexto.codigo}</pre>
                        )}
                      </>
                  ) : (
                      <p className="ej-footer__pista-texto">No se pudo generar la pista. Intenta de nuevo.</p>
                  )}
                </div>
            )}
            <button
                className={`ej-footer__btn ej-footer__btn--pista ${mostrarPista ? 'ej-footer__btn--pista-activo' : ''} ${pistaDeshabilitada ? 'ej-footer__btn--nuevo-disabled' : ''}`}
                onClick={!pistaDeshabilitada ? togglePista : undefined}
            >
              Pedir pista
              <span className="ej-footer__pista-arrow">{mostrarPista ? '∨' : '∧'}</span>
            </button>
          </div>

          <div className="ej-footer__nuevo-wrapper">
            {mostrarAviso && (
                <div className="ej-footer__nuevo-tooltip">
                  {estado === 'correcto' ? 'Continúa al feedback para ver tu resultado' : 'Reintenta o genera un ejercicio de refuerzo primero'}
                </div>
            )}
            <button
                className={`ej-footer__btn ej-footer__btn--nuevo ${nuevoDeshabilitado ? 'ej-footer__btn--nuevo-disabled' : ''}`}
                onClick={handleNuevoClick}
            >
              <img src="/iconos/repetirIcono.png" alt="Nuevo" className="ej-footer__btn-icon" />
              Nuevo ejercicio del mismo nivel
            </button>
          </div>
        </div>

        <div className="ej-footer__right">
          <button className="ej-footer__link" onClick={onIrDashboard}>← Ir al dashboard</button>
          <button className="ej-footer__ayuda" onClick={() => setMostrarAyuda(true)}>
            <img src="/iconos/interrogacionIcono.png" alt="Ayuda" className="ej-footer__ayuda-icon" />
            ¿Necesitas ayuda?
          </button>
        </div>

        {mostrarAyuda && <AyudaPopup onClose={() => setMostrarAyuda(false)} />}
      </div>
  )
}