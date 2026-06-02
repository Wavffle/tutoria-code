import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AyudaPopup from './AyudaPopup'
import { ejercicioData } from './ejercicioData'
import './EjercicioFooter.css'

const robotImg = {
  pendiente:  '/robotTutorIA/robotSentado.png',
  correcto:   '/robotTutorIA/robotCorrecto.png',
  incorrecto: '/robotTutorIA/robotIncorrecto.png',
}

export default function EjercicioFooter({ estado, onNuevoEjercicio }) {
  const navigate = useNavigate()
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [mostrarPista, setMostrarPista] = useState(false)
  const [cerrando, setCerrando] = useState(false)

  const estadoConfig = {
    pendiente:  { color: '#f0ad4e', texto: 'Ejercicio sin completar' },
    correcto:   { color: '#4a5c3a', texto: 'Ejercicio correcto' },
    incorrecto: { color: '#c0392b', texto: 'Ejercicio incorrecto' },
  }
  const { color, texto } = estadoConfig[estado] || estadoConfig.pendiente

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
    }
  }

  return (
      <div className="ej-footer">

        {/* Left */}
        <div className="ej-footer__left">
          <img
              src={robotImg[estado] || robotImg.pendiente}
              alt="Tutor"
              className={`ej-footer__robot ej-footer__robot--${estado}`}
          />
          <span className="ej-footer__label">Tutor IA</span>
          <span className="ej-footer__dot" style={{ backgroundColor: color }} />
          <span className="ej-footer__estado" style={{ color }}>{texto}</span>
        </div>

        {/* Center */}
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
                  <p className="ej-footer__pista-texto">{ejercicioData.pistaBton}</p>
                </div>
            )}
            <button
                className={`ej-footer__btn ej-footer__btn--pista ${mostrarPista ? 'ej-footer__btn--pista-activo' : ''}`}
                onClick={togglePista}
            >
              Pedir pista
              <span className="ej-footer__pista-arrow">{mostrarPista ? '∨' : '∧'}</span>
            </button>
          </div>
          <button className="ej-footer__btn ej-footer__btn--nuevo" onClick={onNuevoEjercicio}>
            <img src="/iconos/repetirIcono.png" alt="Nuevo" className="ej-footer__btn-icon" />
            Nuevo ejercicio del mismo nivel
          </button>
        </div>

        {/* Right */}
        <div className="ej-footer__right">
          <button className="ej-footer__link" onClick={() => navigate('/dashboard')}>
            ← Ir al dashboard
          </button>
          <button className="ej-footer__ayuda" onClick={() => setMostrarAyuda(true)}>
            <img src="/iconos/interrogacionIcono.png" alt="Ayuda" className="ej-footer__ayuda-icon" />
            ¿Necesitas ayuda?
          </button>
        </div>

        {mostrarAyuda && (
            <AyudaPopup onClose={() => setMostrarAyuda(false)} />
        )}
      </div>
  )
}