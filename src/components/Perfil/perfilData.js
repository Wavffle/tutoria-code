export const perfilData = {
  nombre: 'Nombre',
  apellido: 'Apellido',
  iniciales: 'NA',
  curso: 'Fundamentos de Algoritmos',
  nivelActual: 'INTERMEDIO',
  lenguaje: 'Python',

  // Sistema de puntos
  puntos: 120,
  puntosParaSiguienteNivel: 750,
  siguienteNivel: 'AVANZADO',

  // Estadísticas
  modulosCompletados: 1,
  modulosTotal: 3,
  porcentajeCurso: 33,
  ejerciciosResueltos: 6,
  tiempoPractica: 2.3,

  recomendacion: {
    texto: 'Para seguir avanzando, te recomiendo practicar más ejercicios sobre',
    tema: 'estructuras condicionales',
  },

  historial: [
    { id: 1, ejercicio: 'Introducción a variables', modulo: 'Variables básicas', resultado: 100, estado: 'Completado' },
    { id: 2, ejercicio: 'Tipos de datos básicos', modulo: 'Variables básicas', resultado: 100, estado: 'Completado' },
    { id: 3, ejercicio: 'Operaciones con variables', modulo: 'Variables básicas', resultado: 100, estado: 'Completado' }
  ],
}