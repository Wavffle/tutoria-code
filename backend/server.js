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

// ── Registrar intento y calcular puntos ──
app.post('/api/intentos', (req, res) => {
    const {
        estudiante_id,
        ejercicio_id,
        sesion_id,
        codigo_enviado,
        es_correcto,
        tiempo_segundos,
        tipo_intento,
        nivel_ejercicio,
        errores_acumulados
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

        let puntosGanados = 0
        let resultadoPuntos = null

        if (es_correcto) {
            puntosGanados = calcularPuntos(tipo_intento, nivel_ejercicio)
            resultadoPuntos = actualizarPuntos(db, estudiante, puntosGanados)
        }

        db.prepare(`
            INSERT INTO intentos (
                estudiante_id, ejercicio_id, sesion_id,
                codigo_enviado, es_correcto, puntaje,
                numero_intento, errores_acumulados, tiempo_segundos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            estudiante_id, ejercicio_id, sesion_id,
            codigo_enviado, es_correcto ? 1 : 0, puntosGanados,
            errores_acumulados || 1, errores_acumulados || 0, tiempo_segundos || 0
        )

        if (es_correcto) {
            db.prepare(`
                UPDATE estudiantes
                SET ejercicios_completados = ejercicios_completados + 1,
                    ejercicios_correctos = ejercicios_correctos + 1,
                    updated_at = datetime('now')
                WHERE id = ?
            `).run(estudiante_id)
        }

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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})