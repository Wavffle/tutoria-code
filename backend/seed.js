const db = require('./db')

const ejercicios = [
    // Módulo 1 - Variables básicas (nivel 1)
    { modulo: 'variables_basicas', titulo_modulo: 'Variables básicas', nivel: 1, titulo: 'Introducción a variables', total_ejercicios_modulo: 5 },
    { modulo: 'variables_basicas', titulo_modulo: 'Variables básicas', nivel: 1, titulo: 'Tipos de datos básicos', total_ejercicios_modulo: 5 },
    { modulo: 'variables_basicas', titulo_modulo: 'Variables básicas', nivel: 1, titulo: 'Operaciones con variables', total_ejercicios_modulo: 5 },
    { modulo: 'variables_basicas', titulo_modulo: 'Variables básicas', nivel: 1, titulo: 'Entrada y salida con variables', total_ejercicios_modulo: 5 },
    { modulo: 'variables_basicas', titulo_modulo: 'Variables básicas', nivel: 1, titulo: 'Cálculos integrados con variables', total_ejercicios_modulo: 5 },

    // Módulo 2 - Condicionales (nivel 2)
    { modulo: 'condicionales', titulo_modulo: 'Condicionales', nivel: 2, titulo: 'Estructura if simple', total_ejercicios_modulo: 5 },
    { modulo: 'condicionales', titulo_modulo: 'Condicionales', nivel: 2, titulo: 'Estructura if/else', total_ejercicios_modulo: 5 },
    { modulo: 'condicionales', titulo_modulo: 'Condicionales', nivel: 2, titulo: 'Condicionales con operadores lógicos', total_ejercicios_modulo: 5 },
    { modulo: 'condicionales', titulo_modulo: 'Condicionales', nivel: 2, titulo: 'Condicionales anidados con elif', total_ejercicios_modulo: 5 },
    { modulo: 'condicionales', titulo_modulo: 'Condicionales', nivel: 2, titulo: 'Validación de datos ingresados', total_ejercicios_modulo: 5 },

    // Módulo 3 - Bucles y repetición (nivel 3)
    { modulo: 'bucles_repeticion', titulo_modulo: 'Bucles y repetición', nivel: 3, titulo: 'Bucle while con condición simple', total_ejercicios_modulo: 5 },
    { modulo: 'bucles_repeticion', titulo_modulo: 'Bucles y repetición', nivel: 3, titulo: 'Bucle for con range()', total_ejercicios_modulo: 5 },
    { modulo: 'bucles_repeticion', titulo_modulo: 'Bucles y repetición', nivel: 3, titulo: 'Contadores y acumuladores', total_ejercicios_modulo: 5 },
    { modulo: 'bucles_repeticion', titulo_modulo: 'Bucles y repetición', nivel: 3, titulo: 'Bucles con condicionales', total_ejercicios_modulo: 5 },
    { modulo: 'bucles_repeticion', titulo_modulo: 'Bucles y repetición', nivel: 3, titulo: 'Repetición con entrada de usuario', total_ejercicios_modulo: 5 },
]

// Borrar en orden correcto respetando foreign keys
db.prepare('DELETE FROM intentos').run()
db.prepare('DELETE FROM ejercicios').run()
db.prepare("DELETE FROM sqlite_sequence WHERE name='intentos'").run()
db.prepare("DELETE FROM sqlite_sequence WHERE name='ejercicios'").run()

// Insertar todos los ejercicios
const insert = db.prepare(`
    INSERT INTO ejercicios (modulo, titulo_modulo, total_ejercicios_modulo, nivel, titulo, descripcion)
    VALUES (?, ?, ?, ?, ?, 'Contenido generado por IA')
`)

ejercicios.forEach(ej => {
    insert.run(ej.modulo, ej.titulo_modulo, ej.total_ejercicios_modulo, ej.nivel, ej.titulo)
})

console.log(`✓ ${ejercicios.length} ejercicios insertados correctamente`)