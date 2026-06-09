n# TutorIA Code

Proyecto desarrollado con React + Vite.

## Requisitos

Antes de ejecutar el proyecto, instalar:

- Node.js (versión 18 o superior)
- Git
- Un editor o IDE como IntelliJ, VS Code o WebStorm
- Google Chrome o Firefox (recomendado para compatibilidad con Pyodide)

## Dependencias principales

El proyecto usa las siguientes librerías (se instalan automáticamente con `npm install`):

- **React 18** — biblioteca de interfaces
- **React Router DOM** — navegación entre pantallas
- **@uiw/react-codemirror** — editor de código con syntax highlighting
- **@codemirror/lang-python** — soporte de Python en el editor
- **@codemirror/theme-one-dark** — tema oscuro del editor
- **Pyodide** — ejecuta Python real en el navegador (se carga desde CDN, requiere internet)

## Para ejecutar el proyecto

1. Clonar el repositorio
2. Abrir la terminal dentro de la carpeta del proyecto y ejecutar en orden:

```bash
npm install
npm run dev
```

3. Abrir en el navegador la URL que aparecerá.

Ejemplo: `http://localhost:5173/`