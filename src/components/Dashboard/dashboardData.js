export const userData = {
  nombre: 'Nombre Apellido',
  nivel: 'Intermedio',
  lenguaje: 'Python',
  puntos: 120,
  puntosParaSiguienteNivel: 750,
  sugerencia: 'Es recomendado practicar condicionales',
}

// Niveles en orden para comparar
const NIVELES = ['Basico', 'Intermedio', 'Avanzado']

function nivelPermite(nivelUsuario, nivelMinimo) {
  return NIVELES.indexOf(nivelUsuario) >= NIVELES.indexOf(nivelMinimo)
}

export const modulos = [
  {
    id: 1,
    titulo: 'Variables básicas',
    nivelMinimo: 'Basico',
    desbloqueado: nivelPermite(userData.nivel, 'Basico'),
    progreso: 5,
    progresoTotal: 5,
    ejercicios: [
      { id: 'ia-1', tipo: 'ia', texto: 'Prácticas generadas por IA', estado: 'ia' },
      { id: 'e1-1', tipo: 'ejercicio', texto: 'Introducción a variables',        estado: nivelPermite(userData.nivel, 'Basico') ? 'completado' : 'bloqueado' },
      { id: 'e1-2', tipo: 'ejercicio', texto: 'Tipos de datos básicos',          estado: nivelPermite(userData.nivel, 'Basico') ? 'completado' : 'bloqueado' },
      { id: 'e1-3', tipo: 'ejercicio', texto: 'Operaciones con variables',       estado: nivelPermite(userData.nivel, 'Basico') ? 'completado' : 'bloqueado' },
      { id: 'e1-4', tipo: 'ejercicio', texto: 'Entrada y salida con variables',  estado: nivelPermite(userData.nivel, 'Basico') ? 'completado' : 'bloqueado' },
      { id: 'e1-5', tipo: 'ejercicio', texto: 'Cálculos integrados con variables', estado: nivelPermite(userData.nivel, 'Basico') ? 'completado' : 'bloqueado' },
    ],
  },
  {
    id: 2,
    titulo: 'Condicionales',
    nivelMinimo: 'Intermedio',
    desbloqueado: nivelPermite(userData.nivel, 'Intermedio'),
    progreso: 1,
    progresoTotal: 5,
    ejercicios: [
      { id: 'ia-2', tipo: 'ia', texto: 'Prácticas generadas por IA', estado: 'ia' },
      { id: 'e2-1', tipo: 'ejercicio', texto: 'Estructura if simple',                   estado: nivelPermite(userData.nivel, 'Intermedio') ? 'completado' : 'bloqueado' },
      { id: 'e2-2', tipo: 'ejercicio', texto: 'Estructura if/else',                     estado: nivelPermite(userData.nivel, 'Intermedio') ? 'disponible' : 'bloqueado' },
      { id: 'e2-3', tipo: 'ejercicio', texto: 'Condicionales con operadores lógicos',   estado: nivelPermite(userData.nivel, 'Intermedio') ? 'disponible' : 'bloqueado' },
      { id: 'e2-4', tipo: 'ejercicio', texto: 'Condicionales anidados con elif',        estado: nivelPermite(userData.nivel, 'Intermedio') ? 'disponible' : 'bloqueado' },
      { id: 'e2-5', tipo: 'ejercicio', texto: 'Validación de datos ingresados',         estado: nivelPermite(userData.nivel, 'Intermedio') ? 'disponible' : 'bloqueado' },
    ],
  },
  {
    id: 3,
    titulo: 'Bucles y repetición',
    nivelMinimo: 'Avanzado',
    desbloqueado: nivelPermite(userData.nivel, 'Avanzado'),
    progreso: 0,
    progresoTotal: 5,
    ejercicios: [
      { id: 'ia-3', tipo: 'ia', texto: 'Prácticas generadas por IA', estado: 'ia' },
      { id: 'e3-1', tipo: 'ejercicio', texto: 'Bucle while con condición simple',     estado: nivelPermite(userData.nivel, 'Avanzado') ? 'disponible' : 'bloqueado' },
      { id: 'e3-2', tipo: 'ejercicio', texto: 'Bucle for con range()',                estado: nivelPermite(userData.nivel, 'Avanzado') ? 'disponible' : 'bloqueado' },
      { id: 'e3-3', tipo: 'ejercicio', texto: 'Contadores y acumuladores',            estado: nivelPermite(userData.nivel, 'Avanzado') ? 'disponible' : 'bloqueado' },
      { id: 'e3-4', tipo: 'ejercicio', texto: 'Bucles con condicionales',             estado: nivelPermite(userData.nivel, 'Avanzado') ? 'disponible' : 'bloqueado' },
      { id: 'e3-5', tipo: 'ejercicio', texto: 'Repetición con entrada de usuario',    estado: nivelPermite(userData.nivel, 'Avanzado') ? 'disponible' : 'bloqueado' },
    ],
  },
]