import { useNavigate } from 'react-router-dom'
import './FeedbackAcciones.css'

export default function FeedbackAcciones() {
  const navigate = useNavigate()

  return (
    <div className="fb-acciones">
      <h2 className="fb-acciones__title">¿Qué quieres hacer ahora?</h2>
      <div className="fb-acciones__grid">

        <button className="fb-acciones__btn" onClick={() => navigate('/dashboard')}>
          <img src="/dashboardIcon.png" alt="Dashboard" className="fb-acciones__btn-icon" />
          <div>
            <p className="fb-acciones__btn-titulo">Volver al dashboard</p>
            <p className="fb-acciones__btn-desc">Revisa tu progreso y escoge un desafío</p>
          </div>
        </button>

        <button className="fb-acciones__btn fb-acciones__btn--siguiente" onClick={() => navigate('/ejercicio')}>
          <img src="/siguienteEjercicio.png" alt="Siguiente" className="fb-acciones__btn-icon" />
          <div>
            <p className="fb-acciones__btn-titulo">Ir al siguiente ejercicio</p>
            <p className="fb-acciones__btn-desc">Sigue practicando una tematica diferente</p>
          </div>
        </button>

        <button className="fb-acciones__btn fb-acciones__btn--repetir" onClick={() => navigate('/ejercicio')}>
          <img src="/repetirIcono.png" alt="Repetir" className="fb-acciones__btn-icon" />
          <div>
            <p className="fb-acciones__btn-titulo">Repetir ejercicio</p>
            <p className="fb-acciones__btn-desc">Repite el ejercicio con cambios en base a tu nivel</p>
          </div>
        </button>

      </div>
    </div>
  )
}
