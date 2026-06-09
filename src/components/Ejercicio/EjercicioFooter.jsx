import { useState } from 'react'
import AyudaPopup from './AyudaPopup'
import './EjercicioFooter.css'

const robotImg = {
  pendiente: '/robotTutorIA/robotSentado.png',
  correcto: '/robotTutorIA/robotCorrecto.png',
  incorrecto: '/robotTutorIA/robotIncorrecto.png',
}

export default function EjercicioFooter({ estado, onNuevoEjercicio, onIrDashboard, onPedirPista, pistaTexto, cargandoPista }) {
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [mostrarPista, setMostrarPista] = useState(false)
  const [cerrando, setCerrando] = useState(false)
  const [mostrarAviso, setMostrarAviso] = useState(false)

  const estadoConfig = {
    pendiente:  { color: '#f0ad4e', texto: 'Ejercicio sin completar' },
    correcto:   { color: '#4a5c3a', texto: 'Ejercicio correcto' },
    incorrecto: { color: '#c0392b', texto: 'Ejercicio incorrecto' },
  }
  const { color, texto } = estadoConfig[estado] || estadoConfig.pendiente

  const nuevoDeshabilitado = estado === 'incorrecto'

  function cerrarPista() {
    setCerrando(true)
    setTimeout(() => {
      setMostrarPista(false)
      setCerrando(false)
    }, 200)
  }

  function togglePista() {
    if (mostrarPista) {
      cerrarPista()
    } else {
      setMostrarPista(true)
      if (!pistaTexto) {
        onPedirPista() // Llama al backend si aún no hay pista generada
      }
    }
  }

  function handleNuevoClick() {
    if (nuevoDeshabilitado) {
      setMostrarAviso(true)
      setTimeout(() => setMostrarAviso(false), 2500)
    } else {
      onNuevoEjercicio()
    }
  }

  return (
      <div className="ej-footer">
        <div className="ej-footer__left">
          <img src={robotImg[estado] || robotImg.pendiente} alt="Tutor" className={`ej-footer__robot ej-footer__robot--${estado}`} />
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
                  <p className="ej-footer__pista-texto">
                    {cargandoPista ? 'TutorIA está analizando tu código...' : pistaTexto}
                  </p>
                </div>
            )}
            <button className={`ej-footer__btn ej-footer__btn--pista ${mostrarPista ? 'ej-footer__btn--pista-activo' : ''}`} onClick={togglePista}>
              Pedir pista
              <span className="ej-footer__pista-arrow">{mostrarPista ? '∨' : '∧'}</span>
            </button>
          </div>

          <div className="ej-footer__nuevo-wrapper">
            {mostrarAviso && (
                <div className="ej-footer__nuevo-tooltip">
                  Reintenta o genera un ejercicio de refuerzo primero
                </div>
            )}
            <button className={`ej-footer__btn ej-footer__btn--nuevo ${nuevoDeshabilitado ? 'ej-footer__btn--nuevo-disabled' : ''}`} onClick={handleNuevoClick}>
              <img src="/iconos/repetirIcono.png" alt="Nuevo" className="ej-footer__btn-icon" />
              Nuevo ejercicio del mismo nivel
            </button>
          </div>
        </div>

        <div className="ej-footer__right">
          <button className="ej-footer__link" onClick={onIrDashboard}>
            ← Ir al dashboard
          </button>
          <button className="ej-footer__ayuda" onClick={() => setMostrarAyuda(true)}>
            <img src="/iconos/interrogacionIcono.png" alt="Ayuda" className="ej-footer__ayuda-icon" />
            ¿Necesitas ayuda?
          </button>
        </div>

        {mostrarAyuda && <AyudaPopup onClose={() => setMostrarAyuda(false)} />}
      </div>
  )
}