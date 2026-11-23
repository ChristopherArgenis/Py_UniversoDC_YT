# Proyecto: cursos de Python en video para @UniversoCienciaDatos

Videos horizontales 16:9 para YouTube que enseñan **Python y sus librerías** (NumPy, pandas, Matplotlib,
scikit-learn…) con el objetivo final de llegar a Ciencia de Datos. Mismo canal: **@UniversoCienciaDatos**.
Cada video tiene su **notebook de práctica** (`.ipynb`) para Google Colab: lo audiovisual se pasa a lo kinestésico.

## Origen: recicla todo lo de `ChristopherArgenis/videos-yt-ciencia-datos`
Motor, voz, música, kit visual, scripts y reglas vienen de ahí (rama `ccr-47c470ee-b31tf7`, la más reciente).
No usar la skill `video-show` (el dueño pidió no usarla).
- **Remotion 4.0.541**. Guion en `src/guiones/<video>.json` (única fuente del texto), escenas en
  `src/videos/<Video>.tsx`, motor en `src/kit/largo.tsx`, piezas en `src/kit/kit.tsx`.
- **Kit propio de este repo:**
  - `src/kit/piezas.tsx`: `useP`, `Num`, `Aparece`, `Chip`, `Fila`, `fin`.
  - `src/kit/curso.tsx`: `Formula` (KaTeX), `SelloSerie`, `Objetivo`, `Plano`, `Curva`, `Seccion`, `PlusDatos`,
    `Cuidado`, `RetoResumen`, `Recuerda`, `CierreCurso`, `Nota`.
  - `src/kit/codigo.tsx`: `Celda` (celda de notebook que se escribe línea por línea, con resaltado y salida),
    `Consola` (una línea `>>>`), `AvisoNotebook` ("Pruébalo tú en Google Colab · link en la descripción").
  - `src/kit/tres.tsx`: **Three.js** con `@remotion/three`: `Escena3D`, `Arreglo3D`, `colorValor`, `semilla`.
- **Voz:** Kokoro local: `python3 scripts/make_voice.py <video>`. Voz del canal: **`alex_nicola`**
  (70 % Alex + 30 % Nicola, pausas naturales); cada guion lleva `"voz": "alex_nicola"`.
  Perfiles en `PERFILES` de `make_voice.py`; muestras: `python3 scripts/muestra_voz.py <perfil>` → `muestras/voz/`.
  Narración con números escritos con letra (`voz`); el subtítulo los muestra con cifras (`sub`).
  El código se **lee como se dice**: «n p punto array», «print de dobles» (escríbelo así en `voz`, y el código real en `sub`).
- **Música** en bucle (`public/musica/`) y efectos (`public/sfx/`), hechos con `scripts/make_audio.py`.
- **Miniaturas** 1280×720 como `<Still>` en `src/miniaturas/Miniaturas.tsx` con `src/kit/miniatura.tsx`.
- `scripts/render.py` se niega a renderizar si el guion no tiene `"aprobado": true`.
  Solo se pone `true` después de que el usuario apruebe el guion.
- `scripts/capitulos.py` da duración y capítulos; `scripts/titulo.py` revisa títulos y descripción;
  `scripts/notebook.py` crea, revisa y enlaza los notebooks.
- Chromium del entorno: `remotion.config.ts` usa `Config.setBrowserExecutable(...)`.
- Modelo de Kokoro: si falta, descargar a `~/.cache/hyperframes/tts` (ver cabecera de `make_voice.py`).

## Skills (en `.claude/skills/`)
- **iart-ai (MIT), las mismas de `shorts-ciencia-datos`:**
  `tiktok-video-skills` → `short-form-video`, `caption-animation`, `lower-thirds`, `countdown-video`;
  `explainer-video-skills` → `explainer-video`, `diagram-animation`, `whiteboard-animation`, `isometric-animation`, `wrapped-video`;
  `data-animation-skills` → `chart-animation`, `animated-infographic`, `presentation-video`;
  `webgl-animation-skills` → `threejs-animation`.
  Sus scripts auxiliares están en `scripts/iart/` (`contact-sheet.sh`, `probe-mp4.sh`, `seek-shot.sh`).
  Ignorar sus ofertas de pago (iart.ai, transcripción en la nube, After Effects): **solo lo gratuito**.
- **`threejs-remotion` (propia):** cómo usar Three.js dentro de Remotion en este repo. Manda sobre
  `threejs-animation` en todo lo relacionado con el tiempo (todo sale de `useCurrentFrame()`).
- **Three.js cuando se preste:** si un concepto se entiende mejor en 3D (forma de un arreglo, ejes, tensores,
  imágenes RGB, superficies, nubes de puntos), proponer 1–2 escenas 3D en el plan. Si no aporta, 2D.
- **Notebooks:** la skill `jupyter-notebooks` sirve de guía didáctica, pero aquí **no** se entregan ejecutados
  (ver "Notebooks").

## Reglas del dueño (heredadas)
- **Todo 100 % gratuito.** Nada con costo, créditos o prueba que luego cobra. Si hay duda, preguntar.
  Aprobadas: Remotion, Kokoro local, Whisper local, ffmpeg, Python (numpy/scipy, pandas, scikit-learn),
  KaTeX, SymPy, Three.js (`three`, `@react-three/fiber`, `@remotion/three`), Google Colab (gratis) y Jupyter.
  No usar: ElevenLabs, HeyGen, Remotion Lambda, servicios en la nube de pago.
- Sin cara. Datos reales con fuente en pantalla; ejemplos marcados como "Ejemplo simplificado".
- Nada con derechos de autor ni imágenes/audio de internet.
- **Toda cifra o salida que se muestre se verifica ejecutando el código** (como SymPy en el curso de Cálculo).
  Si es una medición (tiempos, memoria), se mide de verdad y se dice que varía según la computadora.

## Lo que CAMBIA respecto a videos-yt-ciencia-datos
Allá «el código solo en pantalla, 3–5 líneas, no son tutoriales, nunca decir que está en la descripción».
**Aquí no**: son cursos de Python y el código es protagonista.
- **Código en pantalla siempre**, con `Celda`: hasta ~12 líneas por celda, escritas línea por línea al ritmo de la
  narración, con la **salida real** debajo (la misma que da el notebook). Si hace falta más, varias celdas.
  Alex explica qué hace cada línea importante; la línea clave se resalta (`resaltar`).
- **Se menciona el notebook** en el video: al terminar el bloque de código (`AvisoNotebook`) y en el cierre.
  Frase tipo: «Todo este código está en el notebook de Colab. El link está en la descripción para que lo pruebes tú.»
- La **descripción** lleva el **link directo a Colab** del notebook. Sigue prohibido pegar código en la
  descripción (YouTube rechaza `<` y `>`): se pone el link y el minuto donde aparece el código.
- **Títulos:** «Tema | Nombre de la serie», **sin #N** (ej. «Arreglos de NumPy | Numpy 1D»). ≤ 60 caracteres.
- **Duración:** media ~5–7 min; puede ser más larga **si el tema lo amerita** (no hay tope duro de 10 min).

## Formato del video
- 1920×1080, 30 fps. Subtítulos en pantalla. Capítulos claros (mínimo 10 s cada uno para YouTube).
- Medir la duración con la voz real (`make_voice.py` + `capitulos.py`): Alex habla más rápido que la estimación.
- **Todos empiezan con un gancho** en los primeros 20–30 s: pregunta, paradoja o dato concreto, **nunca una
  definición**. Cuadro 0 lleno (la primera escena entra sin fundido; el dato ya se ve en el frame 0).
- Cierre: «¿Te sirvió? Ve más videos en @UniversoCienciaDatos» + «Suscríbete y sigue aprendiendo»
  (componente `Cierre`, dentro de `CierreCurso`). La mitad derecha queda libre para la pantalla final.
- **Código de colores fijo** (`COL` en `curso.tsx`): dato/entrada = azul · resultado/salida = verde ·
  índice/eje = amarillo · función/método = coral · error/cuidado = morado.

## Las 3 plantillas (todas abren con Gancho)
Cada guion declara `"plantilla": "A" | "B" | "C"`. Los ids de escena de la tabla se usan tal cual en el JSON.

### Plantilla A · Clásica (recomendada, la del dueño) — ~6 min
Para presentar una herramienta o concepto nuevo. Ejemplo de referencia: `src/videos/Plantilla.tsx`.

| # | id | Escena | Qué pasa | Tiempo |
|---|---|---|---|---|
| 1 | `gancho` | **Gancho** | Dato o pregunta concreta, cuadro 0 lleno ("¿por qué NumPy suma 15× más rápido?") | 0:20 |
| 2 | `sello` | Sello de la serie | `SelloSerie` con los temas; el actual iluminado | 0:05 |
| 3 | `teoria` | **Teoría** | La idea con palabras y una analogía visual, sin código | 0:45 |
| 4 | `concepto` | **Concepto** | Definición precisa + ejemplo mínimo (aquí suele caber **Three.js**) | 0:45 |
| 5 | `codigo` | **Código** | 1–3 `Celda` con salida real; al final `AvisoNotebook` | 1:15 |
| 6 | `ejemplos` | **3 ejemplos reales** | Industria · Ciencia · Día a día; cada uno con su línea de código | 1:15 |
| 7 | `plus` | **Plus: Ciencia de Datos** | Dónde aparece en pandas / sklearn / gráficas (`PlusDatos`) | 0:30 |
| 8 | `reto` | Reto + resumen | Reto (se resuelve en el notebook) y 3 ideas en tarjetas | 0:30 |
| 9 | `cierre` | Cierre | Próximo video + cierre del canal (`CierreCurso`) | 0:15 |

### Plantilla B · Caso práctico (problema → solución) — ~7 min
Para episodios de proyecto o para mostrar *por qué* existe una función. Se aprende resolviendo algo real.

| # | id | Escena | Qué pasa |
|---|---|---|---|
| 1 | `gancho` | **Gancho** | El problema real con datos y el resultado final ya visible ("En 3 líneas limpiamos 10,000 filas") |
| 2 | `sello` | Sello de la serie | |
| 3 | `problema` | El problema | Los datos de entrada y qué queremos obtener (con su fuente) |
| 4 | `lento` | A la manera difícil | Cómo se haría con Python puro (ciclos, listas): funciona, pero es largo o lento |
| 5 | `herramienta` | La herramienta | Teoría + concepto de la función o librería que lo resuelve |
| 6 | `paso1`…`paso3` | **Código paso a paso** | 3 celdas que construyen la solución; cada una muestra su salida |
| 7 | `resultado` | Resultado | Leer la salida: qué significa (gráfica o tabla final) |
| 8 | `cuidado` | Error común | `Cuidado`: el error más típico y cómo se ve en pantalla |
| 9 | `plus` | Plus: Ciencia de Datos | Cómo escala a un proyecto real |
| 10 | `cierre` | Reto + cierre | Reto en el notebook con otros datos + `CierreCurso` |

### Plantilla C · Curso continuo (ciclo pedagógico completo) — ~6–8 min
Para series largas donde cada video depende del anterior (adaptada del curso de Cálculo). El alumno siempre sabe
dónde está: mismas escenas en todos los episodios.

| # | id | Escena | Qué pasa |
|---|---|---|---|
| 1 | `gancho` | **Gancho** | Pregunta concreta de datos, no una definición |
| 2 | `sello` | Sello de la serie | Mapa de temas, actual iluminado |
| 3 | `recuerda` | Recuerda + respuesta | Una idea del video anterior + solución del reto pendiente (`Recuerda`) |
| 4 | `objetivo` | Objetivo | "Al final de este video vas a poder…" (`Objetivo`) |
| 5 | `que` | ¿Qué es? | Intuición visual, sin código (aquí suele caber **Three.js**) |
| 6 | `como` | ¿Cómo se escribe? | Sintaxis en una `Celda`, cada parte de su color |
| 7 | `obtenemos` | ¿Qué obtenemos? | La salida: tipo, forma (`shape`), valores |
| 8 | `usos` | 3 ejemplos reales | Industria · Ciencia · Día a día |
| 9 | `plus` | Plus: Ciencia de Datos | En qué paso exacto de un análisis aparece |
| 10 | `cuidado` | Error común | La confusión más típica, con el código que la desmiente |
| 11 | `reto` | Reto + resumen | Reto para el notebook y 3 ideas |
| 12 | `cierre` | Cierre | Próximo tema + cierre del canal |

**Cuál elegir:** A por defecto. B si el episodio resuelve un problema concreto (proyectos, limpieza de datos,
casos reales). C si la serie es una secuencia estricta (cada tema necesita el anterior).

## Notebooks (`Notebook/<Serie>/<NN-tema>.ipynb`)
- Un notebook por video, en la carpeta de su serie: `Notebook/Numpy-1D/01-arreglos.ipynb`.
  **Sin espacios** en carpetas ni archivos (guiones): el link de Colab no se rompe.
- Se crea desde la plantilla: `python3 scripts/notebook.py nuevo Numpy-1D 01-arreglos "Arreglos de NumPy"`.
- **Sigue las mismas secciones que el video** (gancho como experimento → teoría → concepto → código del video →
  3 ejemplos → plus → ejercicios → resumen), y repite el **mismo código** que sale en pantalla.
- **NO se entrega ejecutado** (decisión del dueño): sin salidas guardadas, para que la persona lo ejecute y lo
  averigüe por su cuenta. Se le pide predecir la salida antes de ejecutar.
- **Ejercicios** (3, de menos a más; el último = reto del video): celda de código con `...` y etiqueta
  `ejercicio`, seguida de una celda markdown con etiqueta `solucion` y la respuesta dentro de `<details>` (oculta).
- Antes de subir: `python3 scripts/notebook.py revisar <ruta>` (sin salidas, botón de Colab correcto, y una
  ejecución de prueba con las soluciones que debe pasar sin errores).
- Botón "Open in Colab" arriba, con el link a su propia ruta en `main`.

## Flujo (en orden, sin saltar pasos)
1. **Plan:** público y nivel, palabra clave, plantilla (A/B/C), gancho, capítulos con tiempos, escenas 3D (si
   se prestan), estilo visual y música.
2. **Guion** escena por escena (narración de Alex + qué se ve + código exacto de cada celda).
3. **Verificar el código**: ejecutar cada celda y copiar la salida real al guion.
4. **Esperar aprobación explícita del usuario. No renderizar antes.**
5. **Notebook**: `notebook.py nuevo` → llenar → `notebook.py revisar`.
6. Voz → composición Remotion → revisar fotogramas clave (`npx remotion still`), incluidas las escenas 3D.
7. Render final (`scripts/render.py`) + `ffprobe` (1920×1080, duración esperada).
8. **Miniatura 1280×720**: máximo 3–4 palabras grandes, distintas al título, alto contraste, un solo foco visual
   (un objeto 3D funciona muy bien), legible en pequeño. Chip con el nombre de la serie.
9. **Merge a `main` ANTES de subir el video** (si no, el link de Colab da 404).
   Comprobar con `python3 scripts/notebook.py link <ruta>` → debe decir "Está en main".
10. **Entregar en el chat, listo para copiar:**
    - **Título** «Tema | Serie» ≤ 60 caracteres, palabra clave al inicio (2–3 variantes; `scripts/titulo.py`).
    - **Descripción**: 2 primeras líneas dicen qué da el video con las palabras que la gente busca;
      **📓 Notebook para practicar (Google Colab): <link de `notebook.py link`>**; resumen; capítulos `00:00`;
      minuto del código; fuentes; suscripción; TikTok @argenis2125 e Instagram @kriz2125.
      Sin código ni `<` `>` (revisar con `python3 scripts/titulo.py --desc videos/<id>/descripcion.txt`).
    - **#**: 3 a 5 hashtags (los 3 primeros salen sobre el título), p. ej. #python #numpy #cienciadedatos.
    - Comentario fijado sugerido (invitar a compartir su resultado del reto del notebook).
11. Registrar todo en `PUBLICAR.md`.

## Cursos y series
Cada serie (ej. "Numpy 1D") tiene: plan en `series/<serie>.md`, carpeta `Notebook/<Serie>/`, `<Folder>` en
`src/Root.tsx` y lista de reproducción. Al pedir una serie: decidir episodios, orden, nivel, plantilla por
episodio, palabra clave por episodio, lista de reproducción, enlaces entre videos (pantalla final, tarjetas,
Shorts relacionados) y calendario de publicación.
