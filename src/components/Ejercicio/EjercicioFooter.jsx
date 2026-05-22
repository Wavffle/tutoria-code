import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AyudaPopup from './AyudaPopup'
import './EjercicioFooter.css'

const robotImg = {
  pendiente:  '/robotSentado.png',
  correcto:   '/robotCorrecto.png',
  incorrecto: '/robotIncorrecto.png',
}

export default function EjercicioFooter({ estado, onPedirPista, onNuevoEjercicio }) {
  const navigate = useNavigate()
  const [mostrarAyuda, setMostrarAyuda] = useState(false)

  const estadoConfig = {
    pendiente:  { color: '#f0ad4e', texto: 'Ejercicio sin completar' },
    correcto:   { color: '#4a5c3a', texto: 'Ejercicio correcto' },
    incorrecto: { color: '#c0392b', texto: 'Ejercicio incorrecto' },
  }
  const { color, texto } = estadoConfig[estado] || estadoConfig.pendiente

  return (
      <div className="ej-footer">
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

        <div className="ej-footer__center">
          <button className="ej-footer__btn ej-footer__btn--pista" onClick={onPedirPista}>
            <img src="/iconos/ampolletaIcono2.png" alt="Pista" className="ej-footer__btn-icon" />
            Pedir pista
          </button>
          <button className="ej-footer__btn ej-footer__btn--nuevo" onClick={onNuevoEjercicio}>
            <img src="/iconos/repetirIcono.png" alt="Nuevo" className="ej-footer__btn-icon" />
            Nuevo ejercicio del mismo nivel
          </button>
        </div>

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