"""Fotogramas de revisión en los momentos críticos de un video (no solo a la mitad):
inicio y final de cada escena, y ~0.7 s después de que empieza cada frase de Alex.

    python3 scripts/revisar_fotogramas.py n01-listas-arreglos N01-ListasArreglos [escena ...]

Escribe out/revision/<video>/*.png y hojas de contacto out/revision/<video>/hoja-NN.png (12 por hoja, con etiqueta).
Revisa: destellos entre escenas, cosas encimadas o que saltan, texto cortado, subtítulos tapados, 3D vacío.
"""
import json, os, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capitulos import cargar  # noqa: E402
import math

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))


def marcas(vid, solo):
    g, t, d = cargar(vid)
    fps = t["fps"]
    f = lambda s: math.ceil(s * fps)
    desde, m = 0, []
    for e in g["escenas"]:
        x = f(t["inicio"])
        ids = list(e["voz"])
        sel = not solo or e["id"] in solo
        if sel:
            m.append([desde + 1, f"{e['id']}-ini"])
        for i, k in enumerate(ids):
            if sel:
                m.append([desde + x + 20, k])
            x += f(d.get(k, len(e["voz"][k].split()) / t["palabrasPorSegundo"])) + (f(t["entre"]) if i < len(ids) - 1 else 0)
        x += f(e.get("pausa", t["pausa"]))
        x = max(x, f(e.get("min", 0)))
        if sel:
            m.append([desde + x - 2, f"{e['id']}-fin"])
        desde += x
    return m


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    vid, comp, solo = sys.argv[1], sys.argv[2], sys.argv[3:]
    dest = os.path.join(ROOT, "out", "revision", vid)
    os.makedirs(dest, exist_ok=True)
    for p in os.listdir(dest):
        os.remove(os.path.join(dest, p))
    m = marcas(vid, solo)
    ruta = os.path.join(dest, "marcas.json")
    json.dump(m, open(ruta, "w"))
    subprocess.run(["node", "scripts/fotogramas.mjs", comp, ruta, dest, "0.5"], cwd=ROOT, check=True)
    from PIL import Image, ImageDraw

    pngs = sorted(p for p in os.listdir(dest) if p.endswith(".png"))
    for h in range(0, len(pngs), 12):
        hoja = Image.new("RGB", (960 * 3, 540 * 4), "black")
        for i, p in enumerate(pngs[h : h + 12]):
            im = Image.open(os.path.join(dest, p)).convert("RGB").resize((960, 540))
            ImageDraw.Draw(im).text((8, 520), p[:-4], fill="yellow")
            hoja.paste(im, ((i % 3) * 960, (i // 3) * 540))
        hoja.save(os.path.join(dest, f"hoja-{h // 12:02d}.png"))
    print(f"{len(pngs)} fotogramas · hojas en {os.path.relpath(dest, ROOT)}")


if __name__ == "__main__":
    main()
