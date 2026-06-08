export const feedbackData = {
  ejercicio: 'Estructura if/else',
  modulo: 'Condicionales',
  puntaje: 100,
  puntosGanados: 120,
  intentos: 1,
  nivelActual: 'INTERMEDIO',
  siguienteNivel: 'AVANZADO',
  puntosActuales: 240,
  puntosParaSiguienteNivel: 750,

  codigoEstudiante: `edadUsuario = 18\n\nif edadUsuario >= 18:\n    print("Acceso permitido")\nelse:\n    print("Acceso denegado")`,
  codigoSolucion: `edad = 18\n\nif edad >= 18:\n    print("Acceso permitido")\nelse:\n    print("Acceso denegado")`,
  mensajeResumen: 'Tu solución es correcta. Has usado las variables y operaciones adecuadas.',

  explicacion: {
    intro: 'Tu código funciona correctamente porque:',
    puntos: [
      { texto: 'Usaste una condición if para comprobar si edad >= 18.' },
      { texto: 'Agregaste un bloque else para cubrir el caso contrario.' },
      { texto: 'La lógica distingue correctamente entre acceso permitido y acceso denegado.' },
    ],
    recuerda: 'la estructura if/else permite que un programa tome decisiones entre dos caminos posibles según si una condición se cumple o no.',
  },

  ejerciciosModulo: 2,
  ejerciciosTotalModulo: 5,

  decision: {
    resultado: 'Correcto',
    intentos: 1,
    nivelActual: 'INTERMEDIO',
    accion: 'Aumentar la dificultad',
    mensaje: 'Se creará un nuevo ejercicio en base a tu desempeño',
  },

  conceptos: [
    'Comparación con >=',
    'Uso de estructura if/else',
    'Mensaje para condición verdadera.',
    'Mensaje para condición falsa.',
  ],

  historial: [
  ],
}