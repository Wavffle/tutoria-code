import { createContext, useContext, useState, useEffect } from 'react'

const EstudianteContext = createContext(null)

export const NIVELES = ['Basico', 'Intermedio', 'Avanzado']

function numeroANivel(numero) {
    const mapa = { 1: 'Basico', 2: 'Intermedio', 3: 'Avanzado' }
    return mapa[numero] || 'Basico'
}

const PUNTOS_PARA_NIVEL = { 1: 500, 2: 750, 3: 1000 }
const NOMBRE_SIGUIENTE = { 1: 'INTERMEDIO', 2: 'AVANZADO', 3: '—' }

export function EstudianteProvider({ children }) {
    const [estudiante, setEstudiante] = useState(null)
    const [sesion_id, setSesionId] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [progreso, setProgreso] = useState([])
    const [completados, setCompletados] = useState([])
    const [resultadoIntento, setResultadoIntento] = useState(null)
    const [ejercicioActual, setEjercicioActual] = useState(null)
    const [moduloActual, setModuloActual] = useState(null)

    useEffect(() => { iniciarSesion() }, [])

    async function recargarProgreso(moodle_id, estudiante_id) {
        try {
            const [resProgreso, resCompletados, resTiempo] = await Promise.all([
                fetch(`http://localhost:3001/api/estudiantes/${moodle_id}/progreso`),
                fetch(`http://localhost:3001/api/estudiantes/${estudiante_id}/modulos`),
                fetch(`http://localhost:3001/api/estudiantes/${estudiante_id}/tiempo`)
            ])
            const dataProgreso = await resProgreso.json()
            const dataCompletados = await resCompletados.json()
            const dataTiempo = await resTiempo.json()

            if (dataProgreso.success) setProgreso(dataProgreso.progreso)
            if (dataCompletados.success) setCompletados(dataCompletados.modulos)
            if (dataTiempo.success) {
                setEstudiante(prev => ({ ...prev, tiempo_total_segundos: dataTiempo.total_segundos }))
            }
        } catch (error) {
            console.error('Error al recargar progreso:', error)
        }
    }

    async function iniciarSesion() {
        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moodle_id: 'alumno_002',
                    nombre: 'Usuario',
                    apellido: 'Demo',
                    correo: 'alumno@tutoria.cl'
                })
            })
            const data = await res.json()
            if (data.success) {
                setEstudiante({ ...data.estudiante, nivelTexto: numeroANivel(data.estudiante.nivel_actual) })
                setSesionId(data.sesion_id)
                await recargarProgreso('alumno_002', data.estudiante.id)
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error)
        } finally {
            setCargando(false)
        }
    }

    async function registrarIntento({ ejercicio_id, codigo_enviado, es_correcto, tipo_intento, nivel_ejercicio, tiempo_segundos }) {
        if (!estudiante || !sesion_id) return null

        try {
            const res = await fetch('http://localhost:3001/api/intentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    estudiante_id: estudiante.id,
                    ejercicio_id,
                    sesion_id,
                    codigo_enviado,
                    es_correcto,
                    tipo_intento,
                    nivel_ejercicio,
                    tiempo_segundos
                })
            })
            const data = await res.json()

            if (data.success && es_correcto) {
                const nuevoNivelActual = data.resultado.subioNivel
                    ? estudiante.nivel_actual + 1
                    : estudiante.nivel_actual

                const nivelTextoNormalizado = data.resultado.nivelNuevo.charAt(0).toUpperCase() +
                    data.resultado.nivelNuevo.slice(1).toLowerCase()

                setEstudiante(prev => ({
                    ...prev,
                    progreso_nivel: data.resultado.puntosActuales,
                    nivel_actual: nuevoNivelActual,
                    nivelTexto: nivelTextoNormalizado,
                    ejercicios_completados: prev.ejercicios_completados + 1,
                    ejercicios_correctos: prev.ejercicios_correctos + 1
                }))

                setResultadoIntento({
                    puntosGanados: data.puntosGanados,
                    puntosActuales: data.resultado.puntosActuales,
                    puntosParaSiguienteNivel: PUNTOS_PARA_NIVEL[nuevoNivelActual] ?? 1000,
                    nivelActual: nivelTextoNormalizado,
                    siguienteNivel: NOMBRE_SIGUIENTE[nuevoNivelActual] ?? '—',
                    subioNivel: data.resultado.subioNivel,
                    ejercicio_id
                })

                await recargarProgreso(estudiante.moodle_id, estudiante.id)
            }

            return data
        } catch (error) {
            console.error('Error al registrar intento:', error)
            return null
        }
    }

    function iniciarEjercicio(ejercicio, modulo) {
        setEjercicioActual(ejercicio)
        setModuloActual(modulo)
        setResultadoIntento(null)
    }

    return (
        <EstudianteContext.Provider value={{
            estudiante,
            sesion_id,
            cargando,
            progreso,
            completados,
            registrarIntento,
            recargarProgreso,
            iniciarEjercicio,
            ejercicioActual,
            moduloActual,
            resultadoIntento,
            NIVELES
        }}>
            {children}
        </EstudianteContext.Provider>
    )
}

export function useEstudiante() {
    return useContext(EstudianteContext)
}