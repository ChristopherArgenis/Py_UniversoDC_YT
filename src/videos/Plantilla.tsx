import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Words } from "../kit/kit";
import { leerGuion, TituloCapitulo, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, useP } from "../kit/piezas";
import { CierreCurso, Nota, PlusDatos, RetoResumen, Seccion, SelloSerie } from "../kit/curso";
import { AvisoNotebook, Celda, Consola } from "../kit/codigo";
import { Arreglo3D, Escena3D } from "../kit/tres";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/plantilla.json";

// Video de prueba del motor siguiendo la Plantilla A:
// Gancho → Sello → Teoría → Concepto → Código (+ aviso del notebook) → 3 ejemplos → Plus: Ciencia de Datos → Reto/resumen → Cierre.
// Cada escena recibe `lineas` (frase de Alex con su frame de inicio `at` y duración `frames`).

const TEMAS = ["Arreglos", "Índices", "Operaciones", "Estadística", "Booleanos", "Proyecto"];

const Barra: React.FC<{ label: string; seg: number; max: number; color: string; at: number }> = ({ label, seg, max, color, at }) => {
  const p = useP(at, at + 20 + 70 * (seg / max), false);
  return (
    <div style={{ width: 1300, fontFamily: FONT, color: C.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 44 }}>
        <span>{label}</span>
        <span style={{ fontFamily: MONO, color }}>{(seg * p).toFixed(2)} ms</span>
      </div>
      <div style={{ height: 46, borderRadius: 23, background: C.bg2, marginTop: 8, overflow: "hidden" }}>
        <div style={{ width: `${(seg / max) * 100 * p}%`, height: "100%", background: color, borderRadius: 23 }} />
      </div>
    </div>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [, g2] = lineas;
  // Cuadro 0 lleno: el dato y las barras ya están en pantalla.
  return (
    <Stage gap={50}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.ink, lineHeight: 1 }}>
        <span style={{ color: C.yellow }}>1,000,000</span> de números
      </div>
      <Barra label="Lista de Python" seg={4.55} max={4.55} color={C.coral} at={-120} />
      <Barra label="NumPy" seg={0.28} max={4.55} color={C.green} at={-120} />
      <Sequence from={g2.at} layout="none">
        <Words text="¿Por *qué?*" size={110} />
      </Sequence>
      <Nota>Medido con timeit (1,000,000 de enteros) · varía según la computadora</Nota>
      <Sfx src="boom.wav" at={g2.at} volume={0.35} />
    </Stage>
  );
};

const Sello: React.FC<EscenaProps> = () => <SelloSerie nombre="NUMPY *1D*" temas={TEMAS} n={1} lema="curso de Python desde cero" />;

const Caja: React.FC<{ at: number; children: React.ReactNode; color: string }> = ({ at, children, color }) => (
  <Aparece at={at}>
    <div
      style={{
        width: 110,
        height: 110,
        borderRadius: 16,
        border: `4px solid ${color}`,
        background: `${color}22`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 40,
        color: C.ink,
      }}
    >
      {children}
    </div>
  </Aparece>
);

const Teoria: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2] = lineas;
  return (
    <>
      <Sequence durationInFrames={t1.at} layout="none">
        <TituloCapitulo n={1} nombre={guion.escenas[2].capitulo ?? ""} />
      </Sequence>
      <Sequence from={t1.at} layout="none">
        <Split
          left={
            <Stage gap={30}>
              <Chip bg={C.coral}>LISTA</Chip>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap", width: 600, justifyContent: "center" }}>
                {[3, 8, 1, 9].map((v, i) => (
                  <div key={i} style={{ translate: `0px ${[0, 60, -30, 40][i]}px` }}>
                    <Caja at={10 + i * 6} color={C.coral}>
                      {v}
                    </Caja>
                  </div>
                ))}
              </div>
            </Stage>
          }
          right={
            <Sequence from={t2.at - t1.at} layout="none">
              <Stage gap={30}>
                <Chip bg={C.green}>ARREGLO NUMPY</Chip>
                <div style={{ display: "flex", gap: 0 }}>
                  {[3, 8, 1, 9].map((v, i) => (
                    <Caja key={i} at={6 + i * 4} color={C.green}>
                      {v}
                    </Caja>
                  ))}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim }}>dtype: int64 · un solo bloque</div>
              </Stage>
            </Sequence>
          }
        />
      </Sequence>
    </>
  );
};

const Concepto: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [k1, k2] = lineas;
  const mitad = k2.at + Math.round(k2.frames * 0.45);
  const forma = frame < k2.at ? [6] : frame < mitad ? [3, 6] : [3, 3, 6];
  const etiqueta = frame < k2.at ? "1D · forma (6,)" : frame < mitad ? "2D · forma (3, 6)" : "3D · forma (3, 3, 6)";
  return (
    <>
      <Sequence durationInFrames={k1.at} layout="none">
        <TituloCapitulo n={2} nombre={guion.escenas[3].capitulo ?? ""} />
      </Sequence>
      <Sequence from={k1.at} layout="none">
        <AbsoluteFill>
          <Escena3D orbita={10} dist={11} altura={4.5}>
            <Arreglo3D key={forma.join("x")} forma={forma} at={0} ritmo={1.2} />
          </Escena3D>
          <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Chip bg={C.blue} color={C.ink} size={40}>
              {etiqueta}
            </Chip>
          </div>
        </AbsoluteFill>
      </Sequence>
    </>
  );
};

const Codigo: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3] = lineas;
  return (
    <>
      <Sequence durationInFrames={c1.at} layout="none">
        <TituloCapitulo n={3} nombre={guion.escenas[4].capitulo ?? ""} />
      </Sequence>
      <Sequence from={c1.at} layout="none">
        <Stage>
          <Celda
            lineas={[
              { at: 20, py: "import numpy as np" },
              { at: 50, py: "" },
              { at: 60, py: "precios = np.array([10, 25, 7, 40])" },
              { at: c2.at - c1.at, py: "dobles = precios * 2   # sin ciclo for" },
              { at: c2.at - c1.at + 30, py: "print(dobles)" },
            ]}
            salida={["[20 50 14 80]"]}
            atSalida={c2.at - c1.at + 60}
            resaltar={[3]}
            resaltarDesde={c2.at - c1.at + 20}
            ancho={1400}
            size={42}
          />
        </Stage>
      </Sequence>
      <AvisoNotebook at={c3.at} ruta={guion.notebook} />
    </>
  );
};

const Ejemplo: React.FC<{ at: number; n: number; tipo: string; color: string; titulo: string; dato: string; codigo: string }> = ({
  at,
  n,
  tipo,
  color,
  titulo,
  dato,
  codigo,
}) => (
  <Aparece at={at}>
    <Card accent={color} style={{ width: 520, minHeight: 470, display: "flex", flexDirection: "column", gap: 20 }}>
      <Chip bg={color} size={24}>
        {`EJEMPLO ${n} · ${tipo}`}
      </Chip>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink, lineHeight: 1.15 }}>{titulo}</div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.dim }}>{dato}</div>
      <div style={{ fontFamily: MONO, fontSize: 24, color: C.green, background: "#0f1530", borderRadius: 12, padding: "10px 14px" }}>{codigo}</div>
    </Card>
  </Aparece>
);

const Ejemplos: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3] = lineas;
  return (
    <>
      <Sequence durationInFrames={e1.at} layout="none">
        <TituloCapitulo n={4} nombre={guion.escenas[5].capitulo ?? ""} />
      </Sequence>
      <Sequence from={e1.at} layout="none">
        <Stage direction="row" gap={40}>
          <Ejemplo at={0} n={1} tipo="INDUSTRIA" color={C.coral} titulo="Sensores de una fábrica" dato="Miles de lecturas por segundo" codigo="temp[temp > 90]" />
          <Ejemplo at={e2.at - e1.at} n={2} tipo="CIENCIA" color={C.blue} titulo="Imagen de un telescopio" dato="Brillo de cada pixel (2D)" codigo="img.mean()" />
          <Ejemplo at={e3.at - e1.at} n={3} tipo="DÍA A DÍA" color={C.yellow} titulo="Una canción" dato="44,100 muestras por segundo" codigo="audio * 0.5" />
        </Stage>
        <Nota>Ejemplos simplificados</Nota>
      </Sequence>
    </>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1] = lineas;
  return (
    <>
      <PlusDatos />
      <Stage gap={34}>
        <Words text="Cada columna de pandas es un *arreglo* de NumPy" size={70} delay={p1.at} accent={C.purple} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Consola at={p1.at + 30} texto='df["precio"].to_numpy()' />
          <Consola at={p1.at + 70} texto="array([10, 25,  7, 40])" prompt="" />
        </div>
      </Stage>
    </>
  );
};

const Reto: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <>
      <Seccion bg={C.yellow}>RETO · NOTEBOOK</Seccion>
      <RetoResumen
        atReto={r1.at}
        atResumen={r2.at}
        durResumen={r2.frames}
        reto={<Consola at={r1.at + 10} texto="np.arange(1, 11) + 5   # ¿qué sale?" size={44} />}
        ideas={["Un arreglo guarda números juntos y del mismo tipo", "Opera con todos a la vez, sin ciclos", "Forma: (6,) es 1D, (3, 6) es 2D"]}
      />
    </>
  );
};

const CierreP: React.FC<EscenaProps> = (props) => (
  <>
    <CierreCurso {...props} titulo="Índices y *cortes*" sub="Cómo leer y cortar un arreglo | Numpy 1D" />
    <Sequence durationInFrames={props.lineas[1].at} layout="none">
      <AvisoNotebook at={20} ruta={guion.notebook} />
    </Sequence>
  </>
);

export const PLANTILLA = leerGuion(guion);

export const Plantilla: React.FC = () => (
  <VideoLargo
    guion={PLANTILLA}
    escenas={{
      gancho: Gancho,
      sello: Sello,
      teoria: Teoria,
      concepto: Concepto,
      codigo: Codigo,
      ejemplos: Ejemplos,
      plus: Plus,
      reto: Reto,
      cierre: CierreP,
    }}
  />
);
