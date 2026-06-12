# TutorIA Code

Proyecto desarrollado con React + Vite, Node.js y un modelo LLM local mediante Ollama.

## Requisitos

Antes de ejecutar el proyecto, instalar:

- Node.js (versión 18 o superior)
- Python 3.10 o superior
- Git
- Ollama — descargar desde https://ollama.com
- Un editor o IDE como IntelliJ, VS Code o WebStorm
- Google Chrome o Firefox (recomendado para compatibilidad con Pyodide)

## Dependencias principales

### Frontend
El proyecto usa las siguientes librerías (se instalan automáticamente con `npm install`):

- **React 18** — biblioteca de interfaces
- **React Router DOM** — navegación entre pantallas
- **@uiw/react-codemirror** — editor de código con syntax highlighting
- **@codemirror/lang-python** — soporte de Python en el editor
- **@codemirror/theme-one-dark** — tema oscuro del editor
- **Pyodide** — ejecuta Python real en el navegador (se carga desde CDN, requiere internet)

### Backend Python
Se instalan con `pip install`:
- **fastapi** — servidor de la capa cognitiva (LLM)
- **uvicorn** — servidor ASGI para FastAPI
- **ollama** — cliente para comunicarse con el modelo local

### Backend Node.js
Se instalan automáticamente con `npm install` dentro de `/backend`.

---

## Instalación inicial (solo la primera vez)

### 1. Instalar dependencias del frontend
```bash
npm install
```

### 2. Instalar dependencias del backend Node.js
```bash
cd backend
npm install
cd ..
```

### 3. Instalar dependencias del backend Python
```bash
pip install fastapi uvicorn ollama
```

### 4. Configurar el modelo LLM
- Solicitar el archivo `modelo_tutoria_q4_k_m.gguf` (4.58 GB) a un integrante del equipo
- Crear una carpeta en `C:\Users\<tu-usuario>\ollama-models\`
- Copiar el archivo `.gguf` dentro de esa carpeta
- Crear un archivo llamado `Modelfile` (sin extensión) en esa misma carpeta con este contenido:
- FROM C:\Users<tu-usuario>\ollama-models\modelo_tutoria_q4_k_m.gguf

- Registrar el modelo en Ollama:

```bash
cd C:\Users\<tu-usuario>\ollama-models
ollama create tutoria_modelv2 -f Modelfile
```

- Verificar que quedó registrado:

```bash
ollama list
```

Debe aparecer `tutoria_modelv2` en la lista.

---

## Para ejecutar el proyecto

Abrir **terminales** en este orden:

**Terminal 1 — Backend Python (capa cognitiva / LLM)**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 — Backend Node.js**
```bash
cd backend
npm run dev
```

**Terminal 3 — Frontend**
```bash
npm run dev
```

## URLs de los servicios

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Node.js | http://localhost:3001 |
| Backend Python (FastAPI) | http://localhost:8000 |
| Ollama (LLM) | http://localhost:11434 |