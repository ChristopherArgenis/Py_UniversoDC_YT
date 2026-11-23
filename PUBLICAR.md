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
**Miniatura:** `Mini-N01-ListasArreglos` → "[1,2,3] × 2 = [1,2,3,1,2,3]" + "¿?" (el resultado sorprendente del gancho; cubo 3D desenfocado al fondo)
**Notebook:** Notebook/Numpy-1D/01-listas-a-arreglos.ipynb (¿en main? **NO todavía: hacer merge antes de publicar**)
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

