import { useNavigate } from 'react-router-dom'
import { userData } from './dashboardData'
import './DashboardNavbar.css'

export default function DashboardNavbar() {
  const navigate = useNavigate()

  return (
      <header className="db-navbar">
        <div
            className="db-navbar__logo"
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
        >
          <div className="db-navbar__logo-line">
            <span className="db-navbar__logo-tutor">Tutor</span>
            <span className="db-navbar__logo-ia">IA</span>
          </div>
          <span className="db-navbar__logo-sub">Code</span>
        </div>

        <div className="db-navbar__center">
          <button
              className="db-navbar__username"
              onClick={() => navigate('/perfil')}
          >
            {userData.nombre}
          </button>
          <p className="db-navbar__nivel">
            Nivel actual: <strong>{userData.nivel}</strong>
          </p>
          <div className="db-navbar__progress-bar">
            <div
                className="db-navbar__progress-fill"
                style={{ width: `${(userData.ejerciciosCompletados / userData.ejerciciosTotal) * 100}%` }}
            />
          </div>
          <p className="db-navbar__progress-text">
            {userData.ejerciciosCompletados} de {userData.ejerciciosTotal} ejercicios completados
          </p>
          <p className="db-navbar__lenguaje">
            Lenguaje de practica: <strong>{userData.lenguaje}</strong>
          </p>
        </div>

        <div className="db-navbar__sugerencia">
          <p className="db-navbar__sugerencia-title">Sugerencia del tutor</p>
          <div className="db-navbar__sugerencia-body">
            <img src="/iconos/programacionIcono.png" alt="Código" className="db-navbar__sugerencia-icon" />
            <p className="db-navbar__sugerencia-text">"{userData.sugerencia}"</p>
          </div>
        </div>
      </header>
  )
}