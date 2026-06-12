const express = require('express')
const cors = require('cors')
const db = require('./db')
const { calcularPuntos, actualizarPuntos } = require('./puntos')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// ── Ruta de prueba ──
app.get('/', (req, res) => {
    res.json({ mensaje: 'TutorIA Backend funcionando ✓' })
})

// ── Auth simulada (sin Moodle) ──
app.post('/api/auth/login', (req, res) => {
    const { moodle_id, nombre, apellido, correo } = req.body

    if (!moodle_id || !nombre || !apellido || !correo) {
        return res.status(400).json({
            success: false,
            error: { code: 'MISSING_FIELDS', message: 'Faltan campos requeridos' }
        })
    }

    try {
        let estudiante = db.prepare(
            'SELECT * FROM estudiantes WHERE moodle_id = ?'
        ).get(moodle_id)

        if (!estudiante) {
            db.prepare(`
                INSERT INTO estudiantes (moodle_id, nombre, apellido, correo)
                VALUES (?, ?, ?, ?)
            `).run(moodle_id, nombre, apellido, correo)

            estudiante = db.prepare(
                'SELECT * FROM estudiantes WHERE moodle_id = ?'
            ).get(moodle_id)
        }

        db.prepare(`
            INSERT INTO sesiones (estudiante_id)
            VALUES (?)
        `).run(estudiante.id)

        const sesion = db.prepare(`
            SELECT * FROM sesiones
            WHERE estudiante_id = ?
            ORDER BY id DESC LIMIT 1
        `).get(estudiante.id)

        res.json({
            success: true,
            estudiante,
            sesion_id: sesion.id
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Obtener datos del estudiante ──
app.get('/api/estudiantes/:moodle_id', (req, res) => {
    const { moodle_id } = req.params

    try {
        const estudiante = db.prepare(
            'SELECT * FROM estudiantes WHERE moodle_id = ?'
        ).get(moodle_id)

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: { code: 'STUDENT_NOT_FOUND', message: 'Estudiante no encontrado' }
            })
        }

        const progreso = db.prepare(
            'SELECT * FROM progreso_modulo WHERE estudiante_id = ?'
        ).all(estudiante.id)

        res.json({ success: true, estudiante, progreso })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Progreso de módulos del estudiante ──
app.get('/api/estudiantes/:moodle_id/progreso', (req, res) => {
    const { moodle_id } = req.params

    try {
        const estudiante = db.prepare(
            'SELECT * FROM estudiantes WHERE moodle_id = ?'
        ).get(moodle_id)

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: { code: 'STUDENT_NOT_FOUND', message: 'Estudiante no encontrado' }
            })
        }

        const progreso = db.prepare(
            'SELECT * FROM progreso_modulo WHERE estudiante_id = ?'
        ).all(estudiante.id)

        res.json({
            success: true,
            progreso,
            ejercicios_correctos: estudiante.ejercicios_correctos
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Módulos completados del estudiante ──
app.get('/api/estudiantes/:estudiante_id/modulos', (req, res) => {
    const { estudiante_id } = req.params

    try {
        const modulos = db.prepare(`
            SELECT
                e.modulo,
                e.titulo_modulo,
                COUNT(DISTINCT e.id) as ejercicios_completados
            FROM intentos i
            JOIN ejercicios e ON i.ejercicio_id = e.id
            WHERE i.estudiante_id = ? AND i.es_correcto = 1
            GROUP BY e.modulo, e.titulo_modulo
        `).all(estudiante_id)

        res.json({ success: true, modulos })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Registrar intento y calcular puntos
app.post('/api/intentos', (req, res) => {
    const {
        estudiante_id, ejercicio_id, sesion_id,
        codigo_enviado, es_correcto, tiempo_segundos,
        tipo_intento, nivel_ejercicio, errores_acumulados
    } = req.body

    if (!estudiante_id || !ejercicio_id || !sesion_id) {
        return res.status(400).json({
            success: false,
            error: { code: 'MISSING_FIELDS', message: 'Faltan campos requeridos' }
        })
    }

    try {
        const estudiante = db.prepare(
            'SELECT * FROM estudiantes WHERE id = ?'
        ).get(estudiante_id)

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: { code: 'STUDENT_NOT_FOUND', message: 'Estudiante no encontrado' }
            })
        }

        const ejercicio = db.prepare(
            'SELECT * FROM ejercicios WHERE id = ?'
        ).get(ejercicio_id)

        let puntosGanados = 0
        let resultadoPuntos = null

        if (es_correcto) {
            puntosGanados = calcularPuntos(tipo_intento, nivel_ejercicio)
            resultadoPuntos = actualizarPuntos(db, estudiante, puntosGanados)

            const yaCompletado = db.prepare(`
        SELECT id FROM intentos
        WHERE estudiante_id = ? AND ejercicio_id = ? AND es_correcto = 1
    `).get(estudiante_id, ejercicio_id)

            // Solo sumar al progreso del módulo si es la primera vez
            if (!yaCompletado && ejercicio) {
                db.prepare(`
                    INSERT INTO progreso_modulo (estudiante_id, modulo, titulo_modulo, total_ejercicios, ejercicios_completados, ejercicios_correctos)
                    VALUES (?, ?, ?, 5, 1, 1)
                        ON CONFLICT(estudiante_id, modulo) DO UPDATE SET
                        ejercicios_completados = ejercicios_completados + 1,
                                                                  ejercicios_correctos = ejercicios_correctos + 1,
                                                                  updated_at = datetime('now')
                `).run(estudiante_id, ejercicio.modulo, ejercicio.titulo_modulo)

                db.prepare(`
                    UPDATE estudiantes
                    SET ejercicios_completados = ejercicios_completados + 1,
                        ejercicios_correctos = ejercicios_correctos + 1,
                        tiempo_total_segundos = tiempo_total_segundos + ?,
                        updated_at = datetime('now')
                    WHERE id = ?
                `).run(tiempo_segundos || 0, estudiante_id)

            } else if (yaCompletado) {
                // Es repetición o refuerzo — no suma al progreso del módulo
                // pero sí actualiza el tiempo
                db.prepare(`
            UPDATE estudiantes
            SET tiempo_total_segundos = tiempo_total_segundos + ?,
                updated_at = datetime('now')
            WHERE id = ?
        `).run(tiempo_segundos || 0, estudiante_id)
            }
        }

        db.prepare(`
            INSERT INTO intentos (
                estudiante_id, ejercicio_id, sesion_id,
                codigo_enviado, es_correcto, puntaje,
                numero_intento, errores_acumulados, tiempo_segundos,
                decision_tutor
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            estudiante_id, ejercicio_id, sesion_id,
            codigo_enviado, es_correcto ? 1 : 0, puntosGanados,
            errores_acumulados || 1, errores_acumulados || 0, tiempo_segundos || 0,
            tipo_intento || null
        )

        res.json({
            success: true,
            puntosGanados,
            resultado: resultadoPuntos
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Obtener historial de intentos del estudiante ──
app.get('/api/estudiantes/:estudiante_id/historial', (req, res) => {
    const { estudiante_id } = req.params

    try {
        const intentos = db.prepare(`
            SELECT
                i.id,
                i.es_correcto,
                i.puntaje,
                i.created_at,
                e.titulo,
                e.modulo,
                e.titulo_modulo,
                e.nivel
            FROM intentos i
                     JOIN ejercicios e ON i.ejercicio_id = e.id
            WHERE i.estudiante_id = ?
            ORDER BY i.created_at DESC
        `).all(estudiante_id)

        const progreso = db.prepare(`
            SELECT * FROM progreso_modulo
            WHERE estudiante_id = ?
        `).all(estudiante_id)

        res.json({ success: true, intentos, progreso })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Buscar ejercicio por título y módulo ──
app.get('/api/ejercicios/buscar', (req, res) => {
    const { titulo, modulo } = req.query

    try {
        const ejercicio = db.prepare(`
            SELECT * FROM ejercicios
            WHERE titulo = ? AND modulo = ?
                LIMIT 1
        `).get(titulo, modulo)

        if (!ejercicio) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Ejercicio no encontrado' }
            })
        }

        res.json({ success: true, ejercicio })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Obtener ejercicio por id ──
app.get('/api/ejercicios/:id', (req, res) => {
    const { id } = req.params
    try {
        const ejercicio = db.prepare('SELECT * FROM ejercicios WHERE id = ?').get(id)
        if (!ejercicio) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Ejercicio no encontrado' }
            })
        }
        res.json({ success: true, ejercicio })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Ejercicio de prueba ──
app.post('/api/ejercicios/prueba', (req, res) => {
    try {
        db.prepare(`
            INSERT INTO ejercicios (modulo, titulo_modulo, nivel, titulo, descripcion)
            VALUES ('variables_basicas', 'Variables básicas', 1, 'Introducción a variables', 'Ejercicio de prueba')
        `).run()

        const ejercicio = db.prepare(
            'SELECT * FROM ejercicios ORDER BY id DESC LIMIT 1'
        ).get()

        res.json({ success: true, ejercicio })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Tiempo total de práctica ──
app.get('/api/estudiantes/:estudiante_id/tiempo', (req, res) => {
    const { estudiante_id } = req.params
    try {
        const resultado = db.prepare(`
            SELECT COALESCE(SUM(tiempo_segundos), 0) as total_segundos
            FROM intentos
            WHERE estudiante_id = ?
        `).get(estudiante_id)

        res.json({ success: true, total_segundos: resultado.total_segundos })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// ── Buscar o crear ejercicio ──
app.post('/api/ejercicios/upsert', (req, res) => {
    const { titulo, modulo, titulo_modulo, nivel } = req.body

    if (!titulo || !modulo || !titulo_modulo || !nivel) {
        return res.status(400).json({
            success: false,
            error: { code: 'MISSING_FIELDS', message: 'Faltan campos requeridos' }
        })
    }

    try {
        // Busca si ya existe
        let ejercicio = db.prepare(`
            SELECT * FROM ejercicios WHERE titulo = ? AND modulo = ?
        `).get(titulo, modulo)

        // Si no existe, lo crea
        if (!ejercicio) {
            db.prepare(`
                INSERT INTO ejercicios (modulo, titulo_modulo, nivel, titulo, descripcion)
                VALUES (?, ?, ?, ?, ?)
            `).run(modulo, titulo_modulo, nivel, titulo, titulo)

            ejercicio = db.prepare(`
                SELECT * FROM ejercicios WHERE titulo = ? AND modulo = ?
            `).get(titulo, modulo)
        }

        res.json({ success: true, ejercicio })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: error.message }
        })
    }
})

// ── Crear usuario demo ──
app.post('/api/auth/demo', (req, res) => {
    try {
        const timestamp = Date.now()
        const moodle_id = `demo_${timestamp}`

        db.prepare(`
            INSERT INTO estudiantes (moodle_id, nombre, apellido, correo)
            VALUES (?, ?, ?, ?)
        `).run(moodle_id, 'Invitado', '', `demo_${timestamp}@tutoria.cl`)

        const estudiante = db.prepare(
            'SELECT * FROM estudiantes WHERE moodle_id = ?'
        ).get(moodle_id)

        db.prepare(`INSERT INTO sesiones (estudiante_id) VALUES (?)`).run(estudiante.id)

        const sesion = db.prepare(`
            SELECT * FROM sesiones WHERE estudiante_id = ? ORDER BY id DESC LIMIT 1
        `).get(estudiante.id)

        res.json({ success: true, estudiante, sesion_id: sesion.id })
    } catch (error) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } })
    }
})

// ── Eliminar usuario demo ──
app.delete('/api/auth/demo/:estudiante_id', (req, res) => {
    const { estudiante_id } = req.params
    try {
        const estudiante = db.prepare('SELECT * FROM estudiantes WHERE id = ?').get(estudiante_id)

        if (!estudiante || !estudiante.moodle_id.startsWith('demo_')) {
            return res.status(400).json({ success: false, error: { code: 'NOT_DEMO', message: 'No es un usuario demo' } })
        }

        db.prepare('DELETE FROM intentos WHERE estudiante_id = ?').run(estudiante_id)
        db.prepare('DELETE FROM progreso_modulo WHERE estudiante_id = ?').run(estudiante_id)
        db.prepare('DELETE FROM sesiones WHERE estudiante_id = ?').run(estudiante_id)
        db.prepare('DELETE FROM estudiantes WHERE id = ?').run(estudiante_id)

        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})