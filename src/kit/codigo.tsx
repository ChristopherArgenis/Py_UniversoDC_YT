import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Sfx } from "./kit";
import { Aparece, Chip } from "./piezas";
import { C, FONT, MONO } from "./theme";

// Código en pantalla para los cursos de Python.
// Aquí el código SÍ es protagonista: bloques de hasta ~12 líneas que se escriben línea por línea,
// con resaltado de sintaxis y la salida real debajo (la misma que da el notebook).

const KW = new Set([
  "import", "from", "as", "def", "return", "for", "in", "if", "elif", "else", "while", "and", "or", "not",
  "None", "True", "False", "lambda", "with", "class", "print", "is", "try", "except", "pass", "break", "continue",
]);

/** Colores de sintaxis (mismos tonos que el resto del canal). */
const SINTAXIS = {
  kw: C.purple,
  str: C.green,
  num: C.yellow,
  com: C.dim,
  fun: C.blue,
  op: C.coral,
  txt: C.ink,
};

type Token = { t: string; c: string };

/** Resaltado sencillo de una línea de Python (suficiente para código de clase). */
export const tokens = (linea: string): Token[] => {
  const out: Token[] = [];
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?(?:e-?\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)|(\s+)|([^\w\s])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(linea))) {
    if (m[1]) out.push({ t: m[1], c: SINTAXIS.com });
    else if (m[2]) out.push({ t: m[2], c: SINTAXIS.str });
    else if (m[3]) out.push({ t: m[3], c: SINTAXIS.num });
    else if (m[4]) out.push({ t: m[4], c: KW.has(m[4]) ? SINTAXIS.kw : SINTAXIS.fun });
    else if (m[5]) out.push({ t: m[5], c: KW.has(m[5]) ? SINTAXIS.kw : SINTAXIS.txt });
    else if (m[6]) out.push({ t: m[6], c: SINTAXIS.txt });
    else if (m[7]) out.push({ t: m[7], c: "[]().,:".includes(m[7]) ? SINTAXIS.txt : SINTAXIS.op });
  }
  return out;
};

const LineaPy: React.FC<{ texto: string; visibles?: number }> = ({ texto, visibles = Infinity }) => {
  let resta = visibles;
  return (
    <>
      {tokens(texto).map((k, i) => {
        if (resta <= 0) return null;
        const s = k.t.slice(0, resta);
        resta -= k.t.length;
        return (
          <span key={i} style={{ color: k.c }}>
            {s}
          </span>
        );
      })}
    </>
  );
};

export type LineaCodigo = {
  /** Frame (relativo a la escena) en que empieza a escribirse la línea. */
  at: number;
  /** Texto de la línea. Una línea vacía deja un espacio. */
  py: string;
};

/**
 * Celda de código estilo notebook. Cada línea se escribe en su frame `at` (sincronízalo con la frase de Alex).
 * `resaltar` marca líneas (índices) con una barra amarilla a partir de `resaltarDesde`.
 * `salida` aparece debajo en `atSalida`, como la salida de la celda.
 */
export const Celda: React.FC<{
  lineas: LineaCodigo[];
  salida?: string[];
  atSalida?: number;
  resaltar?: number[];
  resaltarDesde?: number;
  /** Frames que tarda en escribirse cada línea. */
  vel?: number;
  ancho?: number;
  size?: number;
  titulo?: string;
  n?: number;
}> = ({ lineas, salida, atSalida = 1e9, resaltar = [], resaltarDesde = 1e9, vel = 18, ancho = 1100, size = 34, titulo = "notebook.ipynb", n = 1 }) => {
  const frame = useCurrentFrame();
  const alto = size * 1.55;
  const primera = lineas[0]?.at ?? 0;
  const ejecutada = frame >= atSalida;
  return (
    <Aparece at={Math.max(0, primera - 10)}>
      <div
        style={{
          width: ancho,
          background: "#0f1530",
          border: `3px solid ${C.dim}33`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 30px 80px #0008",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", background: `${C.bg2}`, borderBottom: `2px solid ${C.dim}22` }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>{titulo}</span>
        </div>
        <div style={{ display: "flex", padding: "22px 26px 22px 10px" }}>
          <div style={{ fontFamily: MONO, fontSize: size * 0.7, color: ejecutada ? C.green : C.dim, width: 110, textAlign: "right", paddingRight: 18, paddingTop: 4 }}>
            [{ejecutada ? n : " "}]:
          </div>
          <div style={{ flex: 1 }}>
            {lineas.map((l, i) => {
              const total = l.py.length;
              const vis = Math.floor(interpolate(frame, [l.at, l.at + Math.max(6, Math.min(vel, total * 1.2))], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
              const escribiendo = frame >= l.at && vis < total;
              const on = resaltar.includes(i) && frame >= resaltarDesde;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: MONO,
                    fontSize: size,
                    height: alto,
                    lineHeight: `${alto}px`,
                    whiteSpace: "pre",
                    fontVariantLigatures: "none",
                    background: on ? `${C.yellow}26` : "transparent",
                    borderLeft: `6px solid ${on ? C.yellow : "transparent"}`,
                    paddingLeft: 12,
                  }}
                >
                  {frame >= l.at && <LineaPy texto={l.py} visibles={vis} />}
                  {escribiendo && <span style={{ color: C.green }}>▍</span>}
                </div>
              );
            })}
          </div>
        </div>
        {salida && ejecutada && (
          <div style={{ borderTop: `2px solid ${C.dim}22`, padding: "16px 26px 22px 138px", background: "#0b1026" }}>
            {salida.map((s, i) => (
              <Aparece key={i} at={atSalida + i * 4}>
                <div style={{ fontFamily: MONO, fontSize: size * 0.9, color: C.ink, whiteSpace: "pre", fontVariantLigatures: "none" }}>{s}</div>
              </Aparece>
            ))}
          </div>
        )}
      </div>
      {salida && atSalida < 1e8 && <Sfx src="tick.wav" at={atSalida} volume={0.3} />}
    </Aparece>
  );
};

/** Una sola línea estilo consola (`>>>`) que se escribe letra por letra. */
export const Consola: React.FC<{ at: number; texto: string; dur?: number; prompt?: string; size?: number }> = ({
  at,
  texto,
  dur = 30,
  prompt = ">>> ",
  size = 32,
}) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [at, at + dur], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (frame < at) return <div style={{ height: size * 1.55 }} />;
  return (
    <div style={{ fontFamily: MONO, fontSize: size, height: size * 1.55, whiteSpace: "pre", fontVariantLigatures: "none" }}>
      <span style={{ color: C.dim }}>{prompt}</span>
      <LineaPy texto={texto} visibles={n} />
      {n < texto.length && <span style={{ color: C.green }}>▍</span>}
    </div>
  );
};

/**
 * Aviso del notebook: "Practica en Colab · link en la descripción".
 * Se usa al terminar el bloque de código y en el cierre. `ruta` = carpeta de la serie y archivo.
 */
export const AvisoNotebook: React.FC<{ at: number; ruta: string; abajo?: boolean }> = ({ at, ruta, abajo = true }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: abajo ? 190 : undefined, top: abajo ? undefined : 150, display: "flex", justifyContent: "center" }}>
    <Aparece at={at}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          background: `${C.bg2}f0`,
          border: `3px solid ${C.yellow}`,
          borderRadius: 22,
          padding: "16px 30px",
          boxShadow: `0 0 40px ${C.yellow}33`,
        }}
      >
        <Chip bg={C.yellow} size={26}>
          NOTEBOOK
        </Chip>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>Pruébalo tú en Google Colab · link en la descripción</span>
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>{ruta}</span>
        </div>
      </div>
      <Sfx src="pop.wav" at={at} volume={0.35} />
    </Aparece>
  </div>
);
