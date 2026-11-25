import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../kit/theme";
import { ChipMini, FondoMini, Grande, MiniSplit } from "../kit/miniatura";
import { Arreglo3D, Escena3D } from "../kit/tres";

// Miniaturas 1280×720, una por video. Máximo 3–4 palabras, distintas al título, un solo foco visual.
// Exportar: npx remotion still <id> out/miniaturas/<id>.png
// Misma plantilla en toda una serie: mismo chip (nombre de la serie) y mismo color de acento.

export const MiniPlantilla: React.FC = () => (
  <FondoMini accent={C.blue}>
    <MiniSplit
      texto={
        <>
          <ChipMini bg={C.blue} color={C.ink}>
            NUMPY 1D
          </ChipMini>
          <Grande size={150}>15×</Grande>
          <Grande size={120} color={C.yellow}>
            MÁS RÁPIDO
          </Grande>
        </>
      }
      visual={
        <div style={{ position: "relative", width: 520, height: 520 }}>
          <Escena3D width={520} height={520} orbita={0} dist={10} altura={5} anguloInicial={40}>
            <Arreglo3D forma={[3, 3, 3]} at={-200} lado={1} />
          </Escena3D>
        </div>
      }
    />
  </FondoMini>
);

// ---------- Numpy 1D ----------
// Identidad de la serie (igual en todos los episodios): fondo azul noche, cubos 3D azules desenfocados al fondo,
// chip "NUMPY 1D" arriba a la izquierda, texto Poppins 900 blanco + amarillo con contorno, un acento coral.
// Un solo foco: el dato sorprendente del gancho (lo que el video resuelve en sus primeros segundos).

const CONTORNO: React.CSSProperties = {
  WebkitTextStroke: `10px ${C.bg}`,
  paintOrder: "stroke fill",
  textShadow: `0 8px 0 ${C.bg}, 0 0 40px #000c`,
};

/** Fondo común de la serie Numpy 1D: cubos azules desenfocados + resplandor detrás del foco. */
const FondoNumpy1D: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    <AbsoluteFill style={{ filter: "blur(6px)", opacity: 0.4 }}>
      <Escena3D width={1280} height={720} orbita={0} dist={12} altura={4} anguloInicial={-32} objetivo={[0, 0, 0]}>
        <group position={[3.2, -1.6, 0]}>
          <Arreglo3D forma={[3, 3, 3]} at={-200} lado={1.3} hueco={0.12} valores={() => 0} />
        </group>
      </Escena3D>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 760px 420px at 40% 58%, ${C.blue}55, transparent 72%)` }} />
    {children}
    <div style={{ position: "absolute", top: 44, left: 56 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 44,
          color: C.ink,
          background: C.blue,
          borderRadius: 14,
          padding: "6px 24px",
          letterSpacing: 1,
        }}
      >
        NUMPY 1D
      </div>
    </div>
  </AbsoluteFill>
);

/** Una columna de la comparación: chip, cómo se ve el dato y su memoria en grande. */
const ColumnaMemoria: React.FC<{ chip: string; codigo: string; mb: string; color: string }> = ({ chip, codigo, mb, color }) => (
  <div style={{ width: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.bg, background: color, borderRadius: 14, padding: "4px 26px" }}>{chip}</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 86, color: C.ink, lineHeight: 1.1, whiteSpace: "pre", ...CONTORNO, WebkitTextStroke: `8px ${C.bg}` }}>{codigo}</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color, lineHeight: 1, whiteSpace: "nowrap", ...CONTORNO }}>{mb}</div>
  </div>
);

// Foco: la memoria de una lista vs un arreglo (lo que dice el título, sin repetirlo). Datos del video (01:24).
export const MiniN01: React.FC = () => (
  <FondoNumpy1D>
    <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.ink, letterSpacing: 2, ...CONTORNO, WebkitTextStroke: `6px ${C.bg}`, marginLeft: 260 }}>
        1 MILLÓN DE NÚMEROS
      </div>
    </div>
    <AbsoluteFill style={{ padding: "120px 40px 40px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <ColumnaMemoria chip="LISTA" codigo="[1, 2, 3]" mb="36 MB" color={C.coral} />
      <svg width={140} height={115} viewBox="0 0 170 140" style={{ filter: "drop-shadow(0 8px 0 #0008)" }}>
        <path d="M10 50 H100 V15 L160 70 L100 125 V90 H10 Z" fill={C.ink} stroke={C.bg} strokeWidth={8} strokeLinejoin="round" />
      </svg>
      <ColumnaMemoria chip="NUMPY" codigo="[1  2  3]" mb="8 MB" color={C.green} />
    </AbsoluteFill>
  </FondoNumpy1D>
);

/** Casilla grande de miniatura. */
const CasMini: React.FC<{ v: string; color?: string; fondo?: string }> = ({ v, color = C.ink, fondo = C.bg2 }) => (
  <div
    style={{
      width: 168,
      height: 150,
      borderRadius: 22,
      border: `6px solid ${C.bg}`,
      background: fondo,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: 84,
      color,
      boxShadow: "0 10px 0 #0008",
    }}
  >
    {v}
  </div>
);

// Foco: la trampa del título (índices y cortes): cambias un corte y el ORIGINAL cambia. Se ve en el gancho y se explica en «Modificar con cortes».
export const MiniN02: React.FC = () => (
  <FondoNumpy1D>
    <AbsoluteFill style={{ padding: "190px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>
      <div style={{ position: "relative", display: "flex", gap: 14 }}>
        <CasMini v="10" />
        <CasMini v="0" color={C.bg} fondo={C.coral} />
        <CasMini v="30" />
        <CasMini v="40" />
        <CasMini v="50" />
        <div style={{ position: "absolute", top: -26, left: 182 - 8, width: 182 * 3 - 14 + 16, height: 190, border: `10px solid ${C.yellow}`, borderRadius: 30 }} />
        <div style={{ position: "absolute", top: -112, left: 182 - 8, width: 182 * 3 - 14 + 16, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.yellow, ...CONTORNO, WebkitTextStroke: `8px ${C.bg}` }}>
          [1:4]
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 100, color: C.ink, ...CONTORNO }}>
        ¡CAMBIÓ EL <span style={{ color: C.coral }}>ORIGINAL</span>!
      </div>
    </AbsoluteFill>
  </FondoNumpy1D>
);

/** Columna de una comparación de tiempos: chip y cifra grande. */
const ColumnaTiempo: React.FC<{ chip: string; cifra: string; color: string }> = ({ chip, cifra, color }) => (
  <div style={{ width: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.bg, background: color, borderRadius: 16, padding: "6px 30px" }}>{chip}</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 136, color, lineHeight: 1, whiteSpace: "nowrap", ...CONTORNO }}>{cifra}</div>
  </div>
);

// Foco: el cambio que promete el título (vectorizar = adiós al for), medido en el gancho: for 74 ms → NumPy 1.5 ms.
export const MiniN03: React.FC = () => (
  <FondoNumpy1D>
    <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.yellow, letterSpacing: 2, ...CONTORNO, WebkitTextStroke: `7px ${C.bg}`, marginLeft: 260 }}>×1,000,000</div>
    </div>
    <AbsoluteFill style={{ padding: "120px 40px 40px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <ColumnaTiempo chip="CICLO FOR" cifra="74 ms" color={C.coral} />
      <svg width={140} height={115} viewBox="0 0 170 140" style={{ filter: "drop-shadow(0 8px 0 #0008)" }}>
        <path d="M10 50 H100 V15 L160 70 L100 125 V90 H10 Z" fill={C.ink} stroke={C.bg} strokeWidth={8} strokeLinejoin="round" />
      </svg>
      <ColumnaTiempo chip="NUMPY" cifra="1.5 ms" color={C.green} />
    </AbsoluteFill>
  </FondoNumpy1D>
);
