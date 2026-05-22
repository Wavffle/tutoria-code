import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PerfilAcciones.css'

export default function PerfilAcciones() {
  const navigate = useNavigate()
  const [mostrarConfirm, setMostrarConfirm] = useState(false)

  function handleCerrarSesion() {
    navigate('/')
  }

  return (
      <div className="perfil-acciones">
        <div className="perfil-acciones__botones">
          <button
              className="perfil-acciones__btn perfil-acciones__btn--dashboard"
              onClick={() => navigate('/dashboard')}
          >
            <img src="/iconos/dashboardIcon.png" alt="Dashboard" className="perfil-acciones__btn-img" />
            Volver al dashboard
          </button>
          <button
              className="perfil-acciones__btn perfil-acciones__btn--salir"
              onClick={() => setMostrarConfirm(true)}
          >
            <img src="/iconos/cerrarIcon.png" alt="Cerrar sesión" className="perfil-acciones__btn-img" />
            Cerrar sesión
          </button>
        </div>

        <div className="perfil-acciones__infobox">
          <img src="/iconos/cerebroIcon.png" alt="IA" className="perfil-acciones__infobox-icon" />
          <p className="perfil-acciones__infobox-text">
            Recuerda que cada practica puede cambiar. Si repites un ejercicio,
            TutorIA genera uno nuevo segun tu nivel y errores para reforzar lo que más necesitas.
          </p>
        </div>

        {/* Modal de confirmación */}
        {mostrarConfirm && (
            <div className="perfil-acciones__overlay" onClick={() => setMostrarConfirm(false)}>
              <div className="perfil-acciones__modal" onClick={e => e.stopPropagation()}>
                <p className="perfil-acciones__modal-title">¿Cerrar sesión?</p>
                <p className="perfil-acciones__modal-desc">
                  ¿Estás seguro de que quieres cerrar sesión? Serás redirigido a la pantalla de inicio de TutorIA.
                </p>
                <div className="perfil-acciones__modal-btns">
                  <button
                      className="perfil-acciones__modal-btn perfil-acciones__modal-btn--cancel"
                      onClick={() => setMostrarConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                      className="perfil-acciones__modal-btn perfil-acciones__modal-btn--confirm"
                      onClick={handleCerrarSesion}
                  >
                    Sí, cerrar sesión
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}