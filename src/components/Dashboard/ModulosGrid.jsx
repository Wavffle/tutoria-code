import { useState } from 'react'
import ModuloCard from './ModuloCard'
import './ModulosGrid.css'

// Cada fila muestra 3 módulos
const MODULOS_POR_FILA = 3

export default function ModulosGrid({ modulos, onIAClick }) {
  // Dividir en filas de 3
  const filas = []
  for (let i = 0; i < modulos.length; i += MODULOS_POR_FILA) {
    filas.push(modulos.slice(i, i + MODULOS_POR_FILA))
  }

  return (
    <div className="modulos-grid">
      {filas.map((fila, filaIdx) => (
        <FilaModulos
          key={filaIdx}
          modulos={fila}
          onIAClick={onIAClick}
        />
      ))}
    </div>
  )
}

function FilaModulos({ modulos, onIAClick }) {
  const [activo, setActivo] = useState(0)

  // Calcular el número máximo de ejercicios en esta fila
  const maxEjercicios = Math.max(...modulos.map(m => m.ejercicios.length))

  return (
    <div className="fila-modulos">
      {/* Dots de progreso por módulo */}
      <div className="fila-modulos__dots-row">
        {modulos.map((modulo, i) => (
          <div key={modulo.id} className="fila-modulos__dots">
              {modulo.ejercicios.filter(e => e.tipo === 'ejercicio').map((ej, j) => (
                  <span
                      key={j}
                      className={`fila-modulos__dot ${
                          ej.estado === 'completado'
                              ? 'fila-modulos__dot--done'
                              : ej.estado === 'disponible'
                                  ? 'fila-modulos__dot--available'
                                  : 'fila-modulos__dot--locked'
                      }`}
                  />
              ))}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="fila-modulos__cards">
        {modulos.map((modulo) => (
          <ModuloCard
            key={modulo.id}
            modulo={modulo}
            onIAClick={onIAClick}
          />
        ))}
      </div>
    </div>
  )
}
