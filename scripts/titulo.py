"""Revisa título, descripción y hashtags antes de publicar en YouTube.

    python3 scripts/titulo.py "Título del video" ["Título alternativo" ...]
    python3 scripts/titulo.py --desc videos/01-tema/descripcion.txt

Reglas del canal (sustituye a yt-package/title.py, que no está en el repo):
- Título de 60 caracteres o menos (YouTube corta cerca de ahí en móvil), máx. 100.
- Sin abusar de MAYÚSCULAS ni de signos (!!!, ???).
- Cursos de Python: «Tema | Nombre de la serie», SIN número (ej. «Arreglos de NumPy | Numpy 1D»).
- Descripción: las 2 primeras líneas dicen qué da el video; 3 a 5 hashtags; sin código ni < >;
  link directo a Colab del notebook (Notebook/<Serie>/<NN-tema>.ipynb) que ya esté en main.
"""
import re, sys


def titulo(t):
    avisos = []
    n = len(t)
    if n > 100:
        avisos.append("pasa de 100 caracteres: YouTube no lo acepta")
    elif n > 60:
        avisos.append(f"{n} caracteres: se cortará en móvil (ideal ≤ 60)")
    letras = [c for c in t if c.isalpha()]
    if letras and sum(c.isupper() for c in letras) / len(letras) > 0.5:
        avisos.append("demasiadas mayúsculas")
    if re.search(r"[!?¡¿]{3,}", t):
        avisos.append("demasiados signos seguidos")
    if re.search(r"#[^\W\d]", t):
        avisos.append("los hashtags van en la descripción, no en el título")
    if "|" not in t:
        avisos.append("falta la serie: «Tema | Nombre de la serie»")
    if re.search(r"#\d+\s*$", t):
        avisos.append("en estos cursos el título NO lleva #N: «Tema | Nombre de la serie»")
    print(f"[{n:>3}] {t}")
    for a in avisos:
        print(f"      AVISO: {a}")
    if not avisos:
        print("      ok")


def descripcion(ruta):
    texto = open(ruta, encoding="utf-8").read()
    lineas = [l for l in texto.splitlines() if l.strip()]
    tags = re.findall(r"#[^\W\d]\w*", texto)
    print("Primeras líneas (se ven sin abrir la descripción):")
    for l in lineas[:2]:
        print("  " + l)
    print(f"{len(texto)} caracteres (máx. 5000)")
    if len(texto) > 5000:
        print("AVISO: pasa de 5000 caracteres")
    if not 3 <= len(tags) <= 5:
        print(f"AVISO: {len(tags)} hashtags (usar de 3 a 5)")
    if not re.search(r"^0?0:00", texto, re.M):
        print("AVISO: faltan capítulos (el primero debe ser 00:00)")
    if "colab.research.google.com/github/ChristopherArgenis/Py_UniversoDC_YT/blob/main/Notebook/" not in texto:
        print("AVISO: falta el link directo a Colab del notebook (python3 scripts/notebook.py link <ruta>)")
    if re.search(r"[<>]", texto):
        print("AVISO: YouTube no acepta < ni > en la descripción")
    codigo = [l for l in texto.splitlines() if re.search(r"^\s*(import |from \w+ import|\w+\s*=\s*\w+[.(\[])|\w+\.\w+\(.*\)\s*$", l)]
    if codigo:
        print("AVISO: parece haber código; el código va en pantalla, no en la descripción:")
        for l in codigo[:3]:
            print("   " + l.strip())


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    if args[0] == "--desc":
        descripcion(args[1])
    else:
        for t in args:
            titulo(t)
