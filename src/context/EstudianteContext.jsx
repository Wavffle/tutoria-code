import { createContext, useContext, useState, useEffect } from 'react'

const EstudianteContext = createContext(null)

const NIVELES = ['Basico', 'Intermedio', 'Avanzado']

function numeroANivel(numero) {
    const mapa = { 1: 'Basico', 2: 'Intermedio', 3: 'Avanzado' }
    return mapa[numero] || 'Basico'
}

export function EstudianteProvider({ children }) {
    const [estudiante, setEstudiante] = useState(null)
    const [sesion_id, setSesionId] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        iniciarSesion()
    }, [])

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
                setEstudiante({
                    ...data.estudiante,
                    nivelTexto: numeroANivel(data.estudiante.nivel_actual)
                })
                setSesionId(data.sesion_id)
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
                setEstudiante(prev => ({
                    ...prev,
                    progreso_nivel: data.resultado.puntosActuales,
                    nivel_actual: data.resultado.subioNivel
                        ? prev.nivel_actual + 1
                        : prev.nivel_actual,
                    nivelTexto: data.resultado.nivelNuevo,
                    ejercicios_completados: prev.ejercicios_completados + 1,
                    ejercicios_correctos: prev.ejercicios_correctos + 1
                }))
            }

            return data
        } catch (error) {
            console.error('Error al registrar intento:', error)
            return null
        }
    }

    return (
        <EstudianteContext.Provider value={{
            estudiante,
            sesion_id,
            cargando,
            registrarIntento,
            NIVELES
        }}>
            {children}
        </EstudianteContext.Provider>
    )
}

export function useEstudiante() {
    return useContext(EstudianteContext)
}

