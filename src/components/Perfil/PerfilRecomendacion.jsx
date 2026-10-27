import { useNavigate } from 'react-router-dom'
import { useEstudiante } from '../../context/EstudianteContext'
import { MODULOS_DEF } from '../Dashboard/dashboardData'
import './PerfilRecomendacion.css'

const MODULO_ID = {
    'variables_basicas': 1,
    'condicionales': 2,
    'bucles_repeticion': 3
}

export default function PerfilRecomendacion() {
    const navigate = useNavigate()
    const { recomendacion } = useEstudiante()

    function handleIrAhora() {
        if (!recomendacion?.modulo_recomendado || !recomendacion?.ejercicio_recomendado) {
            navigate('/dashboard')
            return
        }

        const moduloId = MODULO_ID[recomendacion.modulo_recomendado]
        const moduloDef = MODULOS_DEF.find(m => m.id === moduloId)
        if (!moduloDef) { navigate('/dashboard'); return }

        const ejercicio = moduloDef.ejercicios.find(
            e => e.tipo === 'ejercicio' && e.texto === recomendacion.ejercicio_recomendado
        )
        if (!ejercicio) { navigate('/dashboard'); return }

        const soloEjercicios = moduloDef.ejercicios.filter(e => e.tipo === 'ejercicio')
        const numeroEjercicio = soloEjercicios.indexOf(ejercicio) + 1

        navigate('/ejercicio', {
            state: {
                ejercicio,
                modulo: moduloDef,
                numeroEjercicio,
                totalEjercicios: soloEjercicios.length,
                esRepeticion: false
            }
        })
    }

    return (
        <div className="recomendacion">
            <h2 className="recomendacion__title">Recomendación TutorIA</h2>
            <div className="recomendacion__body">
                <img src="/robotTutorIA/robotLampara.png" alt="TutorIA recomienda" className="recomendacion__robot" />
                <div className="recomendacion__texto-wrap">
                    <p className="recomendacion__texto">
                        {recomendacion?.texto
                            ? recomendacion.texto
                            : '¡Completa tu primer ejercicio para recibir recomendaciones personalizadas de TutorIA!'
                        }
                    </p>
                    {recomendacion?.ejercicio_recomendado && (
                        <p className="recomendacion__ejercicio">
                            Ejercicio sugerido: <strong>{recomendacion.ejercicio_recomendado}</strong>
                        </p>
                    )}
                    <button
                        className="recomendacion__btn"
                        onClick={handleIrAhora}
                        disabled={!recomendacion}
                    >
                        Ir ahora →
                    </button>
                </div>
            </div>
        </div>
    )
}