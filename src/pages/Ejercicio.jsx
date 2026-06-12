import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TutorIANavbar from '../components/shared/TutorIANavbar.jsx'
import EjercicioInfo from '../components/Ejercicio/EjercicioInfo'
import EjercicioEditor from '../components/Ejercicio/EjercicioEditor'
import EjercicioFooter from '../components/Ejercicio/EjercicioFooter'
import EjercicioResultado from '../components/Ejercicio/EjercicioResultado'
import { useEstudiante } from '../context/EstudianteContext'
import './Ejercicio.css'

const MODULO_SLUG = {
  1: 'variables_basicas',
  2: 'condicionales',
  3: 'bucles_repeticion'
}

const FASTAPI_URL = 'http://127.0.0.1:8000'

export default function Ejercicio() {
  const location = useLocation()
  const navigate = useNavigate()
  const { estudiante, sesion_id, registrarIntento, iniciarEjercicio, ejercicioActual, moduloActual } = useEstudiante()

  const ejercicioSeleccionado = location.state?.ejercicio ?? ejercicioActual
  const moduloSeleccionado = location.state?.modulo ?? moduloActual
  const numeroEjercicio = location.state?.numeroEjercicio || 1
  const totalEjercicios = location.state?.totalEjercicios || 5

  // Estado del LLM
  const [ejercicioIA, setEjercicioIA] = useState(null)
  const [evaluacion, setEvaluacion] = useState(null)
  const [cargandoIA, setCargandoIA] = useState(true)
  const [cargandoEvaluacion, setCargandoEvaluacion] = useState(false)
  const [pistaTexto, setPistaTexto] = useState('')
  const [cargandoPista, setCargandoPista] = useState(false)
  const [generarTrigger, setGenerarTrigger] = useState(0)
  const peticionEnviada = useRef(false)

  // Estado del ejercicio
  const [esRepeticion, setEsRepeticion] = useState(location.state?.esRepeticion || false)
  const [esRefuerzo, setEsRefuerzo] = useState(false)
  const [estado, setEstado] = useState('pendiente')
  const [salida, setSalida] = useState('')
  const [errores, setErrores] = useState(0)
  const [erroresAcumulados, setErroresAcumulados] = useState(0)
  const [codigoActual, setCodigoActual] = useState('')
  const [codigoFinal, setCodigoFinal] = useState('')
  const [cargandoPython, setCargandoPython] = useState(true)
  const [codigoEscrito, setCodigoEscrito] = useState(false)
  const [mostrarConfirm, setMostrarConfirm] = useState(false)
  const [destino, setDestino] = useState(null)
  const [tiempoInicio] = useState(Date.now())
  const pyodideRef = useRef(null)

  useEffect(() => {
    if (location.state?.ejercicio && location.state?.modulo) {
      iniciarEjercicio(location.state.ejercicio, location.state.modulo)
    }
  }, [])

  useEffect(() => {
    if (peticionEnviada.current) return
    if (!moduloSeleccionado || !ejercicioSeleccionado) return

    peticionEnviada.current = true

    async function generarEjercicio() {
      setCargandoIA(true)
      try {
        const res = await fetch(`${FASTAPI_URL}/api/generar_ejercicio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modulo: moduloSeleccionado.titulo,
            categoria: ejercicioSeleccionado.texto,
            nivel: moduloSeleccionado.nivelMinimo?.toUpperCase() || 'BASICO',
            errores_previos: erroresAcumulados
          })
        })
        if (!res.ok) throw new Error('Error conectando al LLM')
        const data = await res.json()
        setEjercicioIA(data)
      } catch (error) {
        console.error('Error al generar ejercicio:', error)
        peticionEnviada.current = false
      } finally {
        setCargandoIA(false)
      }
    }

    generarEjercicio()
  }, [ejercicioSeleccionado, moduloSeleccionado, generarTrigger])

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
      state: {
        ejercicio: ejercicioSeleccionado,
        modulo: moduloSeleccionado,
        numeroEjercicio,
        totalEjercicios,
        codigoEstudiante: codigoFinal,
        descripcionEjercicio: ejercicioIA?.descripcion || ''
      }
    })
  }

  async function handlePedirPista() {
    if (!ejercicioIA) return
    setCargandoPista(true)
    try {
      const res = await fetch(`${FASTAPI_URL}/api/pedir_pista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion_ejercicio: ejercicioIA.descripcion,
          nivel: moduloSeleccionado?.nivelMinimo?.toUpperCase() || 'BASICO',
          codigo_actual: codigoActual
        })
      })
      const data = await res.json()
      setPistaTexto(data.pistaBton)
    } catch (error) {
      console.error('Error al pedir pista:', error)
      setPistaTexto('Hubo un error al consultar al TutorIA.')
    } finally {
      setCargandoPista(false)
    }
  }

  async function handleEjecutar(code) {
    if (!code.trim() || !pyodideRef.current || !ejercicioIA) return
    setCodigoActual(code)

    let output = ''
    let huboError = false
    try {
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `)
      pyodideRef.current.runPython(code)
      output = pyodideRef.current.runPython('sys.stdout.getvalue()').trim()
    } catch (error) {
      output = `Error: ${error.message}`
      huboError = true
    } finally {
      try {
        pyodideRef.current.runPython('sys.stdout = sys.__stdout__')
        pyodideRef.current.runPython('sys.stderr = sys.__stderr__')
      } catch (_) {}
    }

    setSalida(output || '(Sin salida)')
    setCargandoEvaluacion(true)

    try {
      const res = await fetch(`${FASTAPI_URL}/api/evaluar_codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: moduloSeleccionado.titulo,
          categoria: ejercicioSeleccionado.texto,
          descripcion_ejercicio: ejercicioIA.descripcion,
          codigo_usuario: code,
          salida_consola: output,
          es_error_sintaxis: huboError
        })
      })
      const dataEval = await res.json()
      setEvaluacion(dataEval)
      setEstado(dataEval.estado)

      if (dataEval.estado === 'correcto') {
        setCodigoFinal(code)

        const tiempoSegundos = Math.floor((Date.now() - tiempoInicio) / 1000)
        const nivelEjercicio = moduloSeleccionado?.id || 1
        const tipoIntento = esRepeticion ? 'repeticion' : esRefuerzo ? 'refuerzo' : 'primera_vez'
        const moduloSlug = MODULO_SLUG[moduloSeleccionado?.id] ?? 'variables_basicas'

        let ejercicioId = null
        try {
          const resUpsert = await fetch('http://localhost:3001/api/ejercicios/upsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              titulo: ejercicioSeleccionado.texto,
              modulo: moduloSlug,
              titulo_modulo: moduloSeleccionado.titulo,
              nivel: moduloSeleccionado.id
            })
          })
          const dataUpsert = await resUpsert.json()
          if (dataUpsert.success) ejercicioId = dataUpsert.ejercicio.id
        } catch (e) {
          console.error('Error en upsert ejercicio:', e)
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
        setErrores(prev => prev + 1)
        setErroresAcumulados(prev => prev + 1)
      }

    } catch (error) {
      console.error('Error en evaluación:', error)
      setEstado('incorrecto')
      setErrores(prev => prev + 1)
      setErroresAcumulados(prev => prev + 1)
    } finally {
      setCargandoEvaluacion(false)
    }
  }

  function handleReintentar() {
    setEstado('pendiente')
    setSalida('')
    setEvaluacion(null)
  }

  function handleRefuerzo() {
    setEstado('pendiente')
    setSalida('')
    setErrores(0)
    setEvaluacion(null)
    setEsRefuerzo(true)
    setEsRepeticion(false)
    peticionEnviada.current = false
    setEjercicioIA(null)
    setCargandoIA(true)
    setGenerarTrigger(prev => prev + 1)
    // erroresAcumulados NO se resetea, se mantiene para el LLM
  }

  function handleNuevoEjercicio() {
    setEstado('pendiente')
    setSalida('')
    setErrores(0)
    setEvaluacion(null)
    setEsRefuerzo(false)
    peticionEnviada.current = false
    setEjercicioIA(null)
    setCargandoIA(true)
    setGenerarTrigger(prev => prev + 1)
    // erroresAcumulados NO se resetea, se mantiene para el LLM
  }

  const tituloModulo = moduloSeleccionado?.titulo || 'Módulo'
  const tituloEjercicio = ejercicioSeleccionado?.texto || 'Ejercicio'
  const archivoEditor = MODULO_SLUG[moduloSeleccionado?.id]
      ? `${MODULO_SLUG[moduloSeleccionado.id]}.py`
      : 'ejercicio.py'

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
                data={ejercicioIA}
            />
          </div>
          <div className="ejercicio-page__right">
            <EjercicioEditor
                onEjecutar={handleEjecutar}
                estado={estado}
                cargando={cargandoPython || cargandoIA}
                onCodigoChange={(tieneContenido) => setCodigoEscrito(tieneContenido)}
                archivo={archivoEditor}
            />
          </div>
        </div>
        <EjercicioFooter
            estado={estado}
            onNuevoEjercicio={handleNuevoEjercicio}
            onIrDashboard={() => handleNavegar('/dashboard')}
            onPedirPista={handlePedirPista}
            pistaTexto={pistaTexto}
            cargandoPista={cargandoPista}
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
                evaluacion={evaluacion}
                cargandoEvaluacion={cargandoEvaluacion}
                onReintentar={handleReintentar}
                onRefuerzo={handleRefuerzo}
                ejercicioSeleccionado={ejercicioSeleccionado}
                moduloSeleccionado={moduloSeleccionado}
                numeroEjercicio={numeroEjercicio}
                totalEjercicios={totalEjercicios}
                onContinuar={handleContinuar}
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