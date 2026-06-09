import { useEstudiante } from '../../context/EstudianteContext'
import { useState, useEffect } from 'react'
import './PerfilHistorial.css'

export default function PerfilHistorial() {
    const { estudiante } = useEstudiante()
    const [historial, setHistorial] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (!estudiante) return

        async function cargarHistorial() {
            try {
                const res = await fetch(`http://localhost:3001/api/estudiantes/${estudiante.id}/historial`)
                const data = await res.json()
                if (data.success) {
                    setHistorial(data.intentos)
                }
            } catch (error) {
                console.error('Error al cargar historial:', error)
            } finally {
                setCargando(false)
            }
        }

        cargarHistorial()
    }, [estudiante])

    if (cargando) return <p style={{ padding: '20px' }}>Cargando historial...</p>

    return (
        <div className="historial">
            <h2 className="historial__title">Historial</h2>
            <table className="historial__table">
                <thead>
                <tr>
                    <th>Ejercicio</th>
                    <th>Puntos</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {historial.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="historial__vacio">
                            Aún no has completado ningún ejercicio.
                        </td>
                    </tr>
                ) : (
                    historial.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <p className="historial__ejercicio">{item.titulo}</p>
                                <p className="historial__modulo">{item.titulo_modulo}</p>
                            </td>
                            <td className="historial__resultado">
                                {item.puntaje > 0 ? `+${item.puntaje} pts` : '0 pts'}
                            </td>
                            <td>
                                <span className="historial__estado">
                                    <span className={item.es_correcto ? 'historial__check' : 'historial__x'}>
                                        {item.es_correcto ? '✓' : '✗'}
                                    </span>
                                    {item.es_correcto ? 'Completado' : 'Incorrecto'}
                                </span>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    )
}