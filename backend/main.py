from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
import json
import random
import ast
import os
import subprocess
import sys
import tempfile

app = FastAPI(title="TutorIA Code API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# SISTEMA DE PATRONES PEDAGÓGICOS
# ==========================================

PATRONES = {
    'Introducción a variables': [
        {
            'id': 'asignar_imprimir',
            'descripcion': 'Define 2-3 variables con valores concretos e imprímelas directamente con print(), una por línea.',
            'ejemplo_codigo': 'nombre = "Ana"\nedad = 22\nprint(nombre)\nprint(edad)',
            'ejemplo_salida': 'Ana\n22',
            'prohibido': 'type(), if, else, elif, for, while, f-strings'
        },
        {
            'id': 'imprimir_con_etiqueta',
            'descripcion': 'Define 2-3 variables y muéstralas con una etiqueta descriptiva usando print() con coma.',
            'ejemplo_codigo': 'ciudad = "Santiago"\npoblacion = 7000000\nprint("Ciudad:", ciudad)\nprint("Población:", poblacion)',
            'ejemplo_salida': 'Ciudad: Santiago\nPoblación: 7000000',
            'prohibido': 'type(), if, else, elif, for, while, f-strings'
        },
        {
            'id': 'imprimir_fstring',
            'descripcion': 'Define 2-3 variables y muéstralas dentro de una oración usando f-strings.',
            'ejemplo_codigo': 'producto = "cuaderno"\nprecio = 990\nprint(f"El {producto} cuesta ${precio}")',
            'ejemplo_salida': 'El cuaderno cuesta $990',
            'prohibido': 'type(), if, else, elif, for, while'
        },
        {
            'id': 'reasignar_variable',
            'descripcion': 'Define una variable, imprímela, luego cambia su valor e imprímela de nuevo para mostrar que las variables pueden cambiar.',
            'ejemplo_codigo': 'puntaje = 0\nprint(puntaje)\npuntaje = 10\nprint(puntaje)',
            'ejemplo_salida': '0\n10',
            'prohibido': 'type(), if, else, elif, for, while'
        },
        {
            'id': 'multiples_en_una_linea',
            'descripcion': 'Define 3 variables y muéstralas todas en una sola línea con print() usando comas.',
            'ejemplo_codigo': 'mes = "Junio"\ndia = 15\nanio = 2025\nprint(mes, dia, anio)',
            'ejemplo_salida': 'Junio 15 2025',
            'prohibido': 'type(), if, else, elif, for, while'
        }
    ],

    'Tipos de datos básicos': [
        {
            'id': 'mostrar_valor_y_tipo',
            'descripcion': 'Define variables de tipo str, int, float y bool. Imprime el valor y su tipo usando type().',
            'ejemplo_codigo': 'nombre = "Luis"\nedad = 20\naltura = 1.75\nactivo = True\nprint(nombre, type(nombre))\nprint(edad, type(edad))\nprint(altura, type(altura))\nprint(activo, type(activo))',
            'ejemplo_salida': 'Luis <class \'str\'>\n20 <class \'int\'>\n1.75 <class \'float\'>\nTrue <class \'bool\'>',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'comparar_type',
            'descripcion': 'Define variables y usa type(variable) == tipo para verificar si son del tipo esperado. Imprime True o False.',
            'ejemplo_codigo': 'edad = 25\nnombre = "Pedro"\nprint(type(edad) == int)\nprint(type(nombre) == str)',
            'ejemplo_salida': 'True\nTrue',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'diferenciar_int_float',
            'descripcion': 'Define variables numéricas donde algunas son int y otras float. Imprime el tipo de cada una para diferenciarlas.',
            'ejemplo_codigo': 'cantidad = 5\nprecio = 1990.5\nprint(type(cantidad))\nprint(type(precio))',
            'ejemplo_salida': '<class \'int\'>\n<class \'float\'>',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'string_que_parece_numero',
            'descripcion': 'Define un código o identificador numérico como str (ej: RUT, código de curso) y muestra que su tipo es str, no int.',
            'ejemplo_codigo': 'codigo = "INF101"\nseccion = 2\nprint(type(codigo))\nprint(type(seccion))',
            'ejemplo_salida': '<class \'str\'>\n<class \'int\'>',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'ficha_de_datos',
            'descripcion': 'Define variables de distintos tipos para describir una entidad (persona, producto, etc.). Imprímelas con etiquetas sin usar type().',
            'ejemplo_codigo': 'pelicula = "Inception"\nanio = 2010\npuntaje = 8.8\ndisponible = True\nprint("Película:", pelicula)\nprint("Año:", anio)\nprint("Puntaje:", puntaje)\nprint("Disponible:", disponible)',
            'ejemplo_salida': 'Película: Inception\nAño: 2010\nPuntaje: 8.8\nDisponible: True',
            'prohibido': 'type(), if, else, elif, for, while'
        }
    ],

    'Operaciones con variables': [
        {
            'id': 'operacion_simple',
            'descripcion': 'Define 2 variables numéricas y realiza UNA operación aritmética (suma, resta, multiplicación o división). Imprime el resultado.',
            'ejemplo_codigo': 'largo = 8\nancho = 5\narea = largo * ancho\nprint(area)',
            'ejemplo_salida': '40',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'dos_operaciones',
            'descripcion': 'Define variables y realiza DOS operaciones distintas. Imprime ambos resultados con una etiqueta.',
            'ejemplo_codigo': 'precio = 5000\ndescuento = 500\ntotal = precio - descuento\niva = total * 0.19\nprint("Total:", total)\nprint("IVA:", iva)',
            'ejemplo_salida': 'Total: 4500\nIVA: 855.0',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'modulo_y_division_entera',
            'descripcion': 'Define 2 variables enteras y calcula el cociente entero (//) y el resto (%). Imprime ambos resultados.',
            'ejemplo_codigo': 'total = 17\ngrupos = 5\ncociente = total // grupos\nresto = total % grupos\nprint(cociente)\nprint(resto)',
            'ejemplo_salida': '3\n2',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'potencia_y_raiz',
            'descripcion': 'Define una variable numérica y calcula su cuadrado usando ** y su raíz cuadrada usando ** 0.5. Imprime ambos.',
            'ejemplo_codigo': 'lado = 4\ncuadrado = lado ** 2\nraiz = lado ** 0.5\nprint(cuadrado)\nprint(raiz)',
            'ejemplo_salida': '16\n2.0',
            'prohibido': 'if, else, elif, for, while, import'
        },
        {
            'id': 'conversion_unidades',
            'descripcion': 'Define una variable con un valor en una unidad (ej: km, kg, horas) y conviértela a otra unidad usando una operación. Imprime el resultado con f-string.',
            'ejemplo_codigo': 'km = 5\nmetros = km * 1000\nprint(f"{km} km son {metros} metros")',
            'ejemplo_salida': '5 km son 5000 metros',
            'prohibido': 'if, else, elif, for, while'
        }
    ],

    'Entrada y salida con variables': [
        {
            'id': 'imprimir_datos_persona',
            'descripcion': 'Define variables que describen una persona y muéstralas con f-strings, una por línea.',
            'ejemplo_codigo': 'nombre = "Sofía"\nedad = 21\ncarrera = "Ingeniería"\nprint(f"Nombre: {nombre}")\nprint(f"Edad: {edad}")\nprint(f"Carrera: {carrera}")',
            'ejemplo_salida': 'Nombre: Sofía\nEdad: 21\nCarrera: Ingeniería',
            'prohibido': 'type(), if, else, elif, for, while, input()'
        },
        {
            'id': 'imprimir_con_formato',
            'descripcion': 'Define variables numéricas con unidades (precio, peso, temperatura, etc.) y muéstralas con su unidad usando f-strings.',
            'ejemplo_codigo': 'temperatura = 36.5\npeso = 70\nprint(f"Temperatura: {temperatura}°C")\nprint(f"Peso: {peso} kg")',
            'ejemplo_salida': 'Temperatura: 36.5°C\nPeso: 70 kg',
            'prohibido': 'type(), if, else, elif, for, while, input()'
        },
        {
            'id': 'mensaje_combinado',
            'descripcion': 'Define 2-3 variables y combínalas en una sola frase usando f-string.',
            'ejemplo_codigo': 'jugador = "Carlos"\npuntos = 850\nnivel = 3\nprint(f"{jugador} tiene {puntos} puntos y está en el nivel {nivel}")',
            'ejemplo_salida': 'Carlos tiene 850 puntos y está en el nivel 3',
            'prohibido': 'type(), if, else, elif, for, while, input()'
        },
        {
            'id': 'varias_lineas_con_separador',
            'descripcion': 'Define variables y muéstralas en varias líneas, usando una línea separadora (ej: "---") entre secciones.',
            'ejemplo_codigo': 'titulo = "Python"\nversion = 3.11\nprint("Lenguaje:", titulo)\nprint("---")\nprint("Versión:", version)',
            'ejemplo_salida': 'Lenguaje: Python\n---\nVersión: 3.11',
            'prohibido': 'type(), if, else, elif, for, while, input()'
        }
    ],

    'Cálculos integrados con variables': [
        {
            'id': 'calculo_area',
            'descripcion': 'Define variables numéricas de una figura geométrica con valores exactos. Calcula el área usando una fórmula explícita, como area = base * altura / 2, e imprime el resultado con una etiqueta.',
            'ejemplo_codigo': 'base = 6\naltura = 4\narea = base * altura / 2\nprint("Área:", area)',
            'ejemplo_salida': 'Área: 12.0',
            'prohibido': 'if, else, elif, for, while, import'
        },
        {
            'id': 'calculo_promedio',
            'descripcion': 'Define 3 variables numéricas con valores exactos y calcula su promedio usando la fórmula promedio = (valor1 + valor2 + valor3) / 3. Imprime el resultado con una etiqueta.',
            'ejemplo_codigo': 'nota1 = 6.0\nnota2 = 5.5\nnota3 = 6.5\npromedio = (nota1 + nota2 + nota3) / 3\nprint("Promedio:", promedio)',
            'ejemplo_salida': 'Promedio: 6.0',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'calculo_con_descuento',
            'descripcion': 'Define precio y descuento con valores exactos. Calcula valor_descuento = precio * descuento / 100 y final = precio - valor_descuento. Imprime ambos resultados con etiquetas.',
            'ejemplo_codigo': 'precio = 10000\ndescuento = 20\nvalor_descuento = precio * descuento / 100\nfinal = precio - valor_descuento\nprint("Descuento:", valor_descuento)\nprint("Precio final:", final)',
            'ejemplo_salida': 'Descuento: 2000.0\nPrecio final: 8000.0',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'calculo_velocidad_tiempo',
            'descripcion': 'Define distancia y tiempo con valores exactos. Calcula velocidad = distancia / tiempo e imprime el resultado con unidades usando f-string.',
            'ejemplo_codigo': 'distancia = 120\ntiempo = 2\nvelocidad = distancia / tiempo\nprint(f"Velocidad: {velocidad} km/h")',
            'ejemplo_salida': 'Velocidad: 60.0 km/h',
            'prohibido': 'if, else, elif, for, while'
        },
        {
            'id': 'calculo_imc',
            'descripcion': 'Define peso y altura con valores exactos. Calcula el IMC usando imc = peso / altura ** 2 e imprime el resultado con una etiqueta.',
            'ejemplo_codigo': 'peso = 70\naltura = 1.75\nimc = peso / altura ** 2\nprint("IMC:", round(imc, 2))',
            'ejemplo_salida': 'IMC: 22.86',
            'prohibido': 'if, else, elif, for, while'
        }
    ],

    'Estructura if simple': [
        {
            'id': 'verificar_positivo',
            'descripcion': 'Define un número y usa if para imprimir un mensaje solo si es positivo (mayor que 0).',
            'ejemplo_codigo': 'temperatura = 5\nif temperatura > 0:\n    print("Temperatura positiva")',
            'ejemplo_salida': 'Temperatura positiva',
            'prohibido': 'else, elif, for, while'
        },
        {
            'id': 'verificar_umbral',
            'descripcion': 'Define un valor numérico y usa if para imprimir un mensaje solo si supera un umbral específico.',
            'ejemplo_codigo': 'puntaje = 75\nif puntaje >= 60:\n    print("Aprobado")',
            'ejemplo_salida': 'Aprobado',
            'prohibido': 'else, elif, for, while'
        },
        {
            'id': 'verificar_string',
            'descripcion': 'Define una variable de texto y usa if para imprimir un mensaje solo si tiene un valor específico.',
            'ejemplo_codigo': 'rol = "admin"\nif rol == "admin":\n    print("Acceso permitido")',
            'ejemplo_salida': 'Acceso permitido',
            'prohibido': 'else, elif, for, while'
        },
        {
            'id': 'verificar_rango',
            'descripcion': 'Define un número y usa if para imprimir un mensaje solo si está dentro de un rango válido (ej: entre 1 y 10).',
            'ejemplo_codigo': 'edad = 8\nif 1 <= edad <= 12:\n    print("Es niño")',
            'ejemplo_salida': 'Es niño',
            'prohibido': 'else, elif, for, while'
        }
    ],

    'Estructura if/else': [
        {
            'id': 'aprobado_reprobado',
            'descripcion': 'Define una nota y usa if/else para imprimir "Aprobado" o "Reprobado" según si supera el mínimo.',
            'ejemplo_codigo': 'nota = 4.5\nif nota >= 4.0:\n    print("Aprobado")\nelse:\n    print("Reprobado")',
            'ejemplo_salida': 'Aprobado',
            'prohibido': 'elif, for, while'
        },
        {
            'id': 'par_o_impar',
            'descripcion': 'Define un número entero y usa if/else con % para imprimir si es par o impar.',
            'ejemplo_codigo': 'numero = 7\nif numero % 2 == 0:\n    print("Par")\nelse:\n    print("Impar")',
            'ejemplo_salida': 'Impar',
            'prohibido': 'elif, for, while'
        },
        {
            'id': 'mayor_menor',
            'descripcion': 'Define dos variables numéricas y usa if/else para imprimir cuál es mayor.',
            'ejemplo_codigo': 'a = 15\nb = 20\nif a > b:\n    print("a es mayor")\nelse:\n    print("b es mayor")',
            'ejemplo_salida': 'b es mayor',
            'prohibido': 'elif, for, while'
        },
        {
            'id': 'dentro_fuera_rango',
            'descripcion': 'Define un valor y un rango (mín y máx). Usa if/else para indicar si el valor está dentro o fuera del rango.',
            'ejemplo_codigo': 'valor = 85\nminimo = 0\nmaximo = 100\nif minimo <= valor <= maximo:\n    print("Dentro del rango")\nelse:\n    print("Fuera del rango")',
            'ejemplo_salida': 'Dentro del rango',
            'prohibido': 'elif, for, while'
        }
    ],

    'Condicionales con operadores lógicos': [
        {
            'id': 'and_dos_condiciones',
            'descripcion': 'Define dos variables y usa if/else con "and" para verificar que ambas cumplan su condición.',
            'ejemplo_codigo': 'edad = 20\ntiene_carnet = True\nif edad >= 18 and tiene_carnet:\n    print("Puede conducir")\nelse:\n    print("No puede conducir")',
            'ejemplo_salida': 'Puede conducir',
            'prohibido': 'for, while'
        },
        {
            'id': 'or_una_condicion',
            'descripcion': 'Define dos variables y usa if/else con "or" para verificar que al menos una cumpla su condición.',
            'ejemplo_codigo': 'es_estudiante = False\nes_docente = True\nif es_estudiante or es_docente:\n    print("Tiene acceso")\nelse:\n    print("Sin acceso")',
            'ejemplo_salida': 'Tiene acceso',
            'prohibido': 'for, while'
        },
        {
            'id': 'not_negacion',
            'descripcion': 'Define una variable booleana y usa "not" para invertir su valor en la condición.',
            'ejemplo_codigo': 'sistema_activo = False\nif not sistema_activo:\n    print("Sistema apagado")\nelse:\n    print("Sistema encendido")',
            'ejemplo_salida': 'Sistema apagado',
            'prohibido': 'for, while'
        },
        {
            'id': 'and_con_rango',
            'descripcion': 'Define una variable numérica y usa "and" para verificar que esté dentro de un rango válido.',
            'ejemplo_codigo': 'temperatura = 22\nif temperatura >= 18 and temperatura <= 26:\n    print("Temperatura agradable")\nelse:\n    print("Temperatura extrema")',
            'ejemplo_salida': 'Temperatura agradable',
            'prohibido': 'for, while'
        }
    ],

    'Condicionales anidados con elif': [
        {
            'id': 'clasificar_nota',
            'descripcion': 'Define una nota del 1 al 7 y usa if/elif/else para clasificarla en Insuficiente, Suficiente, Bueno o Excelente.',
            'ejemplo_codigo': 'nota = 5.5\nif nota < 4.0:\n    print("Insuficiente")\nelif nota < 5.5:\n    print("Suficiente")\nelif nota < 6.5:\n    print("Bueno")\nelse:\n    print("Excelente")',
            'ejemplo_salida': 'Bueno',
            'prohibido': 'for, while'
        },
        {
            'id': 'clasificar_temperatura',
            'descripcion': 'Define una temperatura y usa if/elif/else para clasificarla (fría, fresca, agradable, calurosa).',
            'ejemplo_codigo': 'temp = 15\nif temp < 5:\n    print("Fría")\nelif temp < 15:\n    print("Fresca")\nelif temp < 25:\n    print("Agradable")\nelse:\n    print("Calurosa")',
            'ejemplo_salida': 'Agradable',
            'prohibido': 'for, while'
        },
        {
            'id': 'clasificar_edad',
            'descripcion': 'Define una edad y usa if/elif/else para clasificarla (niño, adolescente, adulto, adulto mayor).',
            'ejemplo_codigo': 'edad = 35\nif edad < 13:\n    print("Niño")\nelif edad < 18:\n    print("Adolescente")\nelif edad < 65:\n    print("Adulto")\nelse:\n    print("Adulto mayor")',
            'ejemplo_salida': 'Adulto',
            'prohibido': 'for, while'
        },
        {
            'id': 'clasificar_precio',
            'descripcion': 'Define un precio y usa if/elif/else para clasificarlo (económico, moderado, caro, muy caro).',
            'ejemplo_codigo': 'precio = 15000\nif precio < 5000:\n    print("Económico")\nelif precio < 15000:\n    print("Moderado")\nelif precio < 50000:\n    print("Caro")\nelse:\n    print("Muy caro")',
            'ejemplo_salida': 'Caro',
            'prohibido': 'for, while'
        }
    ],

    'Validación de datos ingresados': [
        {
            'id': 'validar_rango_numerico',
            'descripcion': 'Define una variable con un valor y valida que esté dentro de un rango permitido. Imprime si es válido o inválido y por qué.',
            'ejemplo_codigo': 'edad = 150\nif 0 <= edad <= 120:\n    print("Edad válida")\nelse:\n    print("Edad inválida: debe estar entre 0 y 120")',
            'ejemplo_salida': 'Edad inválida: debe estar entre 0 y 120',
            'prohibido': 'for, while'
        },
        {
            'id': 'validar_longitud_texto',
            'descripcion': 'Define un texto y valida que su longitud esté dentro de un rango permitido usando len().',
            'ejemplo_codigo': 'contrasena = "abc"\nif len(contrasena) >= 8:\n    print("Contraseña válida")\nelse:\n    print("Contraseña muy corta")',
            'ejemplo_salida': 'Contraseña muy corta',
            'prohibido': 'for, while'
        },
        {
            'id': 'validar_valor_positivo',
            'descripcion': 'Define una variable numérica y valida que sea positiva. Imprime si es válida o no.',
            'ejemplo_codigo': 'precio = -500\nif precio > 0:\n    print("Precio válido")\nelse:\n    print("El precio no puede ser negativo")',
            'ejemplo_salida': 'El precio no puede ser negativo',
            'prohibido': 'for, while'
        },
        {
            'id': 'validar_opcion',
            'descripcion': 'Define una variable de texto y valida que sea una de las opciones permitidas. Imprime si es válida o no.',
            'ejemplo_codigo': 'color = "verde"\nif color == "rojo" or color == "azul" or color == "amarillo":\n    print("Color primario")\nelse:\n    print("No es un color primario")',
            'ejemplo_salida': 'No es un color primario',
            'prohibido': 'for, while'
        }
    ],

    'Bucle while con condición simple': [
        {
            'id': 'contar_hacia_arriba',
            'descripcion': 'Define un contador en 1 y usa while para imprimirlo hasta llegar a un límite.',
            'ejemplo_codigo': 'contador = 1\nwhile contador <= 5:\n    print(contador)\n    contador += 1',
            'ejemplo_salida': '1\n2\n3\n4\n5',
            'prohibido': 'for'
        },
        {
            'id': 'contar_hacia_abajo',
            'descripcion': 'Define un contador con un valor inicial y usa while para decrementarlo hasta llegar a 0.',
            'ejemplo_codigo': 'cuenta = 3\nwhile cuenta > 0:\n    print(cuenta)\n    cuenta -= 1',
            'ejemplo_salida': '3\n2\n1',
            'prohibido': 'for'
        },
        {
            'id': 'acumular_con_while',
            'descripcion': 'Define un acumulador en 0 y usa while para sumarle un valor fijo en cada iteración hasta llegar a un total.',
            'ejemplo_codigo': 'total = 0\nwhile total < 15:\n    total += 5\nprint(total)',
            'ejemplo_salida': '15',
            'prohibido': 'for'
        },
        {
            'id': 'imprimir_multiplos',
            'descripcion': 'Define un número y usa while para imprimir sus primeros N múltiplos.',
            'ejemplo_codigo': 'numero = 3\nmultiplo = numero\nwhile multiplo <= 15:\n    print(multiplo)\n    multiplo += numero',
            'ejemplo_salida': '3\n6\n9\n12\n15',
            'prohibido': 'for'
        }
    ],

    'Bucle for con range()': [
        {
            'id': 'imprimir_secuencia',
            'descripcion': 'Usa for con range() para imprimir una secuencia de números del 1 al N.',
            'ejemplo_codigo': 'for i in range(1, 6):\n    print(i)',
            'ejemplo_salida': '1\n2\n3\n4\n5',
            'prohibido': 'while'
        },
        {
            'id': 'imprimir_texto_repetido',
            'descripcion': 'Usa for con range() para imprimir un mensaje N veces, incluyendo el número de iteración.',
            'ejemplo_codigo': 'for i in range(1, 4):\n    print(f"Intento {i}")',
            'ejemplo_salida': 'Intento 1\nIntento 2\nIntento 3',
            'prohibido': 'while'
        },
        {
            'id': 'range_con_paso',
            'descripcion': 'Usa for con range() con un paso mayor a 1 para imprimir cada N números.',
            'ejemplo_codigo': 'for i in range(0, 11, 2):\n    print(i)',
            'ejemplo_salida': '0\n2\n4\n6\n8\n10',
            'prohibido': 'while'
        },
        {
            'id': 'range_descendente',
            'descripcion': 'Usa for con range() con paso negativo para imprimir números en orden descendente.',
            'ejemplo_codigo': 'for i in range(5, 0, -1):\n    print(i)',
            'ejemplo_salida': '5\n4\n3\n2\n1',
            'prohibido': 'while'
        }
    ],

    'Contadores y acumuladores': [
        {
            'id': 'suma_secuencia',
            'descripcion': 'Usa un bucle y un acumulador para sumar todos los números del 1 al N. Imprime el total.',
            'ejemplo_codigo': 'total = 0\nfor i in range(1, 6):\n    total += i\nprint("Total:", total)',
            'ejemplo_salida': 'Total: 15',
            'prohibido': 'ninguno'
        },
        {
            'id': 'contar_elementos',
            'descripcion': 'Define una lista de valores fijos y usa un bucle con un contador para contar cuántos hay. Imprime el conteo.',
            'ejemplo_codigo': 'valores = [4, 7, 2, 9, 1]\ncontador = 0\nfor v in valores:\n    contador += 1\nprint("Cantidad:", contador)',
            'ejemplo_salida': 'Cantidad: 5',
            'prohibido': 'len()'
        },
        {
            'id': 'acumular_con_condicion',
            'descripcion': 'Define una lista de valores y usa un bucle para sumar solo los que cumplen una condición. Imprime el total.',
            'ejemplo_codigo': 'numeros = [3, 8, 2, 7, 5]\ntotal = 0\nfor n in numeros:\n    if n > 4:\n        total += n\nprint(total)',
            'ejemplo_salida': '20',
            'prohibido': 'ninguno'
        },
        {
            'id': 'calcular_promedio',
            'descripcion': 'Define una lista de valores numéricos y calcula su promedio usando un acumulador. Imprime el resultado.',
            'ejemplo_codigo': 'notas = [6, 5, 7, 4, 6]\ntotal = 0\nfor nota in notas:\n    total += nota\npromedio = total / 5\nprint("Promedio:", promedio)',
            'ejemplo_salida': 'Promedio: 5.6',
            'prohibido': 'ninguno'
        }
    ],

    'Bucles con condicionales': [
        {
            'id': 'filtrar_pares_impares',
            'descripcion': 'Define una lista de números y usa un bucle con if/else para imprimir si cada uno es par o impar.',
            'ejemplo_codigo': 'numeros = [1, 2, 3, 4, 5]\nfor n in numeros:\n    if n % 2 == 0:\n        print(n, "par")\n    else:\n        print(n, "impar")',
            'ejemplo_salida': '1 impar\n2 par\n3 impar\n4 par\n5 impar',
            'prohibido': 'ninguno'
        },
        {
            'id': 'contar_los_que_cumplen',
            'descripcion': 'Define una lista de valores y usa un bucle con if para contar cuántos cumplen una condición. Imprime el total.',
            'ejemplo_codigo': 'notas = [3, 6, 4, 7, 2]\naprobados = 0\nfor nota in notas:\n    if nota >= 4:\n        aprobados += 1\nprint("Aprobados:", aprobados)',
            'ejemplo_salida': 'Aprobados: 3',
            'prohibido': 'ninguno'
        },
        {
            'id': 'imprimir_solo_algunos',
            'descripcion': 'Define una lista y usa un bucle con if para imprimir solo los elementos que cumplen una condición.',
            'ejemplo_codigo': 'temperaturas = [15, 32, 8, 28, 20]\nfor t in temperaturas:\n    if t >= 25:\n        print(t)',
            'ejemplo_salida': '32\n28',
            'prohibido': 'ninguno'
        },
        {
            'id': 'clasificar_elementos',
            'descripcion': 'Define una lista de valores y usa un bucle con if/elif/else para clasificar cada elemento. Imprime la clasificación.',
            'ejemplo_codigo': 'edades = [5, 15, 30, 70]\nfor edad in edades:\n    if edad < 13:\n        print("Niño")\n    elif edad < 18:\n        print("Adolescente")\n    else:\n        print("Adulto")',
            'ejemplo_salida': 'Niño\nAdolescente\nAdulto\nAdulto',
            'prohibido': 'ninguno'
        }
    ],

    'Repetición con entrada de usuario': [
        {
            'id': 'procesar_lista_nombres',
            'descripcion': 'Define una lista de nombres fijos y usa un bucle para saludar a cada uno.',
            'ejemplo_codigo': 'nombres = ["Ana", "Luis", "María"]\nfor nombre in nombres:\n    print(f"Hola, {nombre}")',
            'ejemplo_salida': 'Hola, Ana\nHola, Luis\nHola, María',
            'prohibido': 'input()'
        },
        {
            'id': 'procesar_lista_numeros',
            'descripcion': 'Define una lista de valores numéricos fijos y usa un bucle para mostrar cada valor con una etiqueta.',
            'ejemplo_codigo': 'temperaturas = [22, 18, 25, 30]\nfor t in temperaturas:\n    print(f"Temperatura: {t}°C")',
            'ejemplo_salida': 'Temperatura: 22°C\nTemperatura: 18°C\nTemperatura: 25°C\nTemperatura: 30°C',
            'prohibido': 'input()'
        },
        {
            'id': 'calcular_por_elemento',
            'descripcion': 'Define una lista de precios fijos y usa un bucle para calcular e imprimir el precio con IVA de cada uno.',
            'ejemplo_codigo': 'precios = [1000, 2500, 800]\nfor precio in precios:\n    con_iva = precio * 1.19\n    print(f"Precio con IVA: {con_iva}")',
            'ejemplo_salida': 'Precio con IVA: 1190.0\nPrecio con IVA: 2975.0\nPrecio con IVA: 952.0',
            'prohibido': 'input()'
        },
        {
            'id': 'clasificar_lista',
            'descripcion': 'Define una lista de notas fijas y usa un bucle con if/else para clasificar cada una como aprobada o reprobada.',
            'ejemplo_codigo': 'notas = [3.5, 5.0, 6.5, 2.0]\nfor nota in notas:\n    if nota >= 4.0:\n        print(f"{nota}: Aprobado")\n    else:\n        print(f"{nota}: Reprobado")',
            'ejemplo_salida': '3.5: Reprobado\n5.0: Aprobado\n6.5: Aprobado\n2.0: Reprobado',
            'prohibido': 'input()'
        }
    ]
}


def seleccionar_patron(categoria: str, ejercicios_previos: list) -> dict:
    """Selecciona un patrón que no se haya usado recientemente."""
    patrones_categoria = PATRONES.get(categoria, [])
    if not patrones_categoria:
        return None

    ids_usados = [e.get('patron_id', '') for e in ejercicios_previos]
    patrones_disponibles = [p for p in patrones_categoria if p['id'] not in ids_usados]

    if not patrones_disponibles:
        patrones_disponibles = patrones_categoria

    return random.choice(patrones_disponibles)


# ==========================================
# MODELOS DE DATOS
# ==========================================

class ReqGenerar(BaseModel):
    modulo: str
    categoria: str
    nivel: str
    errores_previos: int = 0
    ejercicios_previos: list[dict] = []

class ReqPista(BaseModel):
    descripcion_ejercicio: str
    nivel: str
    codigo_actual: str
    salida_esperada: str = ''

class ReqEvaluar(BaseModel):
    modulo: str
    categoria: str
    descripcion_ejercicio: str
    codigo_usuario: str
    salida_consola: str
    es_error_sintaxis: bool
    errores_previos: int = 0
    salida_esperada: str = ''

class ReqFeedback(BaseModel):
    descripcion_ejercicio: str
    codigo_estudiante: str
    intentos_utilizados: int
    nivel_actual: str



# ==========================================
# VALIDACIÓN Y RESPALDOS
# ==========================================

def normalizar_salida(salida: str) -> str:
    """Normaliza saltos de línea y espacios externos para comparar salidas."""
    return str(salida).replace("\r\n", "\n").replace("\r", "\n").strip()


def limpiar_consejo(consejo: str) -> str:
    """Elimina prefijos tipo 'Recuerda:' para mantener consejos más directos."""
    if not consejo:
        return consejo

    consejo = consejo.strip()
    prefijos = ["Recuerda que ", "Recuerda: ", "Recuerda "]

    for prefijo in prefijos:
        if consejo.startswith(prefijo):
            consejo = consejo[len(prefijo):].strip()
            if consejo:
                consejo = consejo[0].upper() + consejo[1:]
            break

    return consejo


def validar_descripcion_resoluble(descripcion: str) -> tuple[bool, str]:
    """
    Filtra descripciones ambiguas para que el estudiante pueda resolver
    mirando solo descripción y salida esperada.
    """
    if not descripcion or not descripcion.strip():
        return False, "La descripción está vacía."

    descripcion_min = descripcion.lower()
    frases_ambiguas = [
        "valores específicos",
        "por ejemplo",
        "según corresponda",
        "segun corresponda",
        "elija",
        "elige",
        "a elección",
        "a eleccion",
        "cualquier valor"
    ]

    for frase in frases_ambiguas:
        if frase in descripcion_min:
            return False, f"La descripción usa una frase ambigua: {frase}"

    return True, ""


def validar_codigo_seguro(codigo: str) -> tuple[bool, str]:
    """
    Evita ejecutar código generado por el LLM que use instrucciones peligrosas.
    Esta validación es básica, pero suficiente para filtrar ejercicios simples.
    """
    if not codigo or not codigo.strip():
        return False, "El código está vacío."

    try:
        tree = ast.parse(codigo)
    except SyntaxError as e:
        return False, f"Error de sintaxis en codigoSolucion: {e}"

    llamadas_prohibidas = {
        "input", "open", "eval", "exec", "compile", "__import__",
        "globals", "locals", "vars", "dir", "help", "exit", "quit"
    }

    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            return False, "No se permiten imports en codigoSolucion."

        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in llamadas_prohibidas:
                return False, f"Llamada prohibida: {node.func.id}()"

            if isinstance(node.func, ast.Attribute):
                return False, "Uso de atributos o métodos no permitido en codigoSolucion."

        if isinstance(node, ast.Attribute):
            return False, "Uso de atributos no permitido en codigoSolucion."

        if isinstance(node, ast.Name) and node.id.startswith("__"):
            return False, "Uso de nombres especiales no permitido."

    return True, ""


def validar_restricciones_patron(codigo: str, patron: dict | None) -> tuple[bool, str]:
    """Valida que codigoSolucion no use elementos prohibidos por el patrón seleccionado."""
    if not patron:
        return True, ""

    prohibido = str(patron.get("prohibido", "")).lower()

    if not prohibido or prohibido == "ninguno":
        return True, ""

    try:
        tree = ast.parse(codigo)
    except SyntaxError as e:
        return False, f"Error de sintaxis: {e}"

    if "input()" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "input":
                return False, "El patrón prohíbe input()."

    if "type()" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "type":
                return False, "El patrón prohíbe type()."

    if "len()" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "len":
                return False, "El patrón prohíbe len()."

    if "import" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                return False, "El patrón prohíbe import."

    if "if" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.IfExp)):
                return False, "El patrón prohíbe if."

    if "elif" in prohibido:
        # En AST, elif aparece como un If dentro del orelse de otro If.
        for node in ast.walk(tree):
            if isinstance(node, ast.If):
                if any(isinstance(child, ast.If) for child in node.orelse):
                    return False, "El patrón prohíbe elif."

    if "else" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.If) and node.orelse:
                return False, "El patrón prohíbe else."

    if "for" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.For):
                return False, "El patrón prohíbe for."

    if "while" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.While):
                return False, "El patrón prohíbe while."

    if "f-strings" in prohibido:
        for node in ast.walk(tree):
            if isinstance(node, ast.JoinedStr):
                return False, "El patrón prohíbe f-strings."

    return True, ""


def ejecutar_codigo_python(codigo: str) -> tuple[str, bool]:
    """Ejecuta codigoSolucion y retorna (salida, hubo_error)."""
    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(codigo)
            tmp_path = f.name

        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode != 0:
            return normalizar_salida(result.stderr), True

        return normalizar_salida(result.stdout), False

    except subprocess.TimeoutExpired:
        return "timeout", True

    except Exception as e:
        return str(e), True

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


EJERCICIOS_RESPALDO = {
    "Introducción a variables": {
        "titulo": "Presentación de una persona",
        "patron_id": "imprimir_con_etiqueta",
        "descripcion": "Escribe un programa en Python que defina las variables nombre = \"Ana\", edad = 22 y ciudad = \"Santiago\", luego imprima cada una con una etiqueta descriptiva en líneas separadas.",
        "codigoSolucion": "nombre = \"Ana\"\nedad = 22\nciudad = \"Santiago\"\nprint(\"Nombre:\", nombre)\nprint(\"Edad:\", edad)\nprint(\"Ciudad:\", ciudad)",
        "salidaEsperada": "Nombre: Ana\nEdad: 22\nCiudad: Santiago",
        "consejo": "Usa print() con una coma para separar la etiqueta del valor.",
        "archivo": "presentacion_persona.py"
    },
    "Tipos de datos básicos": {
        "titulo": "Tipos de variables",
        "patron_id": "mostrar_valor_y_tipo",
        "descripcion": "Escribe un programa en Python que defina nombre = \"Luis\", edad = 20, altura = 1.75 y activo = True, luego imprima el tipo de cada variable usando type(), una por línea.",
        "codigoSolucion": "nombre = \"Luis\"\nedad = 20\naltura = 1.75\nactivo = True\nprint(type(nombre))\nprint(type(edad))\nprint(type(altura))\nprint(type(activo))",
        "salidaEsperada": "<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>",
        "consejo": "La función type() retorna el tipo de dato de cualquier variable.",
        "archivo": "tipos_variables.py"
    },
    "Operaciones con variables": {
        "titulo": "Suma y multiplicación",
        "patron_id": "dos_operaciones",
        "descripcion": "Escribe un programa en Python que defina a = 8 y b = 3, calcule su suma y su producto, e imprima ambos resultados con etiquetas.",
        "codigoSolucion": "a = 8\nb = 3\nsuma = a + b\nproducto = a * b\nprint(\"Suma:\", suma)\nprint(\"Producto:\", producto)",
        "salidaEsperada": "Suma: 11\nProducto: 24",
        "consejo": "Guarda el resultado de cada operación en una variable antes de imprimirlo.",
        "archivo": "suma_producto.py"
    },
    "Entrada y salida con variables": {
        "titulo": "Ficha de producto",
        "patron_id": "imprimir_datos_persona",
        "descripcion": "Escribe un programa en Python que defina producto = \"Laptop\", precio = 599990 y stock = 15, luego imprima cada dato con una etiqueta usando f-strings.",
        "codigoSolucion": "producto = \"Laptop\"\nprecio = 599990\nstock = 15\nprint(f\"Producto: {producto}\")\nprint(f\"Precio: {precio}\")\nprint(f\"Stock: {stock}\")",
        "salidaEsperada": "Producto: Laptop\nPrecio: 599990\nStock: 15",
        "consejo": "Los f-strings permiten insertar variables dentro de un texto usando llaves {}.",
        "archivo": "ficha_producto.py"
    },
    "Cálculos integrados con variables": {
        "titulo": "Área de un rectángulo",
        "patron_id": "calculo_area",
        "descripcion": "Escribe un programa en Python que defina largo = 6 y ancho = 4, calcule el área usando area = largo * ancho e imprima exactamente: Área: 24.",
        "codigoSolucion": "largo = 6\nancho = 4\narea = largo * ancho\nprint(\"Área:\", area)",
        "salidaEsperada": "Área: 24",
        "consejo": "Guarda el resultado del cálculo en una variable antes de imprimirlo.",
        "archivo": "area_rectangulo.py"
    },
    "Estructura if simple": {
        "titulo": "Verificar positivo",
        "patron_id": "verificar_positivo",
        "descripcion": "Escribe un programa en Python que defina numero = 7 y use un if para imprimir \"Es positivo\" solo si el número es mayor que cero.",
        "codigoSolucion": "numero = 7\nif numero > 0:\n    print(\"Es positivo\")",
        "salidaEsperada": "Es positivo",
        "consejo": "El bloque if solo se ejecuta si la condición es verdadera.",
        "archivo": "verificar_positivo.py"
    },
    "Estructura if/else": {
        "titulo": "Par o impar",
        "patron_id": "par_o_impar",
        "descripcion": "Escribe un programa en Python que defina numero = 7 y use if/else para imprimir \"Par\" si es divisible entre 2, o \"Impar\" en caso contrario.",
        "codigoSolucion": "numero = 7\nif numero % 2 == 0:\n    print(\"Par\")\nelse:\n    print(\"Impar\")",
        "salidaEsperada": "Impar",
        "consejo": "El operador % retorna el resto de la división. Si es 0, el número es par.",
        "archivo": "par_impar.py"
    },
    "Condicionales con operadores lógicos": {
        "titulo": "Acceso al sistema",
        "patron_id": "and_dos_condiciones",
        "descripcion": "Escribe un programa en Python que defina edad = 20 y tiene_carnet = True, luego use if/else con and para imprimir \"Puede conducir\" si cumple ambas condiciones.",
        "codigoSolucion": "edad = 20\ntiene_carnet = True\nif edad >= 18 and tiene_carnet:\n    print(\"Puede conducir\")\nelse:\n    print(\"No puede conducir\")",
        "salidaEsperada": "Puede conducir",
        "consejo": "El operador and exige que ambas condiciones sean verdaderas.",
        "archivo": "acceso_sistema.py"
    },
    "Condicionales anidados con elif": {
        "titulo": "Clasificar nota",
        "patron_id": "clasificar_nota",
        "descripcion": "Escribe un programa en Python que defina nota = 5.5 y use if/elif/else para clasificarla como Insuficiente, Suficiente, Bueno o Excelente.",
        "codigoSolucion": "nota = 5.5\nif nota < 4.0:\n    print(\"Insuficiente\")\nelif nota < 5.5:\n    print(\"Suficiente\")\nelif nota < 6.5:\n    print(\"Bueno\")\nelse:\n    print(\"Excelente\")",
        "salidaEsperada": "Bueno",
        "consejo": "El elif permite evaluar múltiples condiciones en orden.",
        "archivo": "clasificar_nota.py"
    },
    "Validación de datos ingresados": {
        "titulo": "Validar edad",
        "patron_id": "validar_rango_numerico",
        "descripcion": "Escribe un programa en Python que defina edad = 150 y valide que esté entre 0 y 120. Imprime \"Edad válida\" o \"Edad inválida: debe estar entre 0 y 120\".",
        "codigoSolucion": "edad = 150\nif 0 <= edad <= 120:\n    print(\"Edad válida\")\nelse:\n    print(\"Edad inválida: debe estar entre 0 y 120\")",
        "salidaEsperada": "Edad inválida: debe estar entre 0 y 120",
        "consejo": "Python permite encadenar comparaciones como 0 <= edad <= 120 directamente.",
        "archivo": "validar_edad.py"
    },
    "Bucle while con condición simple": {
        "titulo": "Contar hasta 5",
        "patron_id": "contar_hacia_arriba",
        "descripcion": "Escribe un programa en Python que defina contador = 1 y use un while para imprimir los números del 1 al 5, uno por línea.",
        "codigoSolucion": "contador = 1\nwhile contador <= 5:\n    print(contador)\n    contador += 1",
        "salidaEsperada": "1\n2\n3\n4\n5",
        "consejo": "Incrementa el contador dentro del while para evitar un bucle infinito.",
        "archivo": "contar_cinco.py"
    },
    "Bucle for con range()": {
        "titulo": "Secuencia del 1 al 5",
        "patron_id": "imprimir_secuencia",
        "descripcion": "Escribe un programa en Python que use for con range() para imprimir los números del 1 al 5, uno por línea.",
        "codigoSolucion": "for i in range(1, 6):\n    print(i)",
        "salidaEsperada": "1\n2\n3\n4\n5",
        "consejo": "range(1, 6) genera números del 1 al 5; el límite superior no se incluye.",
        "archivo": "secuencia_for.py"
    },
    "Contadores y acumuladores": {
        "titulo": "Suma del 1 al 5",
        "patron_id": "suma_secuencia",
        "descripcion": "Escribe un programa en Python que use un bucle y un acumulador para sumar los números del 1 al 5 e imprima el total.",
        "codigoSolucion": "total = 0\nfor i in range(1, 6):\n    total += i\nprint(\"Total:\", total)",
        "salidaEsperada": "Total: 15",
        "consejo": "Inicializa el acumulador en 0 antes del bucle y súmale en cada iteración.",
        "archivo": "suma_acumulador.py"
    },
    "Bucles con condicionales": {
        "titulo": "Par o impar en lista",
        "patron_id": "filtrar_pares_impares",
        "descripcion": "Escribe un programa en Python que defina numeros = [1, 2, 3, 4, 5] y use un for con if/else para imprimir si cada número es par o impar.",
        "codigoSolucion": "numeros = [1, 2, 3, 4, 5]\nfor n in numeros:\n    if n % 2 == 0:\n        print(n, \"par\")\n    else:\n        print(n, \"impar\")",
        "salidaEsperada": "1 impar\n2 par\n3 impar\n4 par\n5 impar",
        "consejo": "Combina for e if para procesar cada elemento con una condición.",
        "archivo": "pares_impares.py"
    },
    "Repetición con entrada de usuario": {
        "titulo": "Saludar lista",
        "patron_id": "procesar_lista_nombres",
        "descripcion": "Escribe un programa en Python que defina nombres = [\"Ana\", \"Luis\", \"María\"] y use un for para imprimir un saludo a cada uno.",
        "codigoSolucion": "nombres = [\"Ana\", \"Luis\", \"María\"]\nfor nombre in nombres:\n    print(f\"Hola, {nombre}\")",
        "salidaEsperada": "Hola, Ana\nHola, Luis\nHola, María",
        "consejo": "Usa f-strings dentro del for para personalizar el mensaje con cada elemento.",
        "archivo": "saludar_lista.py"
    }
}


def obtener_respaldo(categoria: str) -> dict | None:
    """Devuelve una copia del ejercicio de respaldo para evitar mutar el original."""
    respaldo = EJERCICIOS_RESPALDO.get(categoria)

    if not respaldo:
        return None

    resultado = dict(respaldo)
    resultado["consejo"] = limpiar_consejo(resultado.get("consejo", ""))

    return resultado


# ==========================================
# ENDPOINTS
# ==========================================


@app.post("/api/generar_ejercicio")
async def generar_ejercicio(req: ReqGenerar):
    patron = seleccionar_patron(req.categoria, req.ejercicios_previos)

    instruccion_dificultad = ""
    if req.errores_previos == 1:
        instruccion_dificultad = "El estudiante cometió 1 error. Genera un ejercicio ligeramente más simple sobre el mismo concepto."
    elif req.errores_previos == 2:
        instruccion_dificultad = "El estudiante cometió 2 errores. Genera un ejercicio simple con instrucciones muy claras."
    elif req.errores_previos >= 3:
        instruccion_dificultad = f"El estudiante cometió {req.errores_previos} errores. Genera el ejercicio más simple posible, casi guiado."

    ids_usados = [e.get("patron_id", "") for e in req.ejercicios_previos]
    resumen_previos = ", ".join(ids_usados) if ids_usados else "ninguno"

    if patron:
        instruccion_patron = f"""
PATRÓN PEDAGÓGICO A USAR: {patron["id"]}
QUÉ DEBE HACER EL EJERCICIO: {patron["descripcion"]}
EJEMPLO DE ESTRUCTURA (cambia temática, valores y variables, NO copies este ejemplo):
```python
{patron["ejemplo_codigo"]}
```
SALIDA DE ESE EJEMPLO:
{patron["ejemplo_salida"]}

PROHIBIDO EN ESTE EJERCICIO:
{patron["prohibido"]}
"""
    else:
        instruccion_patron = f"El ejercicio debe practicar exclusivamente: {req.categoria}"

    prompt = f"""Eres TutorIA, tutor de Python para estudiantes de primer semestre universitario.

TAREA: Genera UN ejercicio de programación en Python.

DATOS:
- Módulo: {req.modulo}
- Categoría: {req.categoria}
- Nivel: {req.nivel}
- Errores previos: {req.errores_previos}
- Patrones ya usados: {resumen_previos}
{instruccion_dificultad}

{instruccion_patron}

NIVEL {req.nivel}:
- BASICO: Un concepto, 3-6 líneas.
- INTERMEDIO: 2-3 variables, una operación o condición, 5-8 líneas.
- AVANZADO: Combina conceptos, lógica múltiple, 8-15 líneas.

REGLAS OBLIGATORIAS:
1. NUNCA uses input(). Todos los valores son variables definidas en el código.
2. La descripción debe mencionar cada variable con su valor exacto. Prohibido usar frases como "valores específicos", "por ejemplo", "según corresponda" o "elige".
3. La descripción debe indicar exactamente qué imprimir y en qué formato. La salida esperada debe estar completamente determinada por la descripción.
4. La descripción empieza con "Escribe un programa en Python que..." o "Crea un programa en Python que..."
5. Cambia la temática, nombres de variables y valores respecto a los patrones ya usados ({resumen_previos}).
6. No mezcles conceptos prohibidos para la categoría.
7. Escribe codigoSolucion primero. Luego ejecuta mentalmente para derivar salidaEsperada.
8. codigoSolucion y salidaEsperada deben coincidir exactamente.
9. El consejo debe ser específico al patrón usado, sin empezar con "Recuerda".
10. La descripción debe tener entre 40 y 80 palabras.
11. Si defines variables booleanas, la salida esperada DEBE ser coherente con sus valores. Verifica que las condiciones en codigoSolucion produzcan exactamente salidaEsperada con los valores definidos.
12. En ejercicios de operaciones y cálculos, usa etiquetas claras en la salida cuando haya más de un resultado.
13. En ejercicios de cálculos integrados, la descripción debe entregar los valores exactos y el formato exacto de salida. Puede explicar la fórmula en lenguaje natural, pero NO debe escribir asignaciones completas como area = base * altura, valor_descuento = precio * descuento / 100 o final = precio - valor_descuento.
14. La descripción NUNCA debe mencionar un formato de salida diferente al de salidaEsperada. Si salidaEsperada dice "Área: 12.0", la descripción también debe decir exactamente "Área: 12.0", sin agregar unidades ni texto extra.
15. Para nivel BASICO, la descripción puede orientar el cálculo con palabras simples. Para nivel INTERMEDIO o AVANZADO, debe reducir la ayuda directa y pedir el cálculo de forma más general, siempre manteniendo valores exactos y salida esperada clara.

Devuelve ÚNICAMENTE este JSON:
{{
    "titulo": "Nombre corto del ejercicio",
    "patron_id": "{patron["id"] if patron else "libre"}",
    "descripcion": "Escribe un programa en Python que... [variables con valores y qué imprimir]",
    "codigoSolucion": "Código Python completo y ejecutable",
    "salidaEsperada": "Exactamente lo que imprime codigoSolucion",
    "consejo": "Tip concreto sobre {req.categoria}",
    "archivo": "nombre_descriptivo.py"
}}"""

    async def intentar_generar(numero_intento: int) -> dict | None:
        try:
            response = ollama.chat(
                model="tutoria_modelv2",
                messages=[{"role": "user", "content": prompt}],
                format="json"
            )

            resultado = json.loads(response["message"]["content"])

            if not isinstance(resultado, dict):
                print("Generación inválida: la respuesta no es un objeto JSON.")
                return None

            if patron and not resultado.get("patron_id"):
                resultado["patron_id"] = patron["id"]

            resultado["consejo"] = limpiar_consejo(resultado.get("consejo", ""))

            campos_obligatorios = ["titulo", "descripcion", "codigoSolucion", "salidaEsperada", "consejo", "archivo"]
            faltantes = [campo for campo in campos_obligatorios if not str(resultado.get(campo, "")).strip()]

            if faltantes:
                print(f"Generación inválida: faltan campos {faltantes}")
                return None

            descripcion_ok, motivo_descripcion = validar_descripcion_resoluble(resultado["descripcion"])
            if not descripcion_ok:
                print(f"Descripción ambigua intento {numero_intento}: {motivo_descripcion}")
                return None

            codigo = resultado["codigoSolucion"]
            salida_esperada = normalizar_salida(resultado["salidaEsperada"])

            es_seguro, motivo_seguridad = validar_codigo_seguro(codigo)
            if not es_seguro:
                print(f"Validación fallida intento {numero_intento}: {motivo_seguridad}")
                return None

            cumple_restricciones, motivo_restriccion = validar_restricciones_patron(codigo, patron)
            if not cumple_restricciones:
                print(f"Restricción fallida intento {numero_intento}: {motivo_restriccion}")
                return None

            salida_real, hubo_error = ejecutar_codigo_python(codigo)

            if hubo_error:
                print(f"Ejecución fallida intento {numero_intento}: {repr(salida_real)}")
                return None

            if salida_real != salida_esperada:
                print(
                    f"Salida no coincide intento {numero_intento} — "
                    f"esperada: {repr(salida_esperada)} | real: {repr(salida_real)}"
                )
                return None

            resultado["salidaEsperada"] = salida_esperada
            return resultado

        except Exception as e:
            print(f"Error al generar intento {numero_intento}: {e}")
            return None

    for intento in range(1, 3):
        resultado = await intentar_generar(intento)
        if resultado is not None:
            return resultado

        if intento == 1:
            print("Reintentando generación...")

    print(f"Usando ejercicio de respaldo para: {req.categoria}")
    respaldo = obtener_respaldo(req.categoria)

    if respaldo is None:
        raise HTTPException(status_code=500, detail=f"No hay respaldo para la categoría: {req.categoria}")

    return respaldo


@app.post("/api/pedir_pista")
async def pedir_pista(req: ReqPista):
    prompt = f"""Eres TutorIA, tutor de Python para estudiantes de primer semestre.

EJERCICIO:
{req.descripcion_ejercicio}

CÓDIGO ACTUAL DEL ESTUDIANTE:
```python
{req.codigo_actual}
```

TAREA: Genera una pista útil con un fragmento de código concreto.

REGLAS:
1. El fragmento debe ser UNA sola línea que ilustre el concepto clave del ejercicio.
2. Usa únicamente los nombres de variables que aparecen en el ejercicio.
3. No entregues el print() completo ni la solución entera.
4. El texto explica qué hace ese fragmento en una oración.

Devuelve ÚNICAMENTE este JSON:
{{
    "texto": "Una oración que explica qué hace este fragmento",
    "codigo": "una_linea_de_ejemplo"
}}"""

    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        return json.loads(response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/evaluar_codigo")
async def evaluar_codigo(req: ReqEvaluar):
    if req.errores_previos <= 1:
        instruccion_aliento = f"Motiva al estudiante a identificar el error específico y reintentar."
    elif req.errores_previos == 2:
        instruccion_aliento = f"Sugiere al estudiante pedir una pista e indica qué parte revisar."
    else:
        instruccion_aliento = f"Recomienda al estudiante generar un ejercicio de refuerzo para practicar desde la base."

    prompt = f"""Eres TutorIA, tutor de Python para estudiantes de primer semestre.

EJERCICIO:
{req.descripcion_ejercicio}

CÓDIGO DEL ESTUDIANTE:
```python
{req.codigo_usuario}
```

SALIDA PRODUCIDA:
{req.salida_consola}
SALIDA ESPERADA:
{req.salida_esperada}

DATOS: Módulo: {req.modulo} | Categoría: {req.categoria} | Errores acumulados: {req.errores_previos} | ¿Error de sintaxis?: {req.es_error_sintaxis}

TAREA: Compara la salida producida con la salida esperada (ignorando espacios extra al inicio o final).
Si coinciden → estado "correcto". Si no coinciden → estado "incorrecto".
mensajeAliento: {instruccion_aliento}

Si correcto, devuelve:
{{
    "estado": "correcto",
    "feedbackCorrecto": {{
        "texto": "¡Correcto! Explica qué hizo bien.",
        "conceptosLogrados": ["concepto 1", "concepto 2"]
    }},
    "feedbackIncorrecto": {{"texto": "", "errorTitulo": "", "errorDesc": "", "conceptosLogrados": [], "conceptosError": [], "decisionTutor": "", "mensajeAliento": ""}}
}}

Si incorrecto, devuelve:
{{
    "estado": "incorrecto",
    "feedbackCorrecto": {{"texto": "", "conceptosLogrados": []}},
    "feedbackIncorrecto": {{
        "texto": "Incorrecto. Explica el problema.",
        "errorTitulo": "Título corto",
        "errorDesc": "Explicación amigable del error",
        "conceptosLogrados": ["lo que hizo bien"],
        "conceptosError": ["lo que hizo mal"],
        "decisionTutor": "bajar_dificultad o mantener o generar_refuerzo",
        "mensajeAliento": "Mensaje motivador específico al error."
    }}
}}"""

    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        return json.loads(response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generar_feedback")
async def generar_feedback(req: ReqFeedback):
    accion_tutor = "Aumentar la dificultad" if req.intentos_utilizados == 1 else "Mantener nivel"
    mensaje_decision = "Se creará un nuevo ejercicio de mayor dificultad." if req.intentos_utilizados == 1 else "Continuaremos practicando en este nivel para consolidar."

    prompt = f"""Eres TutorIA, tutor de Python para estudiantes de primer semestre.

EJERCICIO RESUELTO:
{req.descripcion_ejercicio}

CÓDIGO DEL ESTUDIANTE (resuelto en {req.intentos_utilizados} intento(s), nivel {req.nivel_actual}):
```python
{req.codigo_estudiante}
```

TAREA: Genera el feedback de la pantalla de resultados.

REGLAS:
1. codigoSolucion: el código del estudiante tal como está o ligeramente más limpio. Solo código ejecutable.
2. mensajeResumen: una oración específica sobre qué usó bien. No uses "el código es correcto".
3. explicacion.puntos: 2-3 frases completas. Cada punto usa solo el campo "texto".
4. explicacion.recuerda: tip de buenas prácticas que no repita los puntos.
5. conceptos: 2-3 conceptos clave aplicados.

Devuelve ÚNICAMENTE este JSON:
{{
    "codigoSolucion": "código Python ejecutable",
    "mensajeResumen": "Oración específica sobre qué hizo bien",
    "explicacion": {{
        "intro": "Tu código funciona correctamente porque:",
        "puntos": [
            {{"texto": "Primera razón."}},
            {{"texto": "Segunda razón."}}
        ],
        "recuerda": "Tip de buenas prácticas."
    }},
    "conceptos": ["Concepto 1", "Concepto 2"],
    "decision": {{
        "resultado": "Correcto",
        "intentos": {req.intentos_utilizados},
        "nivelActual": "{req.nivel_actual}",
        "accion": "{accion_tutor}",
        "mensaje": "{mensaje_decision}"
    }}
}}"""

    try:
        response = ollama.chat(model='tutoria_modelv2', messages=[{'role': 'user', 'content': prompt}], format='json')
        return json.loads(response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))