import { perfilData } from './perfilData'
import './PerfilInfo.css'

export default function PerfilInfo() {
  return (
    <div className="perfil-info">

      {/* Izquierda — datos del usuario */}
      <div className="perfil-info__left">
        <h1 className="perfil-info__nombre">
          {perfilData.nombre} {perfilData.apellido}
        </h1>
        <p className="perfil-info__nivel">
          Nivel actual: <strong>{perfilData.nivelActual}</strong>
        </p>
        <div className="perfil-info__barra-wrap">
          <div className="perfil-info__barra">
            <div
                className="perfil-info__barra-fill"
                style={{ width: `${(perfilData.puntos / perfilData.puntosParaSiguienteNivel) * 100}%` }}
            />
          </div>
        </div>
        <p className="perfil-info__siguiente">
          {perfilData.puntos}/{perfilData.puntosParaSiguienteNivel} puntos para subir a {perfilData.siguienteNivel}
        </p>

        <div className="perfil-info__tutor-box">
          <img src="/logos/logoAvatar.png" alt="TutorIA" className="perfil-info__tutor-img" />
          <div>
            <p className="perfil-info__tutor-title">TutorIA te acompaña</p>
            <p className="perfil-info__tutor-desc">
              Generamos ejercicios adaptados a tu nivel, desempeño y objetivos de aprendizaje.
            </p>
          </div>
        </div>
      </div>

      {/* Derecha — estadísticas */}
      <div className="perfil-info__right">
        <div className="perfil-info__stats">
          <div className="perfil-info__stat perfil-info__stat--border">
            <p className="perfil-info__stat-label">Modulos completados</p>
            <p className="perfil-info__stat-value perfil-info__stat-value--green">
              {perfilData.modulosCompletados}/{perfilData.modulosTotal}
            </p>
            <p className="perfil-info__stat-sub">{perfilData.porcentajeCurso}% del curso</p>
          </div>
          <div className="perfil-info__stat">
            <p className="perfil-info__stat-label">Ejercicios resueltos</p>
            <p className="perfil-info__stat-value perfil-info__stat-value--orange">
              {perfilData.ejerciciosResueltos}
            </p>
            <p className="perfil-info__stat-sub">En total</p>
          </div>
          <div className="perfil-info__stat perfil-info__stat--full">
            <p className="perfil-info__stat-label">Tiempo de practica</p>
            <p className="perfil-info__stat-value perfil-info__stat-value--blue">
              {perfilData.tiempoPractica} h.
            </p>
            <p className="perfil-info__stat-sub">En total</p>
          </div>
        </div>
      </div>

    </div>
  )
}
