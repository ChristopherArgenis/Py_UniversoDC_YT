import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sfx, Stage } from "./kit";
import { Aparece, Chip, useP } from "./piezas";
import { Consola } from "./codigo";
import { C, FONT, MONO } from "./theme";

// Piezas de escena compartidas por los videos de los cursos (salieron del video 1 de Numpy 1D).
// Fase: mostrar algo solo en un tramo de la escena · Fijo/Mono: código y texto monoespaciado ·
// Barra: barra comparativa medida · AvisoGrande: aviso centrado del notebook · Casilla: celda de un arreglo ·
// Tarjeta/Res: tarjetas de "3 ejemplos reales".

/** Muestra su contenido solo entre los frames [desde, hasta) de la escena, con un fundido corto de entrada. */
export const Fase: React.FC<{ desde: number; hasta?: number; children: React.ReactNode }> = ({ desde, hasta = 1e9, children }) => {
  const frame = useCurrentFrame();
  if (frame < desde || frame >= hasta) return null;
  return <AbsoluteFill style={{ opacity: interpolate(frame, [desde, desde + 8], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

/** Texto de código fijo (ya escrito), con el resaltado del kit. */
export const Fijo: React.FC<{ texto: string; size?: number; prompt?: string }> = ({ texto, size = 40, prompt = "" }) => (
  <Consola at={-1000} texto={texto} size={size} prompt={prompt} />
);

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  color = C.ink,
  style,
}) => <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color, whiteSpace: "pre", fontVariantLigatures: "none", ...style }}>{children}</div>;

export const Barra: React.FC<{ label: string; valor: number; max: number; unidad: string; color: string; at: number; dec?: number; ancho?: number }> = ({
  label,
  valor,
  max,
  unidad,
  color,
  at,
  dec = 2,
  ancho = 1200,
}) => {
  const p = useP(at, at + 25 + 50 * (valor / max));
  return (
    <div style={{ width: ancho, fontFamily: FONT, color: C.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 40 }}>
        <span>{label}</span>
        <span style={{ fontFamily: MONO, color }}>
          {(valor * p).toFixed(dec)} {unidad}
        </span>
      </div>
      <div style={{ height: 40, borderRadius: 20, background: C.bg2, marginTop: 6, overflow: "hidden" }}>
        <div style={{ width: `${(valor / max) * 100 * p}%`, height: "100%", background: color, borderRadius: 20 }} />
      </div>
    </div>
  );
};

/** Aviso grande y centrado del notebook (la escena de fondo se atenúa: nada queda encimado). */
export const AvisoGrande: React.FC<{ at: number; ruta: string }> = ({ at, ruta }) => (
  <Stage>
    <Aparece at={at}>
      <div
        style={{
          background: `${C.bg2}f5`,
          border: `4px solid ${C.yellow}`,
          borderRadius: 32,
          padding: "40px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          boxShadow: `0 0 80px ${C.yellow}33`,
        }}
      >
        <Chip bg={C.yellow} size={30}>
          NOTEBOOK DE PRÁCTICA
        </Chip>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.ink }}>Pruébalo tú en Google Colab</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.yellow }}>Link en la descripción ↓</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{ruta}</div>
      </div>
      <Sfx src="pop.wav" at={at} volume={0.35} />
    </Aparece>
  </Stage>
);

/** Casilla de un arreglo. `on` la resalta (amarillo por defecto, o el color `resalte`); `apagada` la atenúa. */
export const Casilla: React.FC<{ v: string; on: boolean; ancho?: number; alto?: number; size?: number; resalte?: string; texto?: string; apagada?: boolean }> = ({
  v,
  on,
  ancho = 120,
  alto = 110,
  size = 44,
  resalte = C.yellow,
  texto = C.ink,
  apagada = false,
}) => (
  <div
    style={{
      width: ancho,
      height: alto,
      borderRadius: 14,
      border: `4px solid ${on ? resalte : C.green}`,
      background: on ? `${resalte}33` : `${C.green}1a`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      color: texto,
      opacity: apagada ? 0.35 : 1,
      flexShrink: 0,
    }}
  >
    {v}
  </div>
);

export const Tarjeta: React.FC<{ at: number; n: number; tipo: string; color: string; titulo: string; dato: string; children: React.ReactNode }> = ({
  at,
  n,
  tipo,
  color,
  titulo,
  dato,
  children,
}) => (
  <Aparece at={at}>
    <div
      style={{
        width: 500,
        height: 560,
        background: `${C.bg2}cc`,
        border: `3px solid ${color}88`,
        borderRadius: 28,
        padding: "30px 30px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div>
        <Chip bg={color} size={24}>{`EJEMPLO ${n} · ${tipo}`}</Chip>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink, lineHeight: 1.1 }}>{titulo}</div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.dim }}>{dato}</div>
      <div style={{ background: "#0f1530", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  </Aparece>
);

export const Res: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.green }) => (
  <Mono size={24} color={color}>
    {children}
  </Mono>
);

/** Fila de casillas con índices arriba (amarillo) y, opcional, negativos abajo (morado). */
export const FilaIdx: React.FC<{
  vals: string[];
  on?: (i: number) => boolean;
  resalte?: (i: number) => string;
  apagada?: (i: number) => boolean;
  ancho?: number;
  size?: number;
  idx?: boolean;
  neg?: boolean;
  negAt?: number;
}> = ({ vals, on = () => false, resalte = () => C.yellow, apagada = () => false, ancho = 100, size = 38, idx = true, neg = false, negAt = 0 }) => {
  const gap = 8;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {idx && (
        <div style={{ display: "flex", gap }}>
          {vals.map((_, i) => (
            <Mono key={i} size={26} color={C.yellow} style={{ width: ancho, textAlign: "center" }}>
              {i}
            </Mono>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap }}>
        {vals.map((v, i) => (
          <Casilla key={i} v={v} on={on(i)} resalte={resalte(i)} ancho={ancho} alto={ancho * 0.9} size={size} apagada={apagada(i)} />
        ))}
      </div>
      {neg && (
        <Aparece at={negAt}>
          <div style={{ display: "flex", gap }}>
            {vals.map((_, i) => (
              <Mono key={i} size={24} color={C.purple} style={{ width: ancho, textAlign: "center" }}>
                {i - vals.length}
              </Mono>
            ))}
          </div>
        </Aparece>
      )}
    </div>
  );
};

/** Valor que depende del tramo: devuelve el último `v` cuyo `desde` ya pasó. */
export const tramo = <T,>(frame: number, tramos: { desde: number; v: T }[], inicial: T): T => {
  let r = inicial;
  for (const t of tramos) if (frame >= t.desde) r = t.v;
  return r;
};
