// Tabla de puntos según tipo y nivel
const TABLA_PUNTOS = {
    primera_vez: { 1: 80, 2: 120, 3: 160 },
    refuerzo:    { 1: 30, 2: 45,  3: 60  },
    repeticion:  { 1: 40, 2: 60,  3: 80  }
}

// Puntos necesarios para subir de nivel
const PUNTOS_PARA_SUBIR = {
    1: 500,
    2: 750,
    3: 1000
}

const NOMBRE_NIVEL = {
    1: 'BASICO',
    2: 'INTERMEDIO',
    3: 'AVANZADO'
}

/**
 * Calcula los puntos ganados según tipo de ejercicio y nivel
 * @param {string} tipo - 'primera_vez' | 'refuerzo' | 'repeticion'
 * @param {number} nivel - 1, 2 o 3
 */
function calcularPuntos(tipo, nivel) {
    if (!TABLA_PUNTOS[tipo]) return 0
    if (!TABLA_PUNTOS[tipo][nivel]) return 0
    return TABLA_PUNTOS[tipo][nivel]
}

/**
 * Verifica si el estudiante debe subir de nivel y lo sube si corresponde
 * @param {object} db - instancia de la BD
 * @param {object} estudiante - datos del estudiante
 * @param {number} puntosGanados - puntos ganados en este intento
 * @returns {object} - { subioNivel, nivelAnterior, nivelNuevo, puntosActuales }
 */
function actualizarPuntos(db, estudiante, puntosGanados) {
    const puntosActuales = estudiante.progreso_nivel + puntosGanados
    const nivelActual = estudiante.nivel_actual
    const puntosNecesarios = PUNTOS_PARA_SUBIR[nivelActual]

    let subioNivel = false
    let nivelNuevo = nivelActual
    let puntosFinales = puntosActuales

    // Verificar si sube de nivel
    if (puntosNecesarios !== null && puntosActuales >= puntosNecesarios && nivelActual < 3) {
        subioNivel = true
        nivelNuevo = nivelActual + 1
        puntosFinales = puntosActuales - puntosNecesarios
    }

    // Actualizar en la BD
    db.prepare(`
        UPDATE estudiantes
        SET progreso_nivel = ?,
            nivel_actual = ?,
            updated_at = datetime('now')
        WHERE id = ?
    `).run(puntosFinales, nivelNuevo, estudiante.id)

    return {
        subioNivel,
        nivelAnterior: NOMBRE_NIVEL[nivelActual],
        nivelNuevo: NOMBRE_NIVEL[nivelNuevo],
        puntosGanados,
        puntosActuales: puntosFinales,
        puntosParaSiguienteNivel: PUNTOS_PARA_SUBIR[nivelNuevo]
    }
}

module.exports = { calcularPuntos, actualizarPuntos, TABLA_PUNTOS, PUNTOS_PARA_SUBIR, NOMBRE_NIVEL }