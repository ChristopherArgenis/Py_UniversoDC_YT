"""Guion legible (Markdown) para revisarlo y aprobarlo, generado desde el JSON.

    python3 scripts/ver_guion.py n01-listas-arreglos     # escribe out/guiones/<video>.md

Muestra por escena: capítulo, tiempo estimado (o real si ya hay voz), qué se ve, código y lo que dice Alex
(con el subtítulo cuando es distinto). El JSON sigue siendo la única fuente del texto.
"""
import os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capitulos import cargar, planificar  # noqa: E402


def mmss(s):
    s = int(round(s))
    return f"{s // 60:02d}:{s % 60:02d}"


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    vid = sys.argv[1]
    g, t, d = cargar(vid)
    escenas, total, fps, faltan = planificar(g, t, d)
    out = [f"# Guion: {g['titulo']}", ""]
    out.append(f"- Serie: {g.get('serie', '-')} · Plantilla {g.get('plantilla', '-')} · Voz: {g.get('voz', 'alex_nicola')}")
    out.append(f"- Notebook: `{g.get('notebook', '-')}`")
    out.append(f"- Duración {'estimada' if faltan else 'con voz real'}: **{mmss(total / fps)}** · Aprobado: {'sí' if g.get('aprobado') else '**no**'}")
    out.append("")
    for e, ini in escenas:
        out.append(f"## {mmss(ini / fps)} · {e.get('capitulo') or e['id']}  (`{e['id']}`)")
        if e.get("pantalla"):
            out.append(f"**En pantalla:** {e['pantalla']}")
            out.append("")
        if e.get("codigo"):
            out.append("```python")
            out += ["" if l == "---" else l for l in e["codigo"]]
            out.append("```")
        for k, v in e["voz"].items():
            sub = e.get("sub", {}).get(k)
            out.append(f"- **{k}** — {v}" + (f"  \n  _Subtítulo:_ {sub}" if sub and sub != v else ""))
        out.append("")
    dest = os.path.join(ROOT, "out", "guiones", vid + ".md")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w", encoding="utf-8").write("\n".join(out))
    print(os.path.relpath(dest, ROOT))


if __name__ == "__main__":
    main()
