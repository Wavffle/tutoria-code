import {useEffect, useRef, useState} from 'react'
import PerfilNavbar from '../components/shared/PerfilNavbar'
import EjercicioInfo from '../components/Ejercicio/EjercicioInfo'
import EjercicioEditor from '../components/Ejercicio/EjercicioEditor'
import EjercicioFooter from '../components/Ejercicio/EjercicioFooter'
import EjercicioResultado from '../components/Ejercicio/EjercicioResultado'
import {ejercicioData} from '../components/Ejercicio/ejercicioData'
import './Ejercicio.css'

export default function Ejercicio() {
  const [estado, setEstado] = useState('pendiente')
  const [salida, setSalida] = useState('')
  const [errores, setErrores] = useState(ejercicioData.errores)
  const [cargandoPython, setCargandoPython] = useState(true)
  const pyodideRef = useRef(null)

  // Carga Pyodide al montar el componente
  useEffect(() => {
    async function cargarPyodide() {
      pyodideRef.current = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      })
      setCargandoPython(false)
    }
    cargarPyodide()
  }, [])

  async function handleEjecutar(code) {
    if (!code.trim()) return
    if (!pyodideRef.current) return

    try {
      // Captura el print() del código del estudiante
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `)

      pyodideRef.current.runPython(code)

      const output = pyodideRef.current.runPython('sys.stdout.getvalue()').trim()
      setSalida(output || '(Sin salida)')

      // Compara la salida real con la esperada
      const salidaLimpia = output.trim().toLowerCase()
      const esperadaLimpia = ejercicioData.salidaEsperada.trim().toLowerCase()
      const esCorrecto = salidaLimpia === esperadaLimpia

      if (esCorrecto) {
        setEstado('correcto')
      } else {
        setEstado('incorrecto')
        setErrores(prev => prev + 1)
      }

    } catch (error) {
      // Error de sintaxis o ejecución
      setSalida(`Error: ${error.message}`)
      setEstado('incorrecto')
      setErrores(prev => prev + 1)
    } finally {
      // Restaura stdout
      pyodideRef.current.runPython('sys.stdout = sys.__stdout__')
    }
  }

  function handleReintentar() {
    setEstado('pendiente')
    setSalida('')
  }

  function handleRefuerzo() {
    setEstado('pendiente')
    setSalida('')
    setErrores(0)
  }

  function handleNuevoEjercicio() {
    setEstado('pendiente')
    setSalida('')
    setErrores(0)
  }

  return (
      <div className="ejercicio-page">
        <PerfilNavbar breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: ejercicioData.practica }
        ]} />

        <div className="ejercicio-page__main">
          <div className="ejercicio-page__left">
            <EjercicioInfo estado={estado} errores={errores} />
          </div>
          <div className="ejercicio-page__right">
            <EjercicioEditor
                onEjecutar={handleEjecutar}
                estado={estado}
                cargando={cargandoPython}
            />
          </div>
        </div>

        <EjercicioFooter
            estado={estado}
            onPedirPista={() => alert(ejercicioData.pistaBton)}
            onNuevoEjercicio={handleNuevoEjercicio}
        />

        <div className="ejercicio-page__bottom">
          <div className="ejercicio-page__salida">
            <div className="ejercicio-page__salida-body">
              <div className="ejercicio-page__salida-lines">
                <span>1</span>
                <span>2</span>
              </div>
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
            />
          </div>
        </div>
      </div>
  )
}