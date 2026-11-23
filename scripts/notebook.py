"""Notebooks de práctica (Google Colab) que acompañan a cada video.

    python3 scripts/notebook.py nuevo Numpy-1D 01-arreglos "Arreglos de NumPy"
    python3 scripts/notebook.py revisar Notebook/Numpy-1D/01-arreglos.ipynb
    python3 scripts/notebook.py link Notebook/Numpy-1D/01-arreglos.ipynb

nuevo    Copia Notebook/_plantilla.ipynb a Notebook/<Serie>/<archivo>.ipynb con el título, la serie
         y el botón "Open in Colab" ya apuntando a su ruta.
revisar  1) El archivo NO debe tener salidas guardadas (la persona lo ejecuta y lo averigua por su cuenta).
         2) Ejecuta una copia temporal: las celdas con la etiqueta "ejercicio" se cambian por el código
            de la celda markdown "solucion" que les sigue, para comprobar que todo corre sin errores.
         3) Revisa que el botón de Colab apunte a su propia ruta.
link     Imprime el enlace directo a Colab para la descripción del video y avisa si el notebook
         todavía NO está en la rama main de GitHub (el enlace solo funciona desde main:
         hacer el merge ANTES de publicar el video).

Reglas: carpetas sin espacios (Numpy-1D, no "Numpy 1D"); archivos NN-tema.ipynb.
Requiere: pip install nbformat nbclient ipykernel (más las librerías que use el notebook).
"""
import copy, os, re, subprocess, sys, tempfile

import nbformat

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
REPO = "ChristopherArgenis/Py_UniversoDC_YT"
RAMA = "main"
PLANTILLA = os.path.join(ROOT, "Notebook", "_plantilla.ipynb")


def rel(ruta):
    return os.path.relpath(os.path.abspath(ruta), ROOT).replace(os.sep, "/")


def colab(ruta):
    return f"https://colab.research.google.com/github/{REPO}/blob/{RAMA}/{rel(ruta)}"


def github(ruta):
    return f"https://github.com/{REPO}/blob/{RAMA}/{rel(ruta)}"


def nuevo(serie, archivo, titulo):
    if " " in serie or " " in archivo:
        sys.exit("Sin espacios en carpetas ni archivos: usa guiones (Numpy-1D, 01-arreglos).")
    if not archivo.endswith(".ipynb"):
        archivo += ".ipynb"
    destino = os.path.join(ROOT, "Notebook", serie, archivo)
    if os.path.exists(destino):
        sys.exit(f"Ya existe: {rel(destino)}")
    nb = nbformat.read(PLANTILLA, as_version=4)
    nombre_serie = serie.replace("-", " ")
    for c in nb.cells:
        c.source = (c.source.replace("{{TITULO}}", titulo).replace("{{SERIE}}", nombre_serie)
                    .replace("{{COLAB}}", colab(destino)).replace("{{RUTA}}", rel(destino)))
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    nbformat.write(nb, destino)
    print(f"Creado {rel(destino)}\nColab: {colab(destino)}")


def _codigo_md(texto):
    """Código de los bloques ```python dentro de una celda markdown."""
    return "\n".join(re.findall(r"```python\n(.*?)```", texto, re.S))


def revisar(ruta):
    nb = nbformat.read(ruta, as_version=4)
    errores = []
    con_salida = [i for i, c in enumerate(nb.cells) if c.cell_type == "code" and (c.get("outputs") or c.get("execution_count"))]
    if con_salida:
        errores.append(f"celdas con salida guardada: {con_salida} (limpia las salidas antes de subirlo)")
    if colab(ruta) not in "".join(c.source for c in nb.cells[:2]):
        errores.append(f"el botón de Colab no apunta a {colab(ruta)}")
    if re.search(r"\{\{\w+\}\}", "".join(c.source for c in nb.cells)):
        errores.append("quedan marcadores {{...}} sin llenar")

    prueba = copy.deepcopy(nb)
    celdas = []
    for i, c in enumerate(prueba.cells):
        tags = c.get("metadata", {}).get("tags", [])
        if c.cell_type == "code" and "ejercicio" in tags:
            sol = next((d for d in prueba.cells[i + 1:] if "solucion" in d.get("metadata", {}).get("tags", [])), None)
            if sol is None:
                errores.append(f"la celda {i} es 'ejercicio' pero no tiene una celda 'solucion' después")
                continue
            c = nbformat.v4.new_code_cell(_codigo_md(sol.source))
        celdas.append(c)
    prueba.cells = celdas
    from nbclient import NotebookClient

    with tempfile.TemporaryDirectory() as tmp:
        try:
            NotebookClient(prueba, timeout=300, kernel_name="python3", resources={"metadata": {"path": tmp}}).execute()
            print("Ejecución de prueba (con soluciones): ok")
        except Exception as e:  # noqa: BLE001
            errores.append(f"falla al ejecutar: {str(e).strip().splitlines()[-1] if str(e).strip() else e}")
    n_ej = sum("ejercicio" in c.get("metadata", {}).get("tags", []) for c in nb.cells)
    print(f"{rel(ruta)}: {len(nb.cells)} celdas, {n_ej} ejercicios")
    for e in errores:
        print("ERROR: " + e)
    if errores:
        sys.exit(1)
    print("ok")


def link(ruta):
    r = rel(ruta)
    print(colab(ruta))
    print(f"(GitHub: {github(ruta)})")
    subprocess.run(["git", "fetch", "-q", "origin", RAMA], cwd=ROOT)
    en_main = subprocess.run(["git", "cat-file", "-e", f"origin/{RAMA}:{r}"], cwd=ROOT, capture_output=True).returncode == 0
    if not en_main:
        print(f"AVISO: {r} todavía no está en {RAMA}. Haz el merge a {RAMA} ANTES de publicar el video: si no, el link de Colab da error 404.")
    else:
        print(f"Está en {RAMA}: el link funciona.")


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) == 4 and a[0] == "nuevo":
        nuevo(a[1], a[2], a[3])
    elif len(a) == 2 and a[0] == "revisar":
        revisar(a[1])
    elif len(a) == 2 and a[0] == "link":
        link(a[1])
    else:
        sys.exit(__doc__)
