# Serie: Numpy 1D

**Estado:** video 1 aprobado y renderizado (5:18); falta merge a `main` y publicar. Nada se renderiza hasta aprobar cada guion.
Los demás videos: el dueño define su contenido (como hizo con el 1); aquí se van agregando.

## Idea
Aprender **NumPy desde cero con arreglos de una dimensión (1D)**: crear, entender, transformar y graficar arreglos,
que son la base de pandas, Matplotlib y scikit-learn. Cada video sigue el contenido y el orden que da el dueño.

- **Público:** quien ya sabe algo de Python (listas, `print`, `for`) y quiere empezar con datos. Nivel principiante.
- **Formato:** 16:9, voz de Alex (`alex_nicola`), subtítulos, capítulos. **Dura lo que tenga que durar.**
- **Títulos:** «Tema | Numpy 1D», sin número. Miniatura con chip "NUMPY 1D" y acento azul en toda la serie.
- **Notebooks:** `Notebook/Numpy-1D/NN-tema.ipynb`, sin ejecutar, con 3 ejercicios (el último = reto del video).
- **Lista de reproducción:** "Numpy 1D: NumPy desde cero (curso de Python para Ciencia de Datos)".
- **Plantilla:** A (Gancho → Teoría → Concepto → Código → 3 ejemplos → Plus: Ciencia de Datos). Cuando el contenido
  del dueño trae varios subtemas, el bloque Concepto → Código se repite una vez por subtema, en su orden.

## Videos
| # | Título | Palabra clave | Notebook | Estado |
|---|---|---|---|---|
| 1 | De listas a arreglos \| Numpy 1D | numpy arreglos / numpy array | `01-listas-a-arreglos.ipynb` | renderizado · notebook en main · por publicar |
| 2 | Índices y cortes en NumPy \| Numpy 1D | numpy índices / slicing numpy | `02-indices-y-cortes.ipynb` | renderizado · por publicar |
| 3 | Operaciones vectorizadas en NumPy \| Numpy 1D | operaciones vectorizadas numpy | `03-operaciones-vectorizadas.ipynb` | renderizado · por publicar |
| 4 | Máscaras booleanas en NumPy \| Numpy 1D | máscaras booleanas numpy / filtrar numpy | `04-mascaras-booleanas.ipynb` | guion por aprobar |
| 5 | (el dueño define el contenido) | | | |

## Video 1 · De listas a arreglos
Guion: `src/guiones/n01-listas-arreglos.json` (aprobado). Video: `src/videos/N01ListasArreglos.tsx` → 5:18. Título elegido: «De listas a arreglos | Numpy 1D».

**Contenido del dueño → capítulos del video** (mismo orden):
| Contenido del dueño | Capítulo | Qué se ve |
|---|---|---|
| (gancho) | La pregunta | `lista * 2` → `[1, 2, 3, 1, 2, 3]` vs `arreglo * 2` → `[2 4 6]` |
| (teoría) | ¿Qué es NumPy? | **Three.js:** lista = cubos sueltos vs arreglo = fila continua |
| 1. Creating Your First NumPy Array | Tu primer arreglo | `np.array`, `type`, `shape`, `ndim`, `size`, índices 0 y -1 |
| 2. How Arrays Differ from Lists | Arreglos vs listas | `+` vectorizado, un solo tipo (todo a texto), velocidad y memoria medidas |
| 3. Understanding NumPy Data Types | Tipos de datos | `dtype`: int64, float64, bool, `<U4`; **Three.js:** bytes por tipo; `itemsize`, `nbytes` |
| 4. Changing Array Data Types | Cambiar el tipo | `astype` corta (no redondea), `np.round`, texto → número, overflow en int8 |
| 5. NumPy Array Factory Functions | Funciones fábrica | `zeros`, `ones`, `full`, `arange` vs `linspace`, `default_rng().integers` |
| 6. Plotting Generated Arrays | Graficar arreglos | `plt.plot` de `np.sin(linspace)`, `plt.hist` de 1,000 estaturas |
| (3 ejemplos) | Dónde se usa | Industria: °C → °F · Ciencia: caída libre · Día a día: pasos de la semana |
| (plus) | Plus: Ciencia de Datos | columna de pandas = arreglo; 1,000,000 de enteros: 8 MB (int64) vs 1 MB (int8) |
| (reto) | Reto y resumen | `np.linspace(0, 10, 50).astype(int)` → ¿por qué escalones? |

**Escenas 3D (Three.js):** 2 → teoría (memoria de lista vs arreglo) y tipos de datos (bytes por elemento).

**Cifras verificadas** (NumPy 2.5.3, Python 3, Linux; las mediciones varían según la computadora):
- `sum` de 1,000,000 de enteros: lista 5.09 ms vs `arr.sum()` 0.44 ms (~12×, `timeit`, mejor de 5).
- Memoria: lista ~36 MB (lista + objetos int, `sys.getsizeof`) vs arreglo 8 MB (`nbytes`).
- Todas las salidas de las celdas están copiadas de la ejecución real (ver campo `codigo` del guion).
- Pandas 3 ya no muestra las columnas de texto como `object`: por eso el Plus no muestra `df.dtypes` de texto
  (en Colab puede verse distinto).

**Títulos (≤ 60, revisados con `scripts/titulo.py`):**
1. De listas a arreglos | Numpy 1D (31)
2. NumPy desde cero: de listas a arreglos | Numpy 1D (49)
3. Tu primer arreglo de NumPy | Numpy 1D (37)

**Miniatura (elegida por el dueño):** lista `[1, 2, 3]` con **36 MB** en rojo → flecha → arreglo NumPy `[1 2 3]` con **8 MB** en verde, "1 MILLÓN DE NÚMEROS" arriba. Va con el título (de listas a arreglos) y el dato sale en el video (01:24).

**Pendiente de decidir:** el "próximo video" del cierre (depende del contenido del video 2).

## Video 2 · Índices y cortes (Accessing Elements the NumPy Way)
Guion: `src/guiones/n02-indices-cortes.json` (aprobado). Video: `src/videos/N02IndicesCortes.tsx` → 4:02. Título elegido: «Índices y cortes en NumPy | Numpy 1D».

| Contenido del dueño | Capítulo | Qué se ve |
|---|---|---|
| (gancho) | La trampa | Cambiar una parte de una lista no toca el original; con un arreglo, sí |
| (reto del video 1) | Respuesta del reto | Por qué salían escalones: astype corta 0.2…0.8 → 0 |
| (teoría) | Tres formas de leer | **Three.js:** fila de cubos; índice, corte y lista de posiciones |
| 1. NumPy Array Indexing | Índices de un arreglo | `temps[0]`, `[-1]`, asignar, 21.9 → 21 (cuidado), IndexError |
| 2. Updating Arrays with Slices | Modificar con cortes | `[1:4]`, `[:3]`, `[::2]`, `[::-1]`, asignar a un corte, **vista vs copia** (**Three.js**) |
| 3. Selecting Scattered Array Elements | Elementos dispersos | `temps[[0, 2, 5]]`, orden y repetición, es copia, asignar a posiciones |
| (3 ejemplos) | Dónde se usa | Industria: corregir lecturas · Ciencia: descartar mediciones · Día a día: playlist |
| (plus) | Plus: Ciencia de Datos | `permutation` + cortes = entrenamiento/prueba; `iloc` de pandas |
| (reto) | Reto y resumen | Del 1 al 10, invertido y uno de cada tres, en un solo corte (respuesta: `[10 7 4 1]`) |

**Títulos (≤ 60):** 1. Índices y cortes en NumPy | Numpy 1D (36) · 2. Accede a los elementos al estilo NumPy | Numpy 1D (49) ·
3. Cómo leer y cambiar un arreglo de NumPy | Numpy 1D (50).

**Miniatura:** casillas `10 [0 30 40] 50` con el corte `[1:4]` marcado y el `0` en coral + "¡CAMBIÓ EL ORIGINAL!"
(3 palabras; la trampa del gancho, que el video explica en «Modificar con cortes»).

## Video 3 · Operaciones vectorizadas (Vectorized Operations)
Guion: `src/guiones/n03-vectorizadas.json` (aprobado). Video: `src/videos/N03Vectorizadas.tsx` → 4:46. Título elegido: «Operaciones vectorizadas en NumPy | Numpy 1D».

| Contenido del dueño | Capítulo | Qué se ve |
|---|---|---|
| (gancho) | Adiós al for | 1,000,000 °C → °F: for 73.7 ms vs NumPy 1.54 ms (~48×), una sola línea |
| (reto del video 2) | Respuesta del reto | `a[::-3]` → `[10 7 4 1]` |
| (teoría) | ¿Qué es vectorizar? | **Three.js:** cabezal que recorre cubo por cubo (for) vs todos a la vez (NumPy) |
| 1. Vectorized Array Operations | Operaciones vectorizadas | `+ - * /` con un número; `/` siempre da decimales; `10 - precios` |
| 2. Powers, Floor Division, and Remainders | Potencias, división entera y residuo | `**`, `//`, `%`; minutos → horas; cuidado: `-7 // 2` = -4 |
| 3. Combining Arrays Elementwise | Combinar arreglos | **Three.js:** precios × cantidades par a par; listas vs arreglos; ValueError de formas |
| 4. Chaining NumPy Operations | Encadenar operaciones | Orden de operaciones, paréntesis mal puestos (cuidado), cadena con `.round().sum()` |
| 5. Vectorized Math Functions | Funciones matemáticas | `np.sqrt`, `np.abs`, `np.exp`, `np.log10`; cuidado: `math.sqrt` con arreglo → TypeError |
| (3 ejemplos) | Dónde se usa | Comercio: total con IVA · Ciencia: café que se enfría (exp) · Día a día: tiempos de carrera (// y %) |
| (plus) | Plus: Ciencia de Datos | Normalización min-max y estandarización en una línea (escaladores de scikit-learn) |
| (reto) | Reto y resumen | Suma de los cuadrados de los impares del 1 al 10 sin for (respuesta: 165) |

**Títulos (≤ 60):** 1. Operaciones vectorizadas en NumPy | Numpy 1D (44) · 2. Adiós al ciclo for: vectoriza con NumPy | Numpy 1D (50) ·
3. Calcula sin ciclos for con NumPy | Numpy 1D (43).

**Miniatura:** «×1,000,000» arriba; «CICLO FOR 74 ms» en rojo → «NUMPY 1.5 ms» en verde (3 palabras; el dato del gancho).

## Video 4 · Máscaras booleanas (Boolean Arrays and Masks)
Guion: `src/guiones/n04-mascaras.json` (por aprobar). Duración estimada ~4:20–4:50.

| Contenido del dueño | Capítulo | Qué se ve |
|---|---|---|
| (gancho) | Tres preguntas | Año simulado de 365 días: ¿cuántos > 30 °C? 24 · promedio 31.9 · ¿cuáles? (3 líneas, sin for) |
| (reto del video 3) | Respuesta del reto | 165, y la versión con máscara `(a[a % 2 == 1] ** 2).sum()` |
| (teoría) | ¿Qué es una máscara? | **Three.js:** plantilla con huecos (True) por donde suben los cubos |
| 1. Creating Boolean Masks with Comparisons | Crear máscaras | `>`, `==`, `&`, `|`, `~` con paréntesis; cuidado: `and` → ValueError |
| 2. Filtering Arrays with Boolean Masks | Filtrar con máscaras | `temps[temps > 30]`, filtros combinados, la misma máscara sobre los días; es copia |
| 3. Reducing Masks to Answers | Reducir a respuestas | `.sum()` cuenta, `.mean()` proporción, `.any()`, `.all()`, `np.nonzero` |
| 4. Updating Values with Masks | Cambiar con máscaras | `t[t > 30] = 30` (modifica) vs `np.where` (arreglo nuevo) |
| (3 ejemplos) | Dónde se usa | Fábrica: piezas fuera de tolerancia · Laboratorio: lecturas válidas · Día a día: gastos grandes |
| (plus) | Plus: Ciencia de Datos | `df[df["edad"] >= 18]` en pandas y accuracy = `(y_pred == y_real).mean()` → 0.8 |
| (reto) | Reto y resumen | ¿Cuántos del 1 al 50 son múltiplos de 3 o de 5? (respuesta: 23) |

**Títulos (≤ 60):** 1. Máscaras booleanas en NumPy | Numpy 1D (38) · 2. Filtra datos sin for: máscaras de NumPy | Numpy 1D (50) ·
3. Arreglos booleanos y máscaras | Numpy 1D (40).

**Miniatura (propuesta, ligada al título):** las 365 barras del año con solo las de más de 30 °C encendidas en coral y
«24 DÍAS > 30 °C» (el filtro hecho visible; es el gancho del video).

## Cómo se enlazan
- **Pantalla final:** siguiente video + lista de reproducción (prevista en `Cierre`).
- **Tarjetas:** al video anterior cuando se usa un concepto suyo.
- **Descripción:** link directo a Colab del notebook (en `main` antes de publicar), capítulos, lista.
- **Comentario fijado:** invitar a responder el reto ("¿por qué escalones?").

## Qué medir
- CTR de la miniatura (meta ≥ 4–5 %), retención a los 30 s, y clics al notebook (visitas al repo en GitHub → Insights → Traffic).
