# Cursos de Python: paquete de publicación

Canal: @UniversoCienciaDatos · Formato: horizontal 1920×1080, ~5–7 min (más si el tema lo amerita), sin cara.
Voz: Alex (`alex_nicola`, Kokoro, gratis). Cada video tiene su notebook en `Notebook/<Serie>/`.

**Antes de publicar:** merge a `main` y `python3 scripts/notebook.py link <ruta>` debe decir "Está en main".

Plantilla por video:

```
## Serie · NN · Tema
**Título:** Tema | Serie (≤ 60 caracteres, palabra clave al inicio, sin #N)
**Alternativas:** …
**Plantilla:** A / B / C
**Miniatura:** `Mini-NN-Tema` → "3–4 PALABRAS"
**Notebook:** Notebook/<Serie>/<NN-tema>.ipynb (¿en main? sí/no)

**Descripción:**
> [Línea 1: qué da el video, con las palabras que la gente busca]
> [Línea 2: valor concreto]
>
> 📓 Practica con el notebook en Google Colab (gratis, sin instalar nada):
> https://colab.research.google.com/github/ChristopherArgenis/Py_UniversoDC_YT/blob/main/Notebook/<Serie>/<NN-tema>.ipynb
>
> [Resumen breve]
>
> Capítulos:
> 00:00 …
> (El código está en el minuto mm:ss)
>
> Fuentes: …
> Suscríbete a @UniversoCienciaDatos · TikTok @argenis2125 · Instagram @kriz2125

**#:** #python #numpy #cienciadedatos … (3 a 5)
**Comentario fijado:** …
```

---

## Numpy 1D · 01 · De listas a arreglos
**Título:** De listas a arreglos | Numpy 1D
**Alternativas:** NumPy desde cero: de listas a arreglos | Numpy 1D · Tu primer arreglo de NumPy | Numpy 1D
**Plantilla:** A (6 bloques Concepto → Código)
**Video:** `out/N01-ListasArreglos.mp4` (5:18, 1920×1080)
**Miniatura:** `Mini-N01-ListasArreglos` → "1 MILLÓN DE NÚMEROS": LISTA [1, 2, 3] 36 MB (rojo) → NUMPY [1 2 3] 8 MB (verde). Dato del video (01:24).
**Notebook:** Notebook/Numpy-1D/01-listas-a-arreglos.ipynb (¿en main? **sí**: el link de Colab funciona)
**Descripción:** `videos/n01-listas-arreglos/descripcion.txt`

**Descripción:**
> Aprende NumPy desde cero: pasa de listas de Python a arreglos (arrays) y entiende por qué son más rápidos.
> Creas tu primer arreglo, ves sus tipos de datos (dtype), los cambias con astype, fabricas arreglos con zeros, arange y linspace, y los graficas con Matplotlib.
>
> 📓 Practica con el notebook en Google Colab (gratis, sin instalar nada):
> https://colab.research.google.com/github/ChristopherArgenis/Py_UniversoDC_YT/blob/main/Notebook/Numpy-1D/01-listas-a-arreglos.ipynb
>
> Video 1 de Numpy 1D, el curso de NumPy desde cero para llegar a Ciencia de Datos. Mismos números, misma operación… pero una lista y un arreglo dan resultados distintos. Aquí ves por qué, con código real y ejemplos de industria, ciencia y día a día.
>
> Capítulos:
> 00:00 La pregunta
> 00:17 ¿Qué es NumPy?
> 00:43 Tu primer arreglo
> 01:24 Arreglos vs listas
> 01:56 Tipos de datos
> 02:26 Cambiar el tipo
> 03:01 Funciones fábrica
> 03:34 Graficar arreglos
> 03:57 Dónde se usa
> 04:20 Plus: Ciencia de Datos
> 04:42 Reto y resumen
> 05:04 Cierre
>
> El código está en pantalla desde el minuto 00:43, y completo en el notebook.
> Reto: ¿por qué la gráfica sale en escalones? Respóndelo en los comentarios.
>
> Fuentes: documentación oficial de NumPy (numpy.org). Tiempos y memoria medidos en el notebook (varían según la computadora). Ejemplos simplificados.
>
> Suscríbete a @UniversoCienciaDatos · TikTok @argenis2125 · Instagram @kriz2125
>
> #python #numpy #cienciadedatos #programacion

**#:** #python #numpy #cienciadedatos #programacion
**Comentario fijado:** 🧩 Reto: crea 50 números entre 0 y 10 con linspace, conviértelos a enteros y grafícalos. ¿Por qué sale en escalones? Respóndelo aquí 👇 (el notebook de Colab está en la descripción). La respuesta, en el próximo video.

---

## Numpy 1D · 02 · Índices y cortes
**Título:** Índices y cortes en NumPy | Numpy 1D
**Alternativas:** Accede a los elementos al estilo NumPy | Numpy 1D · Cómo leer y cambiar un arreglo de NumPy | Numpy 1D
**Plantilla:** A (3 bloques + respuesta del reto del video 1)
**Video:** `out/N02-IndicesCortes.mp4` (4:02, 1920×1080)
**Miniatura:** `Mini-N02-IndicesCortes` → casillas 10 [0 30 40] 50 con el corte [1:4] marcado + "¡CAMBIÓ EL ORIGINAL!" (la trampa del gancho)
**Notebook:** Notebook/Numpy-1D/02-indices-y-cortes.ipynb (¿en main? **NO todavía: hacer merge antes de publicar**)
**Descripción:** `videos/n02-indices-cortes/descripcion.txt`

**Descripción:**
> Aprende índices y cortes (slicing) en NumPy: cómo leer, cambiar y seleccionar los elementos de un arreglo.
> Usas índices positivos y negativos, cortes con inicio, fin y paso, listas de posiciones (fancy indexing) y entiendes la diferencia entre vista y copia.
>
> 📓 Practica con el notebook en Google Colab (gratis, sin instalar nada):
> https://colab.research.google.com/github/ChristopherArgenis/Py_UniversoDC_YT/blob/main/Notebook/Numpy-1D/02-indices-y-cortes.ipynb
>
> Video 2 de Numpy 1D, el curso de NumPy desde cero para llegar a Ciencia de Datos. Cambias una parte de una lista y el original sigue igual; haces lo mismo con un arreglo y el original cambia. Aquí ves por qué, con código real y ejemplos de industria, ciencia y día a día.
>
> Capítulos:
> 00:00 La trampa
> 00:18 Respuesta del reto
> 00:35 Tres formas de leer
> 00:53 Índices de un arreglo
> 01:28 Modificar con cortes
> 02:10 Elementos dispersos
> 02:37 Dónde se usa
> 03:05 Plus: Ciencia de Datos
> 03:26 Reto y resumen
> 03:48 Cierre
>
> El código está en pantalla desde el minuto 00:53, y completo en el notebook.
> Reto: del 1 al 10, invertido y uno de cada tres, en un solo corte. ¿Qué sale? Respóndelo en los comentarios.
>
> Video anterior: De listas a arreglos | Numpy 1D
>
> Fuentes: documentación oficial de NumPy (numpy.org). Ejemplos simplificados con datos inventados.
>
> Suscríbete a @UniversoCienciaDatos · TikTok @argenis2125 · Instagram @kriz2125
>
> #python #numpy #cienciadedatos #programacion

**#:** #python #numpy #cienciadedatos #programacion
**Comentario fijado:** 🧩 Reto: crea los números del 1 al 10 con arange, inviértelos y quédate con uno de cada tres en UN solo corte. ¿Qué sale? Respóndelo aquí 👇 (el notebook de Colab está en la descripción). La respuesta, en el próximo video.
