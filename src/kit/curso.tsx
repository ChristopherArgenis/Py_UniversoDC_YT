import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stage, Sticker, Words } from "./kit";
import { Cierre, type EscenaProps } from "./largo";
import { Aparece, Chip } from "./piezas";
import { C, FONT, MONO } from "./theme";

// Piezas de curso (adaptadas del curso de Cálculo de videos-yt-ciencia-datos):
// fórmulas (KaTeX), sello de la serie, objetivo, plano, "Plus: Ciencia de Datos", error común,
// reto + resumen y cierre con el próximo episodio.

// Fuentes de KaTeX desde public/ (MIT), para que el render no dependa de internet.
for (const f of ["Main-Regular", "Main-Bold", "Math-Italic", "Size1-Regular", "Size2-Regular", "AMS-Regular"]) {
  const [fam, estilo] = f.split("-");
  loadFont({
    family: `KaTeX_${fam}`,
    url: staticFile(`fonts/katex/KaTeX_${f}.woff2`),
    weight: estilo === "Bold" ? "700" : "400",
    style: estilo === "Italic" ? "italic" : "normal",
  });
}

/**
 * Código de colores fijo en todos los cursos de Python:
 * dato / entrada = azul · resultado / salida = verde · índice o eje = amarillo ·
 * función o método = coral · error / cuidado = morado.
 */
export const COL = {
  entrada: C.blue,
  salida: C.green,
  indice: C.yellow,
  funcion: C.coral,
  error: C.purple,
};

// En macros de KaTeX "##" es un "#" literal: por eso el color va como #${...} (queda ##5b8cff).
// Macros: \ent{x} entrada, \sal{y} salida, \idx{i} índice, \fun{f} función, \err{e} error.
const MACROS = {
  "\\ent": `\\textcolor{#${COL.entrada}}{#1}`,
  "\\sal": `\\textcolor{#${COL.salida}}{#1}`,
  "\\idx": `\\textcolor{#${COL.indice}}{#1}`,
  "\\fun": `\\textcolor{#${COL.funcion}}{#1}`,
  "\\err": `\\textcolor{#${COL.error}}{#1}`,
};

/** Fórmula con KaTeX. `size` en px. */
export const Formula: React.FC<{ tex: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  tex,
  size = 72,
  color = C.ink,
  style,
}) => (
  <span
    style={{ fontSize: size, color, lineHeight: 1.2, whiteSpace: "nowrap", ...style }}
    dangerouslySetInnerHTML={{ __html: katex.renderToString(`\\displaystyle ${tex}`, { throwOnError: true, macros: { ...MACROS } }) }}
  />
);

/**
 * Sello de la serie con el mapa de sus temas; se ilumina el `n` (1 = primero).
 * Los temas de cada serie viven en src/series/<serie>.ts.
 */
export const SelloSerie: React.FC<{ nombre: string; temas: string[]; n: number; color?: string; lema?: string }> = ({
  nombre,
  temas,
  n,
  color = C.blue,
  lema,
}) => {
  const cols = Math.min(6, temas.length);
  return (
    <Stage gap={46}>
      <Words text={nombre} size={110} accent={color} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${temas.length <= 4 ? "auto" : "220px"})`, gap: 16 }}>
        {temas.map((t, i) => (
          <Aparece key={t} at={10 + i * 3}>
            <div
              style={{
                height: 96,
                minWidth: 220,
                padding: "0 36px",
                whiteSpace: "nowrap",
                borderRadius: 16,
                background: i === n - 1 ? color : `${C.bg2}dd`,
                border: `3px solid ${i === n - 1 ? color : C.dim + "44"}`,
                color: i === n - 1 ? C.bg : C.ink,
                fontFamily: FONT,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                scale: i === n - 1 ? "1.1" : "1",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 22, opacity: 0.8 }}>{i + 1}</span>
              <span style={{ fontWeight: 800, fontSize: 26 }}>{t}</span>
            </div>
          </Aparece>
        ))}
      </div>
      {lema && <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{lema}</div>}
    </Stage>
  );
};

/** Tarjeta "Al final de este video vas a poder…" con casillas que se marcan. */
export const Objetivo: React.FC<{ metas: { at: number; t: string }[]; at: number }> = ({ metas, at }) => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Aparece at={at}>
        <Chip bg={C.blue} color={C.ink} size={30}>
          OBJETIVO
        </Chip>
      </Aparece>
      <Words text="Al final de este video *vas a poder*:" size={68} accent={C.blue} delay={at} />
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {metas.map((m, i) => {
          const on = frame >= m.at + 20;
          return (
            <Aparece key={i} at={m.at}>
              <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.ink }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    border: `4px solid ${on ? C.green : C.dim}`,
                    background: on ? C.green : "transparent",
                    color: C.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                  }}
                >
                  {on ? "✓" : ""}
                </div>
                {i + 1}. {m.t}
              </div>
            </Aparece>
          );
        })}
      </div>
    </Stage>
  );
};

/** Plano cartesiano en coordenadas matemáticas. Los hijos reciben `X` y `Y` para convertir. */
export type Ejes = { X: (x: number) => number; Y: (y: number) => number };
export const Plano: React.FC<{
  w: number;
  h: number;
  x: [number, number];
  y: [number, number];
  paso?: number;
  pasoY?: number;
  etiquetaX?: string;
  etiquetaY?: string;
  children?: (e: Ejes) => React.ReactNode;
}> = ({ w, h, x, y, paso = 1, pasoY, etiquetaX = "x", etiquetaY = "y", children }) => {
  const X = (v: number) => ((v - x[0]) / (x[1] - x[0])) * w;
  const Y = (v: number) => h - ((v - y[0]) / (y[1] - y[0])) * h;
  const marcas = (a: number, b: number, pp = paso) => {
    const r: number[] = [];
    for (let v = Math.ceil(a / pp) * pp; v <= b + 1e-9; v += pp) r.push(Math.round(v * 1000) / 1000);
    return r;
  };
  const py = pasoY ?? paso;
  const y0 = Y(Math.max(y[0], Math.min(0, y[1])));
  const x0 = X(Math.max(x[0], Math.min(0, x[1])));
  return (
    <svg width={w + 120} height={h + 90} viewBox={`-70 -40 ${w + 120} ${h + 90}`} style={{ overflow: "visible" }}>
      {marcas(x[0], x[1]).map((v) => (
        <line key={`gx${v}`} x1={X(v)} y1={0} x2={X(v)} y2={h} stroke={`${C.dim}1f`} strokeWidth={2} />
      ))}
      {marcas(y[0], y[1], py).map((v) => (
        <line key={`gy${v}`} x1={0} y1={Y(v)} x2={w} y2={Y(v)} stroke={`${C.dim}1f`} strokeWidth={2} />
      ))}
      <line x1={0} y1={y0} x2={w} y2={y0} stroke={COL.entrada} strokeWidth={4} />
      <line x1={x0} y1={0} x2={x0} y2={h} stroke={COL.salida} strokeWidth={4} />
      {marcas(x[0], x[1])
        .filter((v) => v !== 0)
        .map((v) => (
          <text key={`tx${v}`} x={X(v)} y={y0 + 34} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.dim}>
            {v}
          </text>
        ))}
      {marcas(y[0], y[1], py)
        .filter((v) => v !== 0)
        .map((v) => (
          <text key={`ty${v}`} x={x0 - 14} y={Y(v) + 8} textAnchor="end" fontFamily={MONO} fontSize={24} fill={C.dim}>
            {v}
          </text>
        ))}
      <text x={w + 16} y={y0 + 8} fontFamily={FONT} fontWeight={800} fontSize={34} fill={COL.entrada}>
        {etiquetaX}
      </text>
      <text x={x0 + 12} y={-12} fontFamily={FONT} fontWeight={800} fontSize={34} fill={COL.salida}>
        {etiquetaY}
      </text>
      {children?.({ X, Y })}
    </svg>
  );
};

/** Curva de una función en el plano; `p` (0–1) la dibuja de izquierda a derecha. */
export const Curva: React.FC<{
  e: Ejes;
  f: (x: number) => number;
  x: [number, number];
  p?: number;
  color?: string;
  ancho?: number;
  n?: number;
}> = ({ e, f, x, p = 1, color = COL.indice, ancho = 6, n = 200 }) => {
  const hasta = x[0] + (x[1] - x[0]) * p;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const v = x[0] + ((hasta - x[0]) * i) / n;
    const fv = f(v);
    if (Number.isFinite(fv)) pts.push(`${e.X(v)},${e.Y(fv)}`);
  }
  return p > 0 ? <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={ancho} strokeLinejoin="round" strokeLinecap="round" /> : null;
};

/** Chip fijo arriba a la derecha que marca la parte del video (ej. "EJEMPLO 2 · INDUSTRIA"). */
export const Seccion: React.FC<{ children: React.ReactNode; bg?: string; color?: string }> = ({ children, bg = C.purple, color = C.bg }) => (
  <div style={{ position: "absolute", top: 150, right: 140 }}>
    <Chip bg={bg} color={color} size={28}>
      {children}
    </Chip>
  </div>
);

/** Chip fijo de la parte "Plus: Ciencia de Datos". */
export const PlusDatos: React.FC = () => <Seccion>PLUS · CIENCIA DE DATOS</Seccion>;

/** Tarjeta de error común. */
export const Cuidado: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Aparece at={at}>
    <div
      style={{
        background: `${C.coral}22`,
        border: `4px solid ${C.coral}`,
        borderRadius: 24,
        padding: "22px 34px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {children}
    </div>
  </Aparece>
);

/** Reto para comentarios (o para el notebook) + resumen en tarjetas. */
export const RetoResumen: React.FC<{
  reto: React.ReactNode;
  ideas: string[];
  atReto: number;
  atResumen: number;
  durResumen: number;
  pista?: string;
}> = ({ reto, ideas, atReto, atResumen, durResumen, pista = "Resuélvelo en el notebook de Colab · link en la descripción" }) => {
  const frame = useCurrentFrame();
  if (frame < atResumen) {
    return (
      <Stage gap={34}>
        <Aparece at={atReto}>
          <Chip bg={C.yellow} size={34}>
            RETO
          </Chip>
        </Aparece>
        <Aparece at={atReto + 10}>{reto}</Aparece>
        <Sequence from={atReto + 60} layout="none">
          <Sticker bg={C.blue} color={C.ink} size={32}>
            {pista}
          </Sticker>
        </Sequence>
      </Stage>
    );
  }
  const paso = durResumen / ideas.length;
  return (
    <Stage gap={26}>
      <Words text="En *resumen*" size={76} accent={C.green} />
      <div style={{ display: "flex", gap: 26 }}>
        {ideas.map((t, i) => (
          <Aparece key={i} at={atResumen + i * paso}>
            <div
              style={{
                width: 470,
                minHeight: 260,
                background: `${C.bg2}dd`,
                border: `3px solid ${C.green}66`,
                borderRadius: 24,
                padding: "26px 28px",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 36,
                color: C.ink,
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 30, color: C.green, marginBottom: 10 }}>{i + 1}</div>
              {t}
            </div>
          </Aparece>
        ))}
      </div>
    </Stage>
  );
};

/**
 * Cierre del episodio: próximo tema mientras Alex habla de él (frase 1); luego el cierre del canal (frase 2).
 * Sin "#N": los títulos de estos cursos no llevan número.
 */
export const CierreCurso: React.FC<EscenaProps & { titulo: string; sub: string; color?: string }> = ({
  titulo,
  sub,
  color = C.blue,
  ...props
}) => {
  const [, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={color} color={C.ink}>
              PRÓXIMO VIDEO
            </Chip>
          </Aparece>
          <Words text={titulo} size={110} align="left" accent={color} delay={6} />
          <Words text={sub} size={52} weight={700} color={C.dim} align="left" delay={20} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};

/** Nota abajo a la izquierda ("Ejemplo simplificado"). */
export const Nota: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 64, bottom: 172, fontFamily: MONO, fontSize: 22, color: C.dim }}>{children}</div>
);

/** Tarjeta "Recuerda" + respuesta del reto del video anterior. */
export const Recuerda: React.FC<{ at: number; idea: React.ReactNode; atReto?: number; reto?: React.ReactNode }> = ({ at, idea, atReto, reto }) => (
  <Stage gap={34}>
    <Aparece at={at}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Chip bg={C.blue} color={C.ink} size={30}>
          RECUERDA
        </Chip>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.ink, textAlign: "center" }}>{idea}</div>
      </div>
    </Aparece>
    {reto !== undefined && atReto !== undefined && (
      <Aparece at={atReto}>
        <div
          style={{
            background: `${C.bg2}dd`,
            border: `3px solid ${C.yellow}88`,
            borderRadius: 28,
            padding: "26px 44px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Chip bg={C.yellow} size={28}>
            RESPUESTA DEL RETO
          </Chip>
          {reto}
        </div>
      </Aparece>
    )}
  </Stage>
);
