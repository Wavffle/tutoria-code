// Simula lo que devolvería POST /api/practices/generate
export const ejercicioData = {
  exerciseId: 'exercise_789',
  modulo: 'Variables básicas',
  moduloSlug: 'MODULO - VARIABLES BASICAS',
  practica: 'Introducción a variables',
  ejercicioNum: 5,
  ejercicioTotal: 6,
  nivel: 'BASICO',
  lenguaje: 'Python',
  errores: 0,
  archivo: 'variables_basicas.py',
  titulo: 'Uso de variables en cálculos',
  descripcion: 'Crea un programa que calcule el total de una compra. Para ello, debes crear dos variables: una para guardar el precio de un producto y otra para guardar la cantidad comprada. Luego, calcula el total multiplicando ambos valores y muestra el resultado en pantalla.',
  salidaEsperada: 'El total de la compra es: 15000',
  pista: 'Recuerda: puedes usar variables para guardar valores y realizar operaciones entre ellos',
  pistaBton: 'Intenta multiplicar precio por cantidad usando el operador *',

  // Simula lo que devolvería POST /api/exercises/:id/evaluate — correcto
  feedbackCorrecto: {
    resultado: 'correcto',
    texto: '¡Correcto! Tu solución cubre los casos esperados. Definiste correctamente las variables precio y cantidad, realizaste el cálculo usando multiplicación y mostraste el resultado final en pantalla.',
    conceptosLogrados: ['Variables asignadas', 'Calculo realizado', 'print()'],
  },

  // Simula lo que devolvería POST /api/exercises/:id/evaluate — incorrecto
  feedbackIncorrecto: {
    resultado: 'incorrecto',
    texto: 'Incorrecto. Tu calculo es incorrecto. Revisa el uso de variables y la operación que usaste para calcular el total.',
    errorTitulo: 'ERROR DETECTADO',
    errorDesc: 'El total es el resultado de multiplicar el precio y la cantidad. Reemplaza el operador "+".',
    conceptosLogrados: ['Variables asignadas', 'print()', 'Operación incorrecta'],
    decisionTutor: 'Se generará un ejercicio de refuerzo adecuado para que practiques el concepto.',
  },
}
