// Simula lo que devolvería POST /api/exercises/:id/evaluate
export const feedbackData = {
  ejercicio: 'Introducción a variables',
  modulo: 'Variables básicas',
  puntaje: 100,
  intentos: 1,
  nivelActual: 'BÁSICO',
  siguienteNivel: 'INTERMEDIO',

  // Resumen
  codigoEstudiante: `precio = 3000\ncantidad = 5\n\ntotal = precio * cantidad\n\nprint("El total de la compra es:", total)`,
  codigoSolucion: `precio = 3000\ncantidad = 5\n\ntotal = precio * cantidad\n\nprint("El total de la compra es:", total)`,
  mensajeResumen: 'Tu solución es correcta. Has usado las variables y operaciones adecuadas.',

  // Explicación IA
  explicacion: {
    intro: 'Tu código funciona correctamente porque:',
    puntos: [
      { texto: 'Definiste las variables ', bold: 'precio', texto2: ' y ', bold2: 'cantidad', texto3: ' correctamente.' },
      { texto: 'Mutiplicaste ambas variables para obtener el total.' },
      { texto: 'Mostraste el resultado por pantalla usando ', bold: 'print().' },
    ],
    recuerda: 'Recuerda: el orden de las operaciones importa y siempre podemos reutilizar variables.',
  },

  // Progreso
  ejerciciosModulo: 1,
  ejerciciosTotalModulo: 6,
  ejerciciosTotales: 1,
  ejerciciosTotalesNivel: 10,

  // Decisión tutor
  decision: {
    resultado: 'Correcto',
    intentos: 1,
    nivelActual: 'BASICO',
    accion: 'Aumentar la dificultad',
    mensaje: 'Se creará un nuevo ejercicio en base a tu desempeño',
  },

  // Conceptos reforzados
  conceptos: [
    'Declaración de variables',
    'Asignación de valores',
    'Operaciones aritméticas',
    'Salidas de datos con print()',
  ],

  // Historial — vacío para usuario nuevo
  historial: [],
}
