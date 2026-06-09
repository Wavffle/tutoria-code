import { useState } from 'react'
import ModuloCard from './ModuloCard'
import './ModulosGrid.css'

const MODULOS_POR_FILA = 3

export default function ModulosGrid({ modulos, onIAClick }) {
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
                    offsetIdx={filaIdx * MODULOS_POR_FILA}  /* ← índice global */
                />
            ))}
        </div>
    )
}

function FilaModulos({ modulos, onIAClick, offsetIdx }) {
    const maxEjercicios = Math.max(...modulos.map(m => m.ejercicios.length))

    return (
        <div className="fila-modulos">
            <div className="fila-modulos__dots-row">
                {modulos.map((modulo) => (
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

            <div className="fila-modulos__cards">
                {modulos.map((modulo, i) => (
                    <div
                        key={modulo.id}
                        className="modulo-card__wrapper"
                        style={{ animationDelay: `${(offsetIdx + i) * 80}ms` }}  /* ← delay escalonado */
                    >
                        <ModuloCard modulo={modulo} onIAClick={onIAClick} />
                    </div>
                ))}
            </div>
        </div>
    )
}