from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
import json

app = FastAPI(title="TutorIA Code API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReqGenerar(BaseModel):
    modulo: str
    categoria: str
    nivel: str
    errores_previos: int = 0

class ReqPista(BaseModel):
    descripcion_ejercicio: str
    nivel: str
    codigo_actual: str

class ReqEvaluar(BaseModel):
    modulo: str
    categoria: str
    descripcion_ejercicio: str
    codigo_usuario: str
    salida_consola: str
    es_error_sintaxis: bool

@app.post("/api/generar_ejercicio")
async def generar_ejercicio(req: ReqGenerar):
    instruccion_dificultad = ""
    if req.errores_previos == 1:
        instruccion_dificultad = "IMPORTANTE: El estudiante cometió 1 error previo. Genera un ejercicio ligeramente más simple y directo que ayude a afianzar el concepto básico."
    elif req.errores_previos == 2:
        instruccion_dificultad = "IMPORTANTE: El estudiante cometió 2 errores previos. Genera un ejercicio bastante simple, con instrucciones muy claras y un solo concepto a practicar."
    elif req.errores_previos >= 3:
        instruccion_dificultad = "IMPORTANTE: El estudiante cometió 3 o más errores previos. Genera el ejercicio más simple posible sobre este tema, con un ejemplo casi guiado para recuperar confianza."

    prompt = f"""
    Eres TutorIA. Genera un NUEVO ejercicio de programación en Python.
    Módulo: {req.modulo}
    Categoría: {req.categoria}
    Nivel: {req.nivel}
    Errores previos del estudiante: {req.errores_previos}
    {instruccion_dificultad}

    RESTRICCIONES TÉCNICAS OBLIGATORIAS:
    - NUNCA uses input() ni raw_input(). El entorno no soporta entrada del usuario.
    - Todos los valores deben estar definidos directamente en el código como variables.
    - El ejercicio debe poder ejecutarse sin ninguna interacción del usuario.
    
    Devuelve ESTRICTAMENTE un JSON con este formato:
    {{
        "titulo": "Nombre corto del ejercicio",
        "descripcion": "Instrucciones claras para el alumno",
        "codigoSolucion": "El código Python que resuelve el ejercicio correctamente",
        "salidaEsperada": "Lo que imprime codigoSolucion al ejecutarse (verifica el cálculo paso a paso antes de escribirlo)",
        "consejo": "Un breve tip",
        "archivo": "nombre_archivo.py"
    }}

    IMPORTANTE: Escribe primero codigoSolucion, luego deriva salidaEsperada ejecutando mentalmente ese código paso a paso. Ambos deben ser consistentes entre sí.
    """
    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        return json.loads(response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/pedir_pista")
async def pedir_pista(req: ReqPista):
    prompt = f"""
    Eres TutorIA. El alumno de nivel {req.nivel} pide una pista para este ejercicio: "{req.descripcion_ejercicio}".
    Este es su código actual:
```python
    {req.codigo_actual}
```
    Dame una pista muy breve (1 oración) para ayudarlo a avanzar, adaptada a su nivel. NO le des el código resuelto.
    Devuelve ESTRICTAMENTE un JSON: {{"pistaBton": "tu pista aquí"}}
    """
    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        return json.loads(response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/evaluar_codigo")
async def evaluar_codigo(req: ReqEvaluar):
    prompt = f"""
    Eres TutorIA. Evalúa el intento del estudiante.
    Ejercicio: {req.descripcion_ejercicio}
    Código del estudiante:
```python
    {req.codigo_usuario}
```
    Salida de la consola (Pyodide):
```text
    {req.salida_consola}
```
    ¿Es error de sintaxis?: {req.es_error_sintaxis}

    Analiza y devuelve ESTRICTAMENTE un JSON con este formato EXACTO:
    {{
        "estado": "correcto" o "incorrecto",
        "feedbackCorrecto": {{
            "texto": "¡Correcto! ...",
            "conceptosLogrados": ["concepto 1", "concepto 2"]
        }},
        "feedbackIncorrecto": {{
            "texto": "Incorrecto. ...",
            "errorTitulo": "Título corto del error",
            "errorDesc": "Explicación amigable del error",
            "conceptosLogrados": ["lo que hizo bien"],
            "conceptosError": ["lo que hizo mal"],
            "decisionTutor": "bajar_dificultad" o "mantener" o "generar_refuerzo"
        }}
    }}
    Nota: Si el estado es correcto, deja feedbackIncorrecto vacío, y viceversa.
    """
    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        return json.loads(response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ReqFeedback(BaseModel):
    descripcion_ejercicio: str
    codigo_estudiante: str
    intentos_utilizados: int
    nivel_actual: str

@app.post("/api/generar_feedback")
async def generar_feedback(req: ReqFeedback):
    accion_tutor = "Aumentar la dificultad" if req.intentos_utilizados == 1 else "Mantener nivel"
    mensaje_decision = "Se creará un nuevo ejercicio de mayor dificultad." if req.intentos_utilizados == 1 else "Continuaremos practicando en este nivel para consolidar."

    prompt = f"""
    Eres TutorIA. El estudiante de nivel {req.nivel_actual} resolvió este ejercicio correctamente en {req.intentos_utilizados} intento(s):
    "{req.descripcion_ejercicio}"

    Código del estudiante:
```python
    {req.codigo_estudiante}
```

    Analiza su código y devuelve ESTRICTAMENTE un JSON con esta estructura exacta para alimentar la UI:
    {{
        "codigoSolucion": "Escribe aquí la solución ideal en Python (puede ser igual a la del alumno o ligeramente más limpia)",
        "mensajeResumen": "Una oración indicando por qué está bien (ej: Has usado las variables y operaciones adecuadas).",
        "explicacion": {{
            "intro": "Tu código funciona correctamente porque:",
            "puntos": [
                {{
                    "texto": "Usaste una condición ",
                    "bold": "if",
                    "texto2": " para comprobar la variable."
                }}
            ],
            "recuerda": "Un tip extra sobre buenas prácticas."
        }},
        "conceptos": ["Concepto clave 1", "Concepto clave 2", "Concepto clave 3"],
        "decision": {{
            "resultado": "Correcto",
            "intentos": {req.intentos_utilizados},
            "nivelActual": "{req.nivel_actual}",
            "accion": "{accion_tutor}",
            "mensaje": "{mensaje_decision}"
        }}
    }}
    Nota para la lista 'puntos': Puedes usar 'texto', 'bold', 'texto2', 'bold2', 'texto3' para armar la frase con palabras destacadas según soporte el frontend.
    """

    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        datos_ia = json.loads(response['message']['content'])
        return datos_ia
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))