import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstudiante } from '../context/EstudianteContext'
import './MoodleLogin.css'

function extraerNombreDeCorreo(correo) {
    const parte = correo.split('@')[0]
    const segmentos = parte.split('.')
    const palabras = segmentos
        .filter(s => s.length > 1 && isNaN(s))
        .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    return {
        nombre: palabras[0] || 'Usuario',
        apellido: palabras[1] || 'PUCV'
    }
}

export default function MoodleLogin() {
    const navigate = useNavigate()
    const { iniciarSesionMoodle } = useEstudiante()
    const [correo, setCorreo] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const dominiosValidos = ['@mail.pucv.cl', '@pucv.cl', '@alumnos.pucv.cl']

    function validarCorreo(correo) {
        return dominiosValidos.some(d => correo.endsWith(d))
    }

    async function handleSubmit() {
        setError('')
        if (!correo.trim()) {
            setError('Por favor ingresa tu correo institucional.')
            return
        }
        if (!validarCorreo(correo.trim().toLowerCase())) {
            setError('El correo debe ser institucional (@mail.pucv.cl, @pucv.cl o @alumnos.pucv.cl).')
            return
        }

        setCargando(true)
        try {
            const { nombre, apellido } = extraerNombreDeCorreo(correo.trim().toLowerCase())
            const moodle_id = correo.trim().toLowerCase()

            const [data] = await Promise.all([
                iniciarSesionMoodle(moodle_id, nombre, apellido, correo.trim().toLowerCase()),
                new Promise(resolve => setTimeout(resolve, 1500))
            ])

            navigate('/dashboard')
        } catch (e) {
            setError('Hubo un error al iniciar sesión. Intenta de nuevo.')
        } finally {
            setCargando(false)
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <div className="moodle-page">
            <div className="moodle-page__card">
                <img
                    src="public/logos/logoTutorIA.png"
                    alt="TutorIA"
                    className="moodle-page__logo"
                />

                <h1 className="moodle-page__title">Ingresar con cuenta institucional</h1>
                <p className="moodle-page__desc">
                    Ingresa tu correo institucional PUCV para acceder a TutorIA.
                    Si es tu primera vez, se creará tu cuenta automáticamente.
                </p>

                <div className="moodle-page__form">
                    <label className="moodle-page__label">Correo institucional</label>
                    <input
                        className={`moodle-page__input ${error ? 'moodle-page__input--error' : ''}`}
                        type="email"
                        placeholder="nombre.apellido.a@mail.pucv.cl"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={cargando}
                    />
                    {error && <p className="moodle-page__error">{error}</p>}

                    <button
                        className="moodle-page__btn"
                        onClick={handleSubmit}
                        disabled={cargando}
                    >
                        {cargando
                            ? <><span className="moodle-page__spinner" />Ingresando...</>
                            : 'Ingresar'
                        }
                    </button>
                </div>

                <button
                    className="moodle-page__volver"
                    onClick={() => navigate('/')}
                >
                    ← Volver al inicio
                </button>
            </div>
        </div>
    )
}