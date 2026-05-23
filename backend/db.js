const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'tutoria.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        moodle_id TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        correo TEXT UNIQUE NOT NULL,
        nivel_actual INTEGER NOT NULL DEFAULT 1,
        progreso_nivel INTEGER NOT NULL DEFAULT 0,
        ejercicios_completados INTEGER NOT NULL DEFAULT 0,
        ejercicios_correctos INTEGER NOT NULL DEFAULT 0,
        tiempo_total_segundos INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

    CREATE TABLE IF NOT EXISTS sesiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER NOT NULL,
        fecha_inicio TEXT NOT NULL DEFAULT (datetime('now')),
        fecha_cierre TEXT,
        activa INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
        );

    CREATE TABLE IF NOT EXISTS ejercicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modulo TEXT NOT NULL,
        titulo_modulo TEXT NOT NULL,
        total_ejercicios_modulo INTEGER NOT NULL DEFAULT 0,
        nivel INTEGER NOT NULL,
        lenguaje TEXT NOT NULL DEFAULT 'python',
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        salida_esperada TEXT,
        conceptos TEXT,
        es_refuerzo INTEGER NOT NULL DEFAULT 0,
        ejercicio_origen_id INTEGER,
        prompt_enviado TEXT,
        modelo_usado TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (ejercicio_origen_id) REFERENCES ejercicios(id)
        );

    CREATE TABLE IF NOT EXISTS intentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER NOT NULL,
        ejercicio_id INTEGER NOT NULL,
        sesion_id INTEGER NOT NULL,
        codigo_enviado TEXT NOT NULL,
        es_correcto INTEGER NOT NULL DEFAULT 0,
        puntaje REAL,
        numero_intento INTEGER NOT NULL DEFAULT 1,
        errores_acumulados INTEGER NOT NULL DEFAULT 0,
        tiempo_segundos INTEGER,
        feedback TEXT,
        decision_tutor TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
        FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id),
        FOREIGN KEY (sesion_id) REFERENCES sesiones(id)
        );

    CREATE TABLE IF NOT EXISTS progreso_modulo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER NOT NULL,
        modulo TEXT NOT NULL,
        titulo_modulo TEXT NOT NULL,
        total_ejercicios INTEGER NOT NULL DEFAULT 0,
        ejercicios_completados INTEGER NOT NULL DEFAULT 0,
        ejercicios_correctos INTEGER NOT NULL DEFAULT 0,
        errores_acumulados INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
        UNIQUE (estudiante_id, modulo)
        );

    CREATE TABLE IF NOT EXISTS contexto_cognitivo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER UNIQUE NOT NULL,
        modulo_activo TEXT,
        ejercicios_correctos_consecutivos INTEGER NOT NULL DEFAULT 0,
        ejercicios_incorrectos_consecutivos INTEGER NOT NULL DEFAULT 0,
        ultima_decision TEXT,
        ultimo_ejercicio_id INTEGER,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
        FOREIGN KEY (ultimo_ejercicio_id) REFERENCES ejercicios(id)
        );
`);

console.log('Base de datos lista ✓');

module.exports = db;