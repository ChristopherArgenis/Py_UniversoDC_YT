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
    <AbsoluteFill style={{ filter: "blur(5px)", opacity: 0.55 }}>
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

export const MiniN01: React.FC = () => (
  <FondoNumpy1D>
    <AbsoluteFill style={{ padding: "110px 0 0 70px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 168, lineHeight: 1.05, color: C.ink, ...CONTORNO }}>
        [1,2,3] × 2
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 168, lineHeight: 1.05, color: C.ink, ...CONTORNO }}>=</div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1,
            color: C.bg,
            background: C.yellow,
            borderRadius: 26,
            padding: "14px 30px 22px",
            boxShadow: `0 0 70px ${C.yellow}66, 0 12px 0 #0008`,
            rotate: "-2deg",
          }}
        >
          [1,2,3,1,2,3]
        </div>
      </div>
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: 170,
        right: 80,
        width: 190,
        height: 190,
        borderRadius: 95,
        background: C.coral,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 120,
        color: C.ink,
        rotate: "10deg",
        boxShadow: "0 12px 0 #0008",
        ...{ WebkitTextStroke: `6px ${C.bg}`, paintOrder: "stroke fill" },
      }}
    >
      ¿?
    </div>
  </FondoNumpy1D>
);
