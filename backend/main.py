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
        instruccion_dificultad = f"IMPORTANTE: El estudiante cometió 1 error en '{req.categoria}'. Genera un ejercicio ligeramente más simple sobre este mismo concepto."
    elif req.errores_previos == 2:
        instruccion_dificultad = f"IMPORTANTE: El estudiante cometió 2 errores en '{req.categoria}'. Genera un ejercicio bastante simple con instrucciones muy claras, enfocado en el concepto básico de {req.categoria}."
    elif req.errores_previos >= 3:
        instruccion_dificultad = f"IMPORTANTE: El estudiante cometió {req.errores_previos} errores en '{req.categoria}'. Genera el ejercicio más simple posible sobre {req.categoria}, casi guiado, para que el estudiante recupere confianza en este concepto específico."

    prompt = f"""
    Eres TutorIA, un tutor de programación para estudiantes de primer semestre universitario que están aprendiendo Python.
    
    Genera un ejercicio de programación en Python con estas características:
    Módulo: {req.modulo}
    Categoría: {req.categoria}
    Nivel: {req.nivel}
    Errores previos del estudiante: {req.errores_previos}
    {instruccion_dificultad}

    GUÍA DE NIVELES:
    - BASICO: El estudiante recién aprendió el concepto. UN solo concepto, valores ya definidos como variables, sin operaciones complejas. El ejercicio debe poder resolverse en 3-6 líneas máximo. NO uses verbos como "calcula" o "determina" si no hay una operación real que hacer — si los valores ya están dados, solo hay que usarlos directamente. Ejemplo: "Dada la variable nombre = 'Ana' y edad = 20, imprime un mensaje que diga su nombre y edad."
    - INTERMEDIO: El estudiante ya entiende el concepto básico. Ejercicios con 2-3 variables, puede incluir una operación aritmética simple o una condición. Situaciones cotidianas con un resultado claro. El ejercicio debe poder resolverse en 5-8 líneas. Ejemplo: "Dados precio = 1500 y descuento = 10, calcula el precio final si el descuento aplica solo cuando el precio supera 1000."
    - AVANZADO: El estudiante domina el concepto. Ejercicios que combinan 2 conceptos del módulo, lógica con múltiples condiciones o iteraciones, pero sin salirse del temario de primer semestre. El ejercicio debe poder resolverse en 8-15 líneas. Ejemplo: "Clasifica una nota del 1 al 7 en Reprobado, Suficiente, Bueno o Excelente según rangos definidos e imprime cuántos puntos le faltan para el siguiente nivel."

    REGLAS OBLIGATORIAS:
    - El ejercicio DEBE practicar específicamente: {req.categoria}
    - NUNCA uses input() ni raw_input(). Todos los valores deben estar definidos como variables en el código.
    - El ejercicio debe poder ejecutarse sin ninguna interacción del usuario.
    - La descripción debe ser clara y mencionar los valores exactos con los que trabajar.
    - El enunciado debe dejar claro qué debe imprimir el programa.

    CAMPOS OBLIGATORIOS — ninguno puede estar vacío:
    - 'descripcion': explicación clara de qué hacer, mencionando los valores exactos a usar. Debe tener entre 40 y 80 palabras. Incluye: qué debe hacer el programa, con qué valores trabajar y qué debe imprimir.
    - 'salidaEsperada': exactamente qué imprime el programa al ejecutarse.
    - 'consejo': tip breve útil relacionado al concepto. NUNCA empieces con "Recuerda" ni "Recuerda que", ve directo al tip.

    Devuelve ESTRICTAMENTE un JSON con este formato:
    {{
        "titulo": "Nombre corto del ejercicio",
        "descripcion": "Instrucciones claras mencionando los valores exactos a usar",
        "codigoSolucion": "La solución ideal y COMPLETA en Python que resuelve todos los casos del ejercicio, no solo el caso básico. Debe ser igual o más completa que el código del estudiante si este es correcto.",
        "salidaEsperada": "Lo que imprime codigoSolucion al ejecutarse (verifica el cálculo paso a paso)",
        "consejo": "Un tip breve relacionado al concepto practicado",
        "archivo": "nombre_descriptivo_del_ejercicio.py (ej: calcular_edad.py, suma_variables.py)"
    }}
    IMPORTANTE: El codigoSolucion debe ser similar en complejidad y estilo al código del estudiante. Si el estudiante resolvió sin funciones, la solución no debe usar funciones. La solución ideal es la más simple y directa posible para el nivel del estudiante.
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
    Eres TutorIA. El alumno de nivel {req.nivel} necesita una pista para este ejercicio:
    
    Descripción: "{req.descripcion_ejercicio}"
    
    Código actual del alumno:
```python
    {req.codigo_actual}
```
    
    Dame una pista MUY BREVE (1 oración) que ayude al alumno a avanzar específicamente en ESTE ejercicio.
    La pista debe ser coherente con lo que pide la descripción, sin inventar objetivos que no existen.
    NO le des el código resuelto. NO menciones conceptos que no sean necesarios para resolver este ejercicio.
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
    Nota: Si el estado es correcto, deja feedbackIncorrecto con campos vacíos. Si el estado es incorrecto, deja feedbackCorrecto con campos vacíos. Evalúa basándote en si el programa produce la salida correcta, no en el estilo del código.
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
        "codigoSolucion": "ÚNICAMENTE código Python ejecutable, sin texto explicativo ni comentarios. Solo líneas de código puro. Puede ser igual al código del estudiante o ligeramente más limpio.",
        "mensajeResumen": "Una oración específica sobre POR QUÉ el código del estudiante es correcto, mencionando qué usó bien. NO uses frases genéricas como 'el código es correcto'.",
        "explicacion": {{
            "intro": "Tu código funciona correctamente porque:",
            "puntos": [
                {{
                    "texto": "Usaste una condición if para comprobar la variable."
                }},
                {{
                    "texto": "Definiste correctamente las variables necesarias."
                }}
            ],
            "recuerda": "OBLIGATORIO. Un tip adicional sobre buenas prácticas que NO repita lo que ya se dijo en los puntos anteriores.",
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
    Nota para la lista 'puntos': USA SOLO el campo 'texto' para construir frases completas. NO uses 'bold', 'bold2', 'texto2' ni 'texto3'. Cada punto debe ser una frase completa y clara en el campo 'texto' únicamente.
    """

    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        datos_ia = json.loads(response['message']['content'])
        return datos_ia
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))