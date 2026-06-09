import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TutorIANavbar from '../components/shared/TutorIANavbar.jsx'
import EjercicioInfo from '../components/Ejercicio/EjercicioInfo'
import EjercicioEditor from '../components/Ejercicio/EjercicioEditor'
import EjercicioFooter from '../components/Ejercicio/EjercicioFooter'
import EjercicioResultado from '../components/Ejercicio/EjercicioResultado'
import './Ejercicio.css'

export default function Ejercicio() {
  const navigate = useNavigate();
  const location = useLocation();

  const moduloActual = typeof location.state?.modulo === 'object'
      ? location.state.modulo.titulo
      : (location.state?.modulo || "Variables básicas");
  const categoriaActual = location.state?.categoria || "Introducción a variables";
  const nivelActual = location.state?.nivel || "BÁSICO";

  const [ejercicioData, setEjercicioData] = useState(null);
  const [evaluacion, setEvaluacion] = useState(null);
  const [estadoEjercicio, setEstadoEjercicio] = useState('pendiente');
  const [codigo, setCodigo] = useState('');
  const [cargandoIA, setCargandoIA] = useState(true);
  const [pistaTexto, setPistaTexto] = useState('');
  const [cargandoPista, setCargandoPista] = useState(false);

  // 2. Creamos la variable del candado
  const peticionEnviada = useRef(false);

  useEffect(() => {
    // 3. Si el candado está cerrado, abortamos inmediatamente
    if (peticionEnviada.current) return;

    const generarEjercicio = async () => {
      // 4. Cerramos el candado justo antes de hacer el fetch
      peticionEnviada.current = true;

      try {
        const res = await fetch('http://127.0.0.1:8000/api/generar_ejercicio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modulo: moduloActual,
            categoria: categoriaActual,
            nivel: nivelActual,
            errores_previos: 0
          })
        });

        if (!res.ok) throw new Error("Error conectando al backend");

        const data = await res.json();
        setEjercicioData(data);
        setCargandoIA(false);
      } catch (error) {
        console.error("Error al generar el ejercicio:", error);
        setCargandoIA(false);
        // Si hubo un error catastrófico, abrimos el candado por si el usuario quiere reintentar
        peticionEnviada.current = false;
      }
    };

    generarEjercicio();
  }, [moduloActual, categoriaActual, nivelActual]); // Se vuelve a ejecutar si cambian estos valores

  // 3. Ejecutar y Evaluar
  const handleEjecutar = async (codigoEditor) => {
    setCodigo(codigoEditor);
    setEstadoEjercicio('pendiente');

    // --- AQUÍ VA TU LÓGICA REAL DE PYODIDE ---
    let salidaReal = ""; // Reemplaza esto con la salida real de Pyodide
    let huboErrorReal = false;    // Reemplaza esto con el estado de error real de Pyodide
    // -----------------------------------------

    try {
      const res = await fetch('http://127.0.0.1:8000/api/evaluar_codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: moduloActual,             // <-- DINÁMICO
          categoria: categoriaActual,       // <-- DINÁMICO
          descripcion_ejercicio: ejercicioData.descripcion,
          codigo_usuario: codigoEditor,
          salida_consola: salidaReal,
          es_error_sintaxis: huboErrorReal
        })
      });

      const dataEval = await res.json();
      setEvaluacion(dataEval);
      setEstadoEjercicio(dataEval.estado);

    } catch (error) {
      console.error("Error en la evaluación:", error);
    }
  };

  // 4. Pedir Pista a la IA
  const handlePedirPista = async () => {
    setCargandoPista(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/pedir_pista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion_ejercicio: ejercicioData.descripcion,
          nivel: nivelActual,               // <-- DINÁMICO
          codigo_actual: codigo
        })
      });
      const dataPista = await res.json();
      setPistaTexto(dataPista.pistaBton);
    } catch (error) {
      console.error("Error al pedir pista:", error);
      setPistaTexto("Hubo un error al consultar al TutorIA.");
    } finally {
      setCargandoPista(false);
    }
  };

  return (
      <div className="layout-ejercicio" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Contenido Principal */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Panel Izquierdo (Información) */}
          <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #ccc' }}>
            <EjercicioInfo
                data={ejercicioData ? { ...ejercicioData, nivel: ejercicioData.nivel || nivelActual } : null}
                estado={estadoEjercicio}
                errores={0}
                moduloSeleccionado={location.state?.modulo}
                ejercicioSeleccionado={location.state?.ejercicio}
                numeroEjercicio={location.state?.numeroEjercicio || 1}
                totalEjercicios={location.state?.totalEjercicios || 5}
            />
          </div>

          {/* Panel Derecho (Editor y Resultado) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <EjercicioEditor
                estado={estadoEjercicio}
                cargando={cargandoIA}
                onEjecutar={handleEjecutar}
                archivo={ejercicioData?.archivo}
                onCodigoChange={(val) => setCodigo(val)}
            />

            <EjercicioResultado
                estado={estadoEjercicio}
                evaluacion={evaluacion}
                onReintentar={() => setEstadoEjercicio('pendiente')}
                onRefuerzo={() => window.location.reload()}
            />
          </div>
        </div>

        {/* Footer */}
        <EjercicioFooter
            estado={estadoEjercicio}
            pistaTexto={pistaTexto}
            cargandoPista={cargandoPista}
            onPedirPista={handlePedirPista}
            onNuevoEjercicio={() => window.location.reload()}
            onIrDashboard={() => navigate('/dashboard')}
        />
      </div>
  );
}