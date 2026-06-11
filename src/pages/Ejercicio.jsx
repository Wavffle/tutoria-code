import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TutorIANavbar from '../components/shared/TutorIANavbar.jsx'
import EjercicioInfo from '../components/Ejercicio/EjercicioInfo'
import EjercicioEditor from '../components/Ejercicio/EjercicioEditor'
import EjercicioFooter from '../components/Ejercicio/EjercicioFooter'
import EjercicioResultado from '../components/Ejercicio/EjercicioResultado'
import { ejercicioData } from '../components/Ejercicio/ejercicioData'
import { useEstudiante } from '../context/EstudianteContext'
import './Ejercicio.css'

const MODULO_SLUG = {
  1: 'variables_basicas',
  2: 'condicionales',
  3: 'bucles_repeticion'
}

export default function Ejercicio() {
  const location = useLocation()
  const navigate = useNavigate()
  const { estudiante, sesion_id, registrarIntento, iniciarEjercicio, ejercicioActual, moduloActual } = useEstudiante()

  // location.state tiene prioridad, Context es el fallback cuando viene de feedback
  const ejercicioSeleccionado = location.state?.ejercicio ?? ejercicioActual
  const moduloSeleccionado = location.state?.modulo ?? moduloActual
  const numeroEjercicio = location.state?.numeroEjercicio || ejercicioData.ejercicioNum
  const totalEjercicios = location.state?.totalEjercicios || ejercicioData.ejercicioTotal

  const [esRepeticion, setEsRepeticion] = useState(location.state?.esRepeticion || false)
  const [esRefuerzo, setEsRefuerzo] = useState(false)
  const [estado, setEstado] = useState('pendiente')
  const [salida, setSalida] = useState('')
  const [errores, setErrores] = useState(0)
  const [salidaEsperadaReal, setSalidaEsperadaReal] = useState(null)
  const [cargandoPython, setCargandoPython] = useState(true)
  const [codigoEscrito, setCodigoEscrito] = useState(false)
  const [mostrarConfirm, setMostrarConfirm] = useState(false)
  const [destino, setDestino] = useState(null)
  const [tiempoInicio] = useState(Date.now())
  const pyodideRef = useRef(null)

  // Sincronizar ejercicio al Context si vino por location.state
  useEffect(() => {
    if (location.state?.ejercicio && location.state?.modulo) {
      iniciarEjercicio(location.state.ejercicio, location.state.modulo)
    }
  }, [])

  // Cargar salida esperada real desde BD
  useEffect(() => {
    if (!ejercicioSeleccionado || !moduloSeleccionado) return
    const moduloSlug = MODULO_SLUG[moduloSeleccionado.id] ?? 'variables_basicas'

    async function cargarEjercicio() {
      try {
        const res = await fetch(
            `http://localhost:3001/api/ejercicios/buscar?titulo=${encodeURIComponent(ejercicioSeleccionado.texto)}&modulo=${moduloSlug}`
        )
        const data = await res.json()
        if (data.success && data.ejercicio.salida_esperada) {
          setSalidaEsperadaReal(data.ejercicio.salida_esperada)
        }
      } catch (e) {
        console.error('Error al cargar ejercicio:', e)
      }
    }
    cargarEjercicio()
  }, [ejercicioSeleccionado, moduloSeleccionado])

  useEffect(() => {
    async function cargarPyodide() {
      pyodideRef.current = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      })
      setCargandoPython(false)
    }
    cargarPyodide()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (codigoEscrito && estado === 'pendiente') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [codigoEscrito, estado])

  function handleNavegar(ruta) {
    if (codigoEscrito && estado === 'pendiente') {
      setDestino(ruta)
      setMostrarConfirm(true)
    } else {
      navigate(ruta)
    }
  }

  function confirmarSalida() {
    setMostrarConfirm(false)
    navigate(destino)
  }

  function handleContinuar() {
    navigate('/feedback', {
      state: { ejercicio: ejercicioSeleccionado, modulo: moduloSeleccionado, numeroEjercicio, totalEjercicios }
    })
  }

  async function handleEjecutar(code) {
    if (!code.trim() || !pyodideRef.current) return

    try {
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
            `)
      pyodideRef.current.runPython(code)
      const output = pyodideRef.current.runPython('sys.stdout.getvalue()').trim()
      setSalida(output || '(Sin salida)')

      const salidaLimpia = output.trim().toLowerCase()
      const esperadaLimpia = (salidaEsperadaReal ?? ejercicioData.salidaEsperada).trim().toLowerCase()
      const esCorrecto = salidaLimpia === esperadaLimpia

      if (esCorrecto) {
        setEstado('correcto')

        const tiempoSegundos = Math.floor((Date.now() - tiempoInicio) / 1000)
        const nivelEjercicio = moduloSeleccionado?.id || 1
        const tipoIntento = esRepeticion ? 'repeticion' : esRefuerzo ? 'refuerzo' : 'primera_vez'
        const moduloSlug = MODULO_SLUG[moduloSeleccionado?.id] ?? 'variables_basicas'

        let ejercicioId = null
        if (ejercicioSeleccionado && moduloSeleccionado) {
          try {
            const res = await fetch('http://localhost:3001/api/ejercicios/upsert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                titulo: ejercicioSeleccionado.texto,
                modulo: moduloSlug,
                titulo_modulo: moduloSeleccionado.titulo,
                nivel: moduloSeleccionado.id
              })
            })
            const data = await res.json()
            if (data.success) ejercicioId = data.ejercicio.id
          } catch (e) {
            console.error('Error en upsert ejercicio:', e)
          }
        }

        if (ejercicioId) {
          await registrarIntento({
            ejercicio_id: ejercicioId,
            codigo_enviado: code,
            es_correcto: true,
            tipo_intento: tipoIntento,
            nivel_ejercicio: nivelEjercicio,
            tiempo_segundos: tiempoSegundos
          })
        }

      } else {
        setEstado('incorrecto')
        setErrores(prev => prev + 1)
      }

    } catch (error) {
      setSalida(`Error: ${error.message}`)
      setEstado('incorrecto')
      setErrores(prev => prev + 1)
    } finally {
      pyodideRef.current.runPython('sys.stdout = sys.__stdout__')
    }
  }

  function handleReintentar() { setEstado('pendiente'); setSalida('') }

  function handleRefuerzo() {
    setEstado('pendiente')
    setSalida('')
    setErrores(0)
    setEsRefuerzo(true)
    setEsRepeticion(false)
  }

  function handleNuevoEjercicio() {
    setEstado('pendiente')
    setSalida('')
    setErrores(0)
    setEsRefuerzo(false)
  }

  const tituloModulo = moduloSeleccionado?.titulo || ejercicioData.modulo
  const tituloEjercicio = ejercicioSeleccionado?.texto || ejercicioData.practica
  const archivoEditor = MODULO_SLUG[moduloSeleccionado?.id]
      ? `${MODULO_SLUG[moduloSeleccionado.id]}.py`
      : ejercicioData.archivo

  return (
      <div className="ejercicio-page">
        <TutorIANavbar
            breadcrumb={[
              { label: 'Dashboard', path: '/dashboard' },
              { label: tituloModulo, path: '/dashboard' },
              { label: tituloEjercicio }
            ]}
            onLogoClick={() => handleNavegar('/dashboard')}
            onAvatarClick={() => handleNavegar('/perfil')}
            onBreadcrumbClick={(path) => handleNavegar(path)}
        />
        <div className="ejercicio-page__main">
          <div className="ejercicio-page__left">
            <EjercicioInfo
                estado={estado}
                errores={errores}
                ejercicioSeleccionado={ejercicioSeleccionado}
                moduloSeleccionado={moduloSeleccionado}
                numeroEjercicio={numeroEjercicio}
                totalEjercicios={totalEjercicios}
            />
          </div>
          <div className="ejercicio-page__right">
            <EjercicioEditor
                onEjecutar={handleEjecutar}
                estado={estado}
                cargando={cargandoPython}
                onCodigoChange={(tieneContenido) => setCodigoEscrito(tieneContenido)}
                archivo={archivoEditor}
            />
          </div>
        </div>
        <EjercicioFooter
            estado={estado}
            onNuevoEjercicio={handleNuevoEjercicio}
            onIrDashboard={() => handleNavegar('/dashboard')}
        />
        <div className="ejercicio-page__bottom">
          <div className="ejercicio-page__salida">
            <div className="ejercicio-page__salida-body">
              <div className="ejercicio-page__salida-content">
                <p className="ejercicio-page__salida-label">Salida:</p>
                <p className={`ejercicio-page__salida-valor ${estado === 'incorrecto' ? 'ejercicio-page__salida-valor--error' : ''}`}>
                  {salida || '(Aquí se verá la ejecución)'}
                </p>
              </div>
            </div>
          </div>
          <div className="ejercicio-page__feedback">
            <EjercicioResultado
                estado={estado}
                salida={salida}
                onReintentar={handleReintentar}
                onRefuerzo={handleRefuerzo}
                ejercicioSeleccionado={ejercicioSeleccionado}
                moduloSeleccionado={moduloSeleccionado}
                numeroEjercicio={numeroEjercicio}
                totalEjercicios={totalEjercicios}
            />
          </div>
        </div>
        {mostrarConfirm && (
            <div className="ejercicio-confirm__overlay" onClick={() => setMostrarConfirm(false)}>
              <div className="ejercicio-confirm__modal" onClick={e => e.stopPropagation()}>
                <p className="ejercicio-confirm__titulo">¿Seguro que quieres salir?</p>
                <p className="ejercicio-confirm__desc">
                  Perderás el código que escribiste. Esta acción no se puede deshacer.
                </p>
                <div className="ejercicio-confirm__btns">
                  <button className="ejercicio-confirm__btn ejercicio-confirm__btn--cancel" onClick={() => setMostrarConfirm(false)}>
                    Seguir practicando
                  </button>
                  <button className="ejercicio-confirm__btn ejercicio-confirm__btn--confirm" onClick={confirmarSalida}>
                    Sí, salir
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}