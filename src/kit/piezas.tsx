import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useIn } from "./kit";
import { C, MONO } from "./theme";

// Piezas pequeñas compartidas por todas las series (vienen de videos-yt-ciencia-datos).

/** 0 → 1 entre los frames a y b. */
export const useP = (a: number, b: number, ease = true) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.out(Easing.cubic) : undefined,
  });
};

export const fmt = (n: number, dec = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Número que cuenta con separador de miles. */
export const Num: React.FC<{ to: number; start: number; dur?: number; dec?: number; style?: React.CSSProperties }> = ({
  to,
  start,
  dur = 30,
  dec = 0,
  style,
}) => {
  const p = useP(start, start + dur);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(to * p, dec)}</span>;
};

/** Aparece (opacidad + subida) en el frame `at`. */
export const Aparece: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const p = useIn(at);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number }> = ({
  children,
  color = C.bg,
  bg = C.green,
  size = 28,
}) => (
  <span
    style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      background: bg,
      color,
      borderRadius: 12,
      padding: "6px 16px",
      display: "inline-block",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

/** Frame en que termina una frase de Alex. */
export const fin = (l: { at: number; frames: number }) => l.at + l.frames;

/** Fila clave → valor (tablas pequeñas, propiedades de un objeto). */
export const Fila: React.FC<{ at: number; k: string; v: string; color?: string }> = ({ at, k, v, color = C.ink }) => (
  <Aparece at={at}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 30,
        fontFamily: MONO,
        fontSize: 30,
        padding: "6px 0",
        borderBottom: `1px solid ${C.dim}22`,
      }}
    >
      <span style={{ color: C.dim }}>{k}</span>
      <span style={{ color, fontWeight: 700 }}>{v}</span>
    </div>
  </Aparece>
);
