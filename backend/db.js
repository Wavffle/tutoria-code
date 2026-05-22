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
        correo TEXT NOT NULL,
        nivel TEXT DEFAULT 'basico',
        lenguaje TEXT DEFAULT 'python',
        progreso_nivel INTEGER DEFAULT 0,
        ejercicios_completados INTEGER DEFAULT 0,
        ejercicios_correctos INTEGER DEFAULT 0,
        tiempo_total_segundos INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
        );

    CREATE TABLE IF NOT EXISTS ejercicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        modulo TEXT NOT NULL,
        titulo_modulo TEXT NOT NULL,
        total_ejercicios_modulo INTEGER DEFAULT 0,
        nivel TEXT NOT NULL,
        lenguaje TEXT DEFAULT 'python',
        descripcion TEXT NOT NULL,
        salida_esperada TEXT NOT NULL,
        conceptos TEXT,
        created_at TEXT DEFAULT (datetime('now'))
        );

    CREATE TABLE IF NOT EXISTS intentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER NOT NULL,
        ejercicio_id INTEGER NOT NULL,
        codigo_enviado TEXT,
        es_correcto INTEGER DEFAULT 0,
        puntaje INTEGER DEFAULT 0,
        numero_intento INTEGER DEFAULT 1,
        errores_acumulados INTEGER DEFAULT 0,
        tiempo_segundos INTEGER DEFAULT 0,
        feedback TEXT,
        decision_tutor TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
        FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id)
        );

    CREATE TABLE IF NOT EXISTS progreso_modulo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER NOT NULL,
        modulo TEXT NOT NULL,
        titulo_modulo TEXT NOT NULL,
        total_ejercicios INTEGER DEFAULT 0,
        ejercicios_completados INTEGER DEFAULT 0,
        ejercicios_correctos INTEGER DEFAULT 0,
        errores_acumulados INTEGER DEFAULT 0,
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
        );
`);

console.log('Base de datos lista ✓');

module.exports = db;