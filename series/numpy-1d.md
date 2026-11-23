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
| 1 | De listas a arreglos \| Numpy 1D | numpy arreglos / numpy array | `01-listas-a-arreglos.ipynb` | renderizado · por publicar |
| 2 | (el dueño define el contenido) | | | |

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

## Cómo se enlazan
- **Pantalla final:** siguiente video + lista de reproducción (prevista en `Cierre`).
- **Tarjetas:** al video anterior cuando se usa un concepto suyo.
- **Descripción:** link directo a Colab del notebook (en `main` antes de publicar), capítulos, lista.
- **Comentario fijado:** invitar a responder el reto ("¿por qué escalones?").

## Qué medir
- CTR de la miniatura (meta ≥ 4–5 %), retención a los 30 s, y clics al notebook (visitas al repo en GitHub → Insights → Traffic).
