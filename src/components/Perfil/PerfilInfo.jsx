import { useEstudiante } from '../../context/EstudianteContext'
import { useState, useEffect } from 'react'
import './PerfilInfo.css'

const PUNTOS_PARA_NIVEL = { 1: 500, 2: 750, 3: 1000 }
const NOMBRE_SIGUIENTE = { 1: 'INTERMEDIO', 2: 'AVANZADO', 3: '—' }
const TOTAL_MODULOS = 3

export default function PerfilInfo() {
  const { estudiante } = useEstudiante()
  const [modulosCompletados, setModulosCompletados] = useState(0)

  useEffect(() => {
    if (!estudiante) return

    async function cargarModulos() {
      try {
        const res = await fetch(`http://localhost:3001/api/estudiantes/${estudiante.id}/modulos`)
        const data = await res.json()
        if (data.success) {
          setModulosCompletados(data.modulos.length)
        }
      } catch (error) {
        console.error('Error al cargar módulos:', error)
      }
    }

    cargarModulos()
  }, [estudiante])

  if (!estudiante) return null

  const puntosParaSiguiente = PUNTOS_PARA_NIVEL[estudiante.nivel_actual] ?? 1000
  const siguienteNivel = NOMBRE_SIGUIENTE[estudiante.nivel_actual] ?? '—'
  const porcentajeBarra = Math.min((estudiante.progreso_nivel / puntosParaSiguiente) * 100, 100)

  return (
      <div className="perfil-info">
        <div className="perfil-info__left">
          <h1 className="perfil-info__nombre">
            {estudiante.nombre} {estudiante.apellido}
          </h1>
          <p className="perfil-info__nivel">
            Nivel actual: <strong>{estudiante.nivelTexto?.toUpperCase()}</strong>
          </p>
          <div className="perfil-info__barra-wrap">
            <div className="perfil-info__barra">
              <div
                  className="perfil-info__barra-fill"
                  style={{ width: `${porcentajeBarra}%` }}
              />
            </div>
          </div>
          <p className="perfil-info__siguiente">
            {estudiante.progreso_nivel}/{puntosParaSiguiente} puntos para subir a {siguienteNivel}
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

        <div className="perfil-info__right">
          <div className="perfil-info__stats">
            <div className="perfil-info__stat perfil-info__stat--border">
              <p className="perfil-info__stat-label">Módulos completados</p>
              <p className="perfil-info__stat-value perfil-info__stat-value--green">
                {modulosCompletados}/{TOTAL_MODULOS}
              </p>
              <p className="perfil-info__stat-sub">Del curso</p>
            </div>
            <div className="perfil-info__stat">
              <p className="perfil-info__stat-label">Ejercicios resueltos</p>
              <p className="perfil-info__stat-value perfil-info__stat-value--orange">
                {estudiante.ejercicios_correctos}
              </p>
              <p className="perfil-info__stat-sub">En total</p>
            </div>
            <div className="perfil-info__stat perfil-info__stat--full">
              <p className="perfil-info__stat-label">Tiempo de práctica</p>
              <p className="perfil-info__stat-value perfil-info__stat-value--blue">
                {((estudiante.tiempo_total_segundos ?? 0) / 3600).toFixed(1)} h.
              </p>
              <p className="perfil-info__stat-sub">En total</p>
            </div>
          </div>
        </div>
      </div>
  )
}