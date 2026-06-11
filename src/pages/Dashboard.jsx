import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useEstudiante, NIVELES } from '../context/EstudianteContext'
import { MODULOS_DEF } from '../components/Dashboard/dashboardData'
import DashboardNavbar from '../components/Dashboard/DashboardNavbar'
import RutaIA from '../components/Dashboard/RutaIA'
import ModulosGrid from '../components/Dashboard/ModulosGrid'
import IAPopup from '../components/Dashboard/IAPopup'
import PuntajeInfo from '../components/Dashboard/PuntajeInfo'
import PuntajePopup from '../components/Dashboard/PuntajePopup'
import './Dashboard.css'

function nivelPermite(nivelTexto, nivelMinimo) {
    const normalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    return NIVELES.indexOf(normalizar(nivelTexto)) >= NIVELES.indexOf(normalizar(nivelMinimo))
}

export default function Dashboard() {
    const { estudiante, completados, recargarProgreso } = useEstudiante()
    const location = useLocation()
    const [popupModulo, setPopupModulo] = useState(null)
    const [mostrarPuntaje, setMostrarPuntaje] = useState(false)

    useEffect(() => {
        if (estudiante) {
            recargarProgreso(estudiante.moodle_id, estudiante.id)
        }
    }, [location])

    const nivelTexto = estudiante?.nivelTexto ?? 'Basico'

    console.log('nivelTexto:', nivelTexto)
    console.log('completados:', completados)

    const modulos = MODULOS_DEF.map(def => {
        const desbloqueado = nivelPermite(nivelTexto, def.nivelMinimo)

        const moduloCompletado = completados.find(c => c.modulo === def.modulo)
        const cantidadCompletados = moduloCompletado?.ejercicios_completados ?? 0

        const soloEjercicios = def.ejercicios.filter(e => e.tipo === 'ejercicio')

        const ejerciciosConEstado = def.ejercicios.map(ej => {
            if (ej.tipo === 'ia') return { ...ej, estado: 'ia' }
            if (!desbloqueado) return { ...ej, estado: 'bloqueado' }

            const posicion = soloEjercicios.indexOf(ej)

            if (posicion < cantidadCompletados) return { ...ej, estado: 'completado' }
            if (posicion === cantidadCompletados) return { ...ej, estado: 'disponible' }
            return { ...ej, estado: 'bloqueado' }
        })

        const completadosEnModulo = soloEjercicios.filter((_, i) => i < cantidadCompletados).length

        return {
            ...def,
            desbloqueado,
            progreso: completadosEnModulo,
            progresoTotal: soloEjercicios.length,
            ejercicios: ejerciciosConEstado,
        }
    })

    return (
        <div className="dashboard">
            <DashboardNavbar />
            <RutaIA />
            <div className="dashboard__grid-wrapper">
                <ModulosGrid
                    modulos={modulos}
                    onIAClick={(modulo) => setPopupModulo(modulo)}
                />
            </div>
            <PuntajeInfo onVerMas={() => setMostrarPuntaje(true)} />
            {popupModulo && (
                <IAPopup
                    modulo={popupModulo}
                    onClose={() => setPopupModulo(null)}
                />
            )}
            {mostrarPuntaje && (
                <PuntajePopup onClose={() => setMostrarPuntaje(false)} />
            )}
        </div>
    )
}