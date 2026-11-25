# Py_UniversoDC_YT

Cursos de **Python y sus librerías** en video (YouTube **@UniversoCienciaDatos**), orientados a llegar a
Ciencia de Datos. Cada video tiene su **notebook de práctica** listo para abrir en Google Colab.

## 📓 Notebooks para practicar
Están en [`Notebook/`](Notebook/), una carpeta por serie (por ejemplo, `Notebook/Numpy-1D/`).
Ábrelos con el botón **Open in Colab** de cada notebook o con el link de la descripción del video.
Vienen **sin ejecutar**: córrelos tú, celda por celda, y resuelve los ejercicios.

| Serie | Carpeta | Videos |
| --- | --- | --- |
| Numpy 1D | [`Notebook/Numpy-1D`](Notebook/Numpy-1D) | 1. [De listas a arreglos](Notebook/Numpy-1D/01-listas-a-arreglos.ipynb) · 2. [Índices y cortes](Notebook/Numpy-1D/02-indices-y-cortes.ipynb) |

---

## Para producir los videos
Videos 16:9 (1920×1080) sin cara, hechos con [Remotion](https://remotion.dev), voz local Kokoro (Alex),
música hecha con código y **Three.js** para escenas 3D. Todo gratis y local. Motor reciclado de
[videos-yt-ciencia-datos](https://github.com/ChristopherArgenis/videos-yt-ciencia-datos). Reglas completas,
las **3 plantillas** y el flujo en [`CLAUDE.md`](CLAUDE.md).

```bash
npm i
cp src/guiones/plantilla.json src/guiones/01-tema.json                  # 1. guion (plan + narración + código)
python3 scripts/capitulos.py 01-tema                                     #    duración estimada y capítulos
python3 scripts/ver_guion.py 01-tema                                     #    guion legible para aprobar
#   → mostrar el guion y esperar aprobación; luego "aprobado": true
python3 scripts/notebook.py nuevo Numpy-1D 01-tema "Tema"                # 2. notebook de práctica
python3 scripts/notebook.py revisar Notebook/Numpy-1D/01-tema.ipynb      #    sin salidas y sin errores
python3 scripts/make_voice.py 01-tema                                    # 3. voz de Alex
#   4. src/videos/V01Tema.tsx (una escena por id) y registrarlo en src/Root.tsx
npm run dev                                                              #    Remotion Studio
npx remotion still 01-Tema out/f.png --frame=300                         #    revisar un fotograma
python3 scripts/render.py 01-tema 01-Tema                                # 5. render + verificación
npx remotion still Mini-01-Tema out/miniaturas/Mini-01-Tema.png          # 6. miniatura 1280×720
#   7. merge a main ANTES de publicar
python3 scripts/notebook.py link Notebook/Numpy-1D/01-tema.ipynb         #    link de Colab para la descripción
python3 scripts/titulo.py "Tema | Numpy 1D"                              #    revisar títulos
```

## Estructura
- `src/guiones/<video>.json` guion (única fuente del texto: voz, subtítulos, tiempos y capítulos).
- `src/kit/` motor (`largo.tsx`), piezas (`kit.tsx`, `piezas.tsx`), curso (`curso.tsx`), código y notebook
  (`codigo.tsx`), 3D con Three.js (`tres.tsx`), miniaturas (`miniatura.tsx`), tema (`theme.ts`).
- `src/videos/` un archivo por video · `src/miniaturas/` una miniatura por video.
- `Notebook/<Serie>/<NN-tema>.ipynb` notebooks · `Notebook/_plantilla.ipynb` plantilla.
- `series/` plan de cada serie · `PUBLICAR.md` título, descripción y hashtags de cada video.
- `scripts/` voz, música, render, capítulos, títulos y notebooks · `scripts/iart/` ayudas de las skills.
- `.claude/skills/` skills de motion graphics (iart-ai, MIT) + `threejs-remotion`.

Fuera de este sandbox, borra la línea `Config.setBrowserExecutable(...)` de `remotion.config.ts`
(Remotion descarga su propio navegador).
