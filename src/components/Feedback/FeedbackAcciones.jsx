import { useNavigate } from 'react-router-dom'
import { MODULOS_DEF } from '../Dashboard/dashboardData'
import { useEstudiante } from '../../context/EstudianteContext'
import './FeedbackAcciones.css'

export default function FeedbackAcciones({ ejercicio, modulo, numeroEjercicio, totalEjercicios }) {
    const navigate = useNavigate()
    const { estudiante } = useEstudiante()

    function handleSiguiente() {
        // Encontrar el módulo actual en la definición
        const moduloDef = MODULOS_DEF.find(m => m.id === modulo?.id)
        if (!moduloDef) { navigate('/dashboard'); return }

        // Solo ejercicios reales, sin los de IA
        const ejercicios = moduloDef.ejercicios.filter(e => e.tipo === 'ejercicio')
        const indexActual = ejercicios.findIndex(e => e.id === ejercicio?.id)

        // Buscar siguiente ejercicio en el mismo módulo
        const siguienteEnModulo = ejercicios[indexActual + 1]

        if (siguienteEnModulo) {
            navigate('/ejercicio', {
                state: {
                    ejercicio: siguienteEnModulo,
                    modulo,
                    numeroEjercicio: indexActual + 2,
                    totalEjercicios: ejercicios.length,
                    esRepeticion: false
                }
            })
            return
        }

        // No hay siguiente en este módulo — buscar el primer ejercicio del siguiente módulo
        const NIVELES = ['Basico', 'Intermedio', 'Avanzado']
        const nivelEstudiante = estudiante?.nivelTexto ?? 'Basico'

        const indexModuloActual = MODULOS_DEF.findIndex(m => m.id === modulo?.id)
        const siguienteModulo = MODULOS_DEF[indexModuloActual + 1]

        if (!siguienteModulo) {
            // Ya completó todos los módulos
            navigate('/dashboard')
            return
        }

        // Verificar si el estudiante tiene el nivel para el siguiente módulo
        const puedeAcceder = NIVELES.indexOf(nivelEstudiante) >= NIVELES.indexOf(siguienteModulo.nivelMinimo)

        if (!puedeAcceder) {
            navigate('/dashboard')
            return
        }

        const ejerciciosSiguienteModulo = siguienteModulo.ejercicios.filter(e => e.tipo === 'ejercicio')
        const primerEjercicio = ejerciciosSiguienteModulo[0]

        if (!primerEjercicio) { navigate('/dashboard'); return }

        navigate('/ejercicio', {
            state: {
                ejercicio: primerEjercicio,
                modulo: siguienteModulo,
                numeroEjercicio: 1,
                totalEjercicios: ejerciciosSiguienteModulo.length,
                esRepeticion: false
            }
        })
    }

    function handleRepetir() {
        navigate('/ejercicio', {
            state: { ejercicio, modulo, numeroEjercicio, totalEjercicios, esRepeticion: true }
        })
    }

    return (
        <div className="fb-acciones">
            <h2 className="fb-acciones__title">¿Qué quieres hacer ahora?</h2>
            <div className="fb-acciones__grid">
                <button className="fb-acciones__btn" onClick={() => navigate('/dashboard')}>
                    <img src="/iconos/dashboardIcon.png" alt="Dashboard" className="fb-acciones__btn-icon" />
                    <div>
                        <p className="fb-acciones__btn-titulo">Volver al dashboard</p>
                        <p className="fb-acciones__btn-desc">Revisa tu progreso y escoge un desafío</p>
                    </div>
                </button>
                <button className="fb-acciones__btn fb-acciones__btn--siguiente" onClick={handleSiguiente}>
                    <img src="/iconos/siguienteEjercicio.png" alt="Siguiente" className="fb-acciones__btn-icon" />
                    <div>
                        <p className="fb-acciones__btn-titulo">Ir al siguiente ejercicio</p>
                        <p className="fb-acciones__btn-desc">Sigue practicando una tematica diferente</p>
                    </div>
                </button>
                <button className="fb-acciones__btn fb-acciones__btn--repetir" onClick={handleRepetir}>
                    <img src="/iconos/repetirIcono.png" alt="Repetir" className="fb-acciones__btn-icon" />
                    <div>
                        <p className="fb-acciones__btn-titulo">Repetir ejercicio</p>
                        <p className="fb-acciones__btn-desc">Repite el ejercicio con cambios en base a tu nivel</p>
                    </div>
                </button>
            </div>
        </div>
    )
}