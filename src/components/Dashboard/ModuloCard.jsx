import { useNavigate } from 'react-router-dom'
import './ModuloCard.css'

export default function ModuloCard({ modulo, onIAClick }) {
    const navigate = useNavigate()

    const ejerciciosSoloEjercicios = modulo.ejercicios.filter(e => e.tipo === 'ejercicio')

    function handleEjercicioClick(ejercicio) {
        if (ejercicio.tipo === 'ia') {
            onIAClick(modulo)
            return
        }
        if (ejercicio.estado === 'bloqueado') return

        const numeroEjercicio = ejerciciosSoloEjercicios.indexOf(ejercicio) + 1
        const totalEjercicios = ejerciciosSoloEjercicios.length

        navigate('/ejercicio', { state: { ejercicio, modulo, numeroEjercicio, totalEjercicios } })
    }

    return (
        <div className={`modulo-card ${!modulo.desbloqueado ? 'modulo-card--locked' : ''}`}>
            <div className="modulo-card__header">
                <div>
                    <h3 className="modulo-card__titulo">{modulo.titulo}</h3>
                    <p className="modulo-card__nivel">Nivel: {modulo.nivel}</p>
                </div>
                <span className="modulo-card__progreso">
          Progreso: {modulo.progreso}/{modulo.progresoTotal}
        </span>
            </div>

            <ul className="modulo-card__lista">
                {modulo.ejercicios.map((ej) => (
                    <li
                        key={ej.id}
                        className={`modulo-card__item modulo-card__item--${ej.estado}`}
                        onClick={() => handleEjercicioClick(ej)}
                    >
            <span className="modulo-card__item-icon">
              {ej.tipo === 'ia' && (
                  <img src="/iconos/iAIcono.png" alt="IA" className="modulo-card__ia-img" />
              )}
                {ej.tipo === 'ejercicio' && ej.estado === 'completado' && '✓'}
                {ej.tipo === 'ejercicio' && ej.estado === 'disponible' && '▶'}
                {ej.tipo === 'ejercicio' && ej.estado === 'bloqueado' && (
                    <img src="/iconos/candadoIcono.png" alt="Bloqueado" className="modulo-card__candado" />
                )}
            </span>
                        <span className="modulo-card__item-texto">{ej.texto}</span>
                        {ej.tipo === 'ia' && (
                            <button
                                className="modulo-card__info-btn"
                                onClick={(e) => { e.stopPropagation(); onIAClick(modulo) }}
                            >
                                <img src="/iconos/infoIcono.png" alt="Info" className="modulo-card__info-img" />
                            </button>
                        )}
                        {ej.tipo === 'ejercicio' && ej.estado !== 'bloqueado' && (
                            <span className="modulo-card__play-btn">▶</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}