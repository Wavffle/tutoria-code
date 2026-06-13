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
    const [estudiante, setEstudiante] = useState(() => {
        const guardado = sessionStorage.getItem('estudiante')
        return guardado ? JSON.parse(guardado) : null
    })
    const [sesion_id, setSesionId] = useState(() => {
        return sessionStorage.getItem('sesion_id') || null
    })
    const [cargando, setCargando] = useState(true)
    const [progreso, setProgreso] = useState([])
    const [completados, setCompletados] = useState([])
    const [resultadoIntento, setResultadoIntento] = useState(() => {
        const guardado = sessionStorage.getItem('resultadoIntento')
        return guardado ? JSON.parse(guardado) : null
    })
    const [ejercicioActual, setEjercicioActual] = useState(null)
    const [moduloActual, setModuloActual] = useState(null)
    const [esDemo, setEsDemo] = useState(() => {
        return sessionStorage.getItem('esDemo') === 'true'
    })

    useEffect(() => {
        const estudianteGuardado = sessionStorage.getItem('estudiante')
        if (estudianteGuardado && JSON.parse(estudianteGuardado)?.id) {
            const est = JSON.parse(estudianteGuardado)
            recargarProgreso(est.moodle_id, est.id).finally(() => setCargando(false))
        } else {
            setCargando(false)
        }
    }, [])

    function guardarSesion(estudianteData, sesionId, demo) {
        sessionStorage.setItem('estudiante', JSON.stringify(estudianteData))
        sessionStorage.setItem('sesion_id', sesionId?.toString() || '')
        sessionStorage.setItem('esDemo', demo ? 'true' : 'false')
    }

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
                setEstudiante(prev => {
                    const actualizado = { ...prev, tiempo_total_segundos: dataTiempo.total_segundos }
                    sessionStorage.setItem('estudiante', JSON.stringify(actualizado))
                    return actualizado
                })
            }
        } catch (error) {
            console.error('Error al recargar progreso:', error)
        }
    }

    async function iniciarSesionMoodle(moodle_id, nombre, apellido, correo) {
        setCargando(true)
        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moodle_id, nombre, apellido, correo })
            })
            const data = await res.json()
            if (data.success) {
                const est = { ...data.estudiante, nivelTexto: numeroANivel(data.estudiante.nivel_actual) }
                setEstudiante(est)
                setSesionId(data.sesion_id)
                guardarSesion(est, data.sesion_id, false)
                await recargarProgreso(moodle_id, data.estudiante.id)
            }
        } catch (error) {
            console.error('Error al iniciar sesión Moodle:', error)
        } finally {
            setCargando(false)
        }
    }

    async function iniciarSesionDemo() {
        setCargando(true)
        try {
            const res = await fetch('http://localhost:3001/api/auth/demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            if (data.success) {
                const est = { ...data.estudiante, nivelTexto: numeroANivel(data.estudiante.nivel_actual) }
                setEstudiante(est)
                setSesionId(data.sesion_id)
                setEsDemo(true)
                guardarSesion(est, data.sesion_id, true)
            }
        } catch (error) {
            console.error('Error al iniciar sesión demo:', error)
        } finally {
            setCargando(false)
        }
    }

    async function cerrarSesion() {
        if (esDemo && estudiante?.id) {
            try {
                await fetch(`http://localhost:3001/api/auth/demo/${estudiante.id}`, {
                    method: 'DELETE'
                })
            } catch (error) {
                console.error('Error al eliminar usuario demo:', error)
            }
        }
        sessionStorage.clear()
        setEstudiante(null)
        setSesionId(null)
        setEsDemo(false)
        setProgreso([])
        setCompletados([])
        setResultadoIntento(null)
        setEjercicioActual(null)
        setModuloActual(null)
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

                const estActualizado = {
                    ...estudiante,
                    progreso_nivel: data.resultado.puntosActuales,
                    nivel_actual: nuevoNivelActual,
                    nivelTexto: nivelTextoNormalizado,
                    ejercicios_completados: estudiante.ejercicios_completados + 1,
                    ejercicios_correctos: estudiante.ejercicios_correctos + 1
                }

                setEstudiante(estActualizado)
                sessionStorage.setItem('estudiante', JSON.stringify(estActualizado))

                const resultado = {
                    puntosGanados: data.puntosGanados,
                    puntosActuales: data.resultado.puntosActuales,
                    puntosParaSiguienteNivel: PUNTOS_PARA_NIVEL[nuevoNivelActual] ?? 1000,
                    nivelActual: nivelTextoNormalizado,
                    siguienteNivel: NOMBRE_SIGUIENTE[nuevoNivelActual] ?? '—',
                    subioNivel: data.resultado.subioNivel,
                    ejercicio_id
                }
                setResultadoIntento(resultado)
                sessionStorage.setItem('resultadoIntento', JSON.stringify(resultado))

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
        sessionStorage.removeItem('resultadoIntento')
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
            esDemo,
            iniciarSesionDemo,
            iniciarSesionMoodle,
            cerrarSesion,
            NIVELES
        }}>
            {children}
        </EstudianteContext.Provider>
    )
}

export function useEstudiante() {
    return useContext(EstudianteContext)
}