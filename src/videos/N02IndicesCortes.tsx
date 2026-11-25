import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { Sfx, Split, Stage, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, useP } from "../kit/piezas";
import { CierreCurso, Cuidado, Plano, PlusDatos, RetoResumen, Seccion, SelloSerie, Nota } from "../kit/curso";
import { AvisoNotebook, Celda, Consola } from "../kit/codigo";
import { Casilla, Fase, Fijo, Mono, Res, Tarjeta } from "../kit/escena";
import { colorValor, Escena3D } from "../kit/tres";
import { C, MONO } from "../kit/theme";
import guion from "../guiones/n02-indices-cortes.json";

// Numpy 1D · Video 2 · Índices y cortes (Plantilla A con 3 bloques + respuesta del reto del video 1).
// Salidas reales (ver campo `codigo` del guion y el notebook). Sin destellos: cada escena muestra algo desde su
// frame 0 y lo que aparece después tiene su espacio reservado.

const NB = guion.notebook;
const TEMPS = ["21", "23", "19", "25", "22", "18", "24"];

/** Fila de casillas con índices arriba (amarillo) y, opcional, negativos abajo (morado). */
const FilaIdx: React.FC<{
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
const tramo = <T,>(frame: number, tramos: { desde: number; v: T }[], inicial: T): T => {
  let r = inicial;
  for (const t of tramos) if (frame >= t.desde) r = t.v;
  return r;
};

// ---------------------------------------------------------------- 1 · Gancho

const Panel: React.FC<{ chip: string; color: string; lineas: string[]; salida: React.ReactNode; brilla: number; nota: string; notaColor: string; notaAt: number }> = ({
  chip,
  color,
  lineas,
  salida,
  brilla,
  nota,
  notaColor,
  notaAt,
}) => (
  <div
    style={{
      width: 800,
      background: `${C.bg2}cc`,
      border: `4px solid ${color}${brilla > 0.5 ? "" : "66"}`,
      borderRadius: 28,
      padding: "30px 36px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: `0 0 ${60 * brilla}px ${color}55`,
    }}
  >
    <div>
      <Chip bg={color} size={28}>
        {chip}
      </Chip>
    </div>
    {lineas.map((l) => (
      <Fijo key={l} texto={l} size={32} />
    ))}
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8 }}>
      {salida}
      <Aparece at={notaAt}>
        <Chip bg={notaColor} size={24}>
          {nota}
        </Chip>
      </Aparece>
    </div>
  </div>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3] = lineas;
  const izq = useP(g1.at + 60, g1.at + 72) * (1 - useP(g2.at, g2.at + 12));
  const der = useP(g2.at + 30, g2.at + 42);
  return (
    <Stage gap={50}>
      <div style={{ display: "flex", gap: 40 }}>
        <Panel
          chip="LISTA DE PYTHON"
          color={C.blue}
          lineas={["lista = [10, 20, 30, 40, 50]", "parte = lista[1:4]", "parte[0] = 0", "print(lista)"]}
          salida={
            <Mono size={44} color={C.ink}>
              [10, 20, 30, 40, 50]
            </Mono>
          }
          brilla={izq}
          nota="sin cambios"
          notaColor={C.green}
          notaAt={g1.at + 70}
        />
        <Panel
          chip="ARREGLO DE NUMPY"
          color={C.coral}
          lineas={["arr = np.array([10, 20, 30, 40, 50])", "parte = arr[1:4]", "parte[0] = 0", "print(arr)"]}
          salida={
            <Mono size={44} color={C.ink}>
              {"[10  "}
              <span style={{ color: C.bg, background: C.coral, borderRadius: 8, padding: "0 6px" }}>0</span>
              {" 30 40 50]"}
            </Mono>
          }
          brilla={der}
          nota="¡cambió!"
          notaColor={C.coral}
          notaAt={g2.at + 35}
        />
      </div>
      <div style={{ height: 130 }}>
        <Aparece at={g3.at}>
          <Words text="Índices y *cortes*" size={100} delay={g3.at} accent={C.blue} />
        </Aparece>
      </div>
      <Sfx src="boom.wav" at={g2.at + 30} volume={0.3} />
    </Stage>
  );
};

const Sello: React.FC<EscenaProps> = () => (
  <SelloSerie nombre="NUMPY *1D*" temas={["De listas a arreglos", "Índices y cortes"]} n={2} lema="NumPy desde cero · curso de Python para Ciencia de Datos" />
);

// ---------------------------------------------------------------- 2 · Respuesta del reto

const ESCALONES = Array.from({ length: 50 }, (_, i) => Math.floor((10 * i) / 49));
const RETO_X = ["0.0", "0.2", "0.41", "0.61", "0.82", "1.02"];

const Recuerda: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [m1, m2] = lineas;
  const corta = frame >= m1.at + 90;
  const primerEscalon = frame >= m2.at + 20;
  return (
    <Stage gap={30}>
      <Chip bg={C.yellow} size={30}>
        RESPUESTA DEL RETO
      </Chip>
      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        <Plano w={620} h={260} x={[0, 50]} y={[0, 10]} paso={10} pasoY={5} etiquetaX="i" etiquetaY="x">
          {(e) => (
            <>
              <polyline points={ESCALONES.map((v, i) => `${e.X(i)},${e.Y(v)}`).join(" ")} fill="none" stroke={C.yellow} strokeWidth={5} strokeLinejoin="round" />
              {primerEscalon && <polyline points={ESCALONES.slice(0, 5).map((v, i) => `${e.X(i)},${e.Y(v)}`).join(" ")} fill="none" stroke={C.coral} strokeWidth={12} strokeLinecap="round" />}
            </>
          )}
        </Plano>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RETO_X.map((v, i) => {
            const [ent, dec] = v.split(".");
            const res = i < 5 ? "0" : "1";
            return (
              <Aparece key={v} at={m1.at + 20 + i * 8}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: MONO, fontWeight: 700, fontSize: 44 }}>
                  <span style={{ width: 150, textAlign: "right" }}>
                    <span style={{ color: C.ink }}>{ent}</span>
                    <span style={{ color: C.purple, textDecoration: corta ? "line-through" : "none", opacity: corta ? 0.55 : 1 }}>.{dec}</span>
                  </span>
                  <span style={{ color: C.dim, opacity: corta ? 1 : 0 }}>→</span>
                  <span
                    style={{
                      color: primerEscalon && i < 5 ? C.bg : C.green,
                      background: primerEscalon && i < 5 ? C.coral : "transparent",
                      borderRadius: 8,
                      padding: "0 10px",
                      opacity: corta ? 1 : 0,
                    }}
                  >
                    {res}
                  </span>
                </div>
              </Aparece>
            );
          })}
        </div>
      </div>
      <Aparece at={m1.at + 100}>
        <Mono size={30} color={C.dim}>
          x.astype(int) corta los decimales
        </Mono>
      </Aparece>
    </Stage>
  );
};

// ---------------------------------------------------------------- 3 · Teoría (Three.js)

/** Fila de cubos (las 7 temperaturas) que se levantan según el tramo. Todo depende del frame. */
const FilaCubos: React.FC<{ tramos: { desde: number; sel: number[]; color: string }[]; at: number }> = ({ tramos, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  let k = -1;
  tramos.forEach((t, i) => {
    if (frame >= t.desde) k = i;
  });
  const cur = k >= 0 ? tramos[k] : undefined;
  const prev = k >= 1 ? tramos[k - 1] : undefined;
  const pIn = cur ? spring({ frame: frame - cur.desde, fps, config: { damping: 13 } }) : 0;
  return (
    <group>
      {TEMPS.map((_, i) => {
        const s = spring({ frame: frame - at - i * 3, fps, config: { damping: 14 } });
        const enCur = cur?.sel.includes(i) ?? false;
        const enPrev = prev?.sel.includes(i) ?? false;
        const lift = enCur ? (enPrev ? 1 : pIn) : enPrev ? 1 - pIn : 0;
        const color = enCur ? cur!.color : colorValor(0.5).getStyle();
        return (
          <mesh key={i} geometry={geo} position={[(i - 3) * 1.15, lift * 1.3, 0]} scale={Math.max(0.001, s)}>
            <meshStandardMaterial color={color} roughness={0.45} emissive={enCur ? color : "#000"} emissiveIntensity={enCur ? 0.25 * lift : 0} />
          </mesh>
        );
      })}
    </group>
  );
};

const Teoria: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [t1, t2, t3] = lineas;
  const mitad = t2.at + Math.round(t2.frames * 0.45);
  const tramos = [
    { desde: t2.at, sel: [3], color: C.yellow },
    { desde: mitad, sel: [1, 2, 3], color: C.blue },
    { desde: t3.at, sel: [0, 2, 5], color: C.coral },
  ];
  const chips = [
    { t: "temps[3] · índice", c: C.yellow, desde: t2.at },
    { t: "temps[1:4] · corte", c: C.blue, desde: mitad },
    { t: "temps[[0, 2, 5]] · lista de posiciones", c: C.coral, desde: t3.at },
  ];
  const activo = tramo(frame, chips.map((c, i) => ({ desde: c.desde, v: i })), -1);
  // Cámara casi de frente (fov bajo): las casillas de abajo quedan alineadas con los cubos.
  const ppu = 540 / 2 / (20 * Math.tan((7 * Math.PI) / 180));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {chips.map((c, i) => (
          <Aparece key={c.t} at={c.desde}>
            <div style={{ opacity: activo === i ? 1 : 0.45 }}>
              <Chip bg={c.c} color={C.bg} size={30}>
                {c.t}
              </Chip>
            </div>
          </Aparece>
        ))}
      </div>
      <div style={{ position: "absolute", top: 250, left: 0, width: 1920, height: 540 }}>
        <Escena3D width={1920} height={540} orbita={0} dist={20} altura={2.5} anguloInicial={0} fov={14} objetivo={[0, 0.6, 0]}>
          <FilaCubos tramos={tramos} at={4} />
        </Escena3D>
      </div>
      <div style={{ position: "absolute", top: 690, left: 0, right: 0, height: 60 }}>
        {TEMPS.map((_, i) => (
          <Aparece key={i} at={t1.at + 40 + i * 4} style={{ position: "absolute", left: 960 + (i - 3) * 1.15 * ppu - 50, width: 100, textAlign: "center" }}>
            <Mono size={34} color={C.yellow}>
              {i}
            </Mono>
          </Aparece>
        ))}
      </div>
      <div style={{ position: "absolute", top: 740, left: 0, right: 0, height: 60 }}>
        {TEMPS.map((_, i) => (
          <Aparece key={i} at={t1.at + 90 + i * 4} style={{ position: "absolute", left: 960 + (i - 3) * 1.15 * ppu - 50, width: 100, textAlign: "center" }}>
            <Mono size={28} color={C.purple}>
              {i - 7}
            </Mono>
          </Aparece>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · Índices

const Indices: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [i1, i2, i3, i4, i5] = lineas;
  const sel = tramo<number[]>(
    frame,
    [
      { desde: i2.at + 15, v: [0] },
      { desde: i2.at + 55, v: [3] },
      { desde: i2.at + 100, v: [6] },
      { desde: i3.at, v: [2] },
      { desde: i4.at, v: [0] },
      { desde: i5.at, v: [] },
    ],
    [],
  );
  const vals = [...TEMPS];
  if (frame >= i3.at + 70) vals[2] = "30";
  return (
    <Split
      ratio={0.52}
      left={
        <Celda
          ancho={940}
          size={27}
          desde={0}
          lineas={[
            { at: i1.at + 20, py: "temps = np.array([21, 23, 19, 25, 22, 18, 24])" },
            { at: i2.at, py: "print(temps[0], temps[3], temps[-1])" },
            { at: i3.at + 30, py: "temps[2] = 30" },
            { at: i3.at + 60, py: "print(temps)" },
            { at: i4.at + 90, py: "temps[0] = 21.9" },
            { at: i4.at + 130, py: "print(temps[0])" },
            { at: i5.at + 40, py: "temps[10]" },
          ]}
          salida={[
            { t: "21 25 24", at: i2.at + 110 },
            { t: "[21 23 30 25 22 18 24]", at: i3.at + 85 },
            { t: "21", at: i4.at + 160 },
            { t: "IndexError: index 10 is out of bounds…", at: i5.at + 70 },
          ]}
        />
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
          <FilaIdx vals={vals} on={(i) => sel.includes(i)} resalte={(i) => (i === 2 && frame >= i3.at + 70 ? C.coral : C.yellow)} neg negAt={i2.at + 90} />
          <div style={{ position: "relative", width: 820, height: 230 }}>
            <Fase desde={i4.at} hasta={i5.at}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Cuidado at={i4.at + 5}>
                  <Chip bg={C.purple} size={26}>
                    ¡CUIDADO! · ARREGLO DE ENTEROS
                  </Chip>
                  <Mono size={58}>
                    {"21"}
                    <span style={{ color: C.purple, textDecoration: frame >= i4.at + 150 ? "line-through" : "none" }}>.9</span>
                    <span style={{ color: C.dim }}>{"  →  "}</span>
                    <span style={{ color: C.coral, opacity: frame >= i4.at + 150 ? 1 : 0 }}>21</span>
                  </Mono>
                </Cuidado>
              </div>
            </Fase>
            <Fase desde={i5.at}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Cuidado at={i5.at + 60}>
                  <Mono size={30} color={C.purple}>
                    IndexError:
                  </Mono>
                  <Mono size={28}>index 10 is out of bounds</Mono>
                  <Mono size={28}>for axis 0 with size 7</Mono>
                </Cuidado>
              </div>
            </Fase>
          </div>
        </div>
      }
    />
  );
};

// ---------------------------------------------------------------- 5 · Cortes

/** Corchete sobre las casillas [desde, hasta) de una fila (ancho de casilla 100 + 8 de separación). */
const Corchete: React.FC<{ desde: number; hasta: number; color: string; texto: string }> = ({ desde, hasta, color, texto }) => {
  const paso = 108;
  const x = desde * paso;
  const w = (hasta - desde) * paso - 8;
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: w, height: 56, borderTop: `6px solid ${color}`, borderLeft: `6px solid ${color}`, borderRight: `6px solid ${color}`, borderRadius: "12px 12px 0 0" }}>
      <div style={{ position: "absolute", top: -50, left: 0, right: 0, textAlign: "center" }}>
        <Mono size={30} color={color}>
          {texto}
        </Mono>
      </div>
    </div>
  );
};

/** Vista vs copia en 3D: fila original, una "ventana" sobre los 3 primeros y, después, una copia aparte. */
const Vista3D: React.FC<{ at: number; cambio: number; copia: number }> = ({ at, cambio, copia }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const borde = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(3 * 1.15 + 0.2, 1.5, 1.5)), []);
  const v = spring({ frame: frame - at, fps, config: { damping: 14 } });
  const cop = spring({ frame: frame - copia, fps, config: { damping: 14 } });
  const verde = colorValor(0.5).getStyle();
  return (
    <group>
      {TEMPS.map((_, i) => (
        <mesh key={i} geometry={geo} position={[(i - 3) * 1.15, 0, 0]}>
          <meshStandardMaterial color={i === 0 && frame >= cambio ? C.coral : verde} roughness={0.45} />
        </mesh>
      ))}
      <lineSegments geometry={borde} position={[-2.3, 0, 0]} scale={Math.max(0.001, v)}>
        <lineBasicMaterial color={C.yellow} />
      </lineSegments>
      {[0, 1, 2].map((i) => (
        <mesh key={`c${i}`} geometry={geo} position={[(i - 3) * 1.15, -2.2 * cop, 0]} scale={Math.max(0.001, cop) * 0.95}>
          <meshStandardMaterial color={C.blue} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
};

const Cortes: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [k1, k2, k3, k4, k5, k6] = lineas;
  const corte = tramo<{ d: number; h: number; t: string; sel: number[] } | null>(
    frame,
    [
      { desde: k1.at + 40, v: { d: 1, h: 4, t: "[1:4]", sel: [1, 2, 3] } },
      { desde: k2.at + 10, v: { d: 0, h: 3, t: "[:3]", sel: [0, 1, 2] } },
      { desde: k2.at + 85, v: { d: 4, h: 7, t: "[4:]", sel: [4, 5, 6] } },
      { desde: k3.at + 10, v: { d: 0, h: 7, t: "[::2]", sel: [0, 2, 4, 6] } },
      { desde: k3.at + 100, v: { d: 0, h: 7, t: "[::-1]  ←", sel: [0, 1, 2, 3, 4, 5, 6] } },
    ],
    null,
  );
  const vals = [...TEMPS];
  if (frame >= k4.at + 70) vals.splice(1, 3, "0", "0", "0");
  if (frame >= k4.at + 170) vals.splice(5, 2, "100", "200");
  const cambiado = (i: number) => (frame >= k4.at + 70 && i >= 1 && i <= 3) || (frame >= k4.at + 170 && i >= 5);
  const cambio = k6.at + 20;
  const copia = k6.at + Math.round(k6.frames * 0.55);
  return (
    <>
      <Fase desde={0} hasta={k5.at}>
        <AbsoluteFill style={{ padding: "210px 140px 210px 140px", display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          <div style={{ position: "relative" }}>
            {corte && frame < k4.at && <Corchete desde={corte.d} hasta={corte.h} color={C.blue} texto={corte.t} />}
            <div style={{ paddingTop: 70 }}>
              <FilaIdx
                vals={vals}
                idx={false}
                on={(i) => (frame < k4.at ? (corte?.sel.includes(i) ?? false) : cambiado(i))}
                resalte={() => (frame < k4.at ? C.blue : C.coral)}
                apagada={(i) => frame < k4.at && corte !== null && corte.t === "[1:4]" && i === 4}
              />
            </div>
          </div>
          <div style={{ position: "relative", width: 1500, flex: 1 }}>
            <Fase desde={0} hasta={k4.at}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Celda
                  ancho={1300}
                  size={31}
                  desde={0}
                  titulo="consola · cada línea muestra su resultado"
                  lineas={[
                    { at: k1.at + 40, py: "temps[1:4]", res: "array([23, 19, 25])" },
                    { at: k2.at + 10, py: "temps[:3]", res: "array([21, 23, 19])" },
                    { at: k2.at + 85, py: "temps[4:]", res: "array([22, 18, 24])" },
                    { at: k3.at + 10, py: "temps[::2]", res: "array([21, 19, 22, 24])" },
                    { at: k3.at + 100, py: "temps[::-1]", res: "array([24, 18, 22, 25, 19, 23, 21])" },
                  ]}
                />
              </div>
            </Fase>
            <Fase desde={k4.at}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Celda
                  ancho={1300}
                  size={31}
                  desde={k4.at}
                  n={2}
                  lineas={[
                    { at: k4.at + 30, py: "temps[1:4] = 0" },
                    { at: k4.at + 60, py: "print(temps)" },
                    { at: k4.at + 130, py: "temps[-2:] = [100, 200]" },
                    { at: k4.at + 160, py: "print(temps)" },
                  ]}
                  salida={[
                    { t: "[21  0  0  0 22 18 24]", at: k4.at + 75 },
                    { t: "[ 21   0   0   0  22 100 200]", at: k4.at + 175 },
                  ]}
                />
              </div>
            </Fase>
          </div>
        </AbsoluteFill>
      </Fase>
      <Fase desde={k5.at}>
        <Split
          ratio={0.46}
          left={
            <Celda
              ancho={900}
              size={25}
              n={3}
              desde={k5.at}
              lineas={[
                { at: k5.at + 15, py: "temps = np.array([21, 23, 19, 25, 22, 18, 24])" },
                { at: k5.at + 70, py: "semana = temps[0:3]   # vista" },
                { at: k6.at, py: "semana[0] = 99" },
                { at: k6.at + 25, py: "print(temps)" },
                { at: copia - 10, py: "copia = temps[0:3].copy()" },
              ]}
              salida={[{ t: "[99 23 19 25 22 18 24]", at: cambio + 20 }]}
              resaltar={[1]}
              resaltarDesde={k5.at + 90}
            />
          }
          right={
            <div style={{ position: "relative", width: 900, height: 620 }}>
              <Escena3D width={900} height={620} orbita={0} dist={10} altura={2.6} anguloInicial={-14} objetivo={[0, -1.1, 0]}>
                <Vista3D at={k5.at + 80} cambio={cambio} copia={copia} />
              </Escena3D>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
                <Aparece at={k5.at + 80}>
                  <Chip bg={C.yellow} size={26}>
                    VISTA = misma memoria
                  </Chip>
                </Aparece>
                <Aparece at={cambio + 10}>
                  <Chip bg={C.coral} size={26}>
                    ¡cambió el original!
                  </Chip>
                </Aparece>
              </div>
              <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                <Aparece at={copia + 10}>
                  <Chip bg={C.blue} color={C.ink} size={26}>
                    .copy() = arreglo aparte
                  </Chip>
                </Aparece>
              </div>
            </div>
          }
        />
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 6 · Elementos dispersos

const Dispersos: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [d1, d2, d3, d4] = lineas;
  const fila2 = tramo<{ vals: string[]; desde: number; de: number[] } | null>(
    frame,
    [
      { desde: d1.at + 100, v: { vals: ["21", "19", "18"], desde: d1.at + 100, de: [0, 2, 5] } },
      { desde: d2.at + 20, v: { vals: ["24", "21", "24"], desde: d2.at + 20, de: [6, 0, 6] } },
      { desde: d3.at + 20, v: { vals: ["21", "19", "18"], desde: d3.at + 20, de: [0, 2, 5] } },
    ],
    null,
  );
  const quinientos = frame >= d3.at + 70 && frame < d4.at;
  const vals = [...TEMPS];
  const menos = frame >= d4.at + 80;
  if (menos) [0, 2, 5].forEach((i) => (vals[i] = "-1"));
  return (
    <Split
      ratio={0.48}
      left={
        <Celda
          ancho={840}
          size={28}
          desde={0}
          lineas={[
            { at: d1.at + 60, py: "idx = [0, 2, 5]" },
            { at: d1.at + 85, py: "print(temps[idx])" },
            { at: d2.at + 5, py: "print(temps[[6, 0, 6]])" },
            { at: d3.at + 10, py: "sel = temps[idx]   # copia" },
            { at: d3.at + 50, py: "sel[0] = 500" },
            { at: d3.at + 90, py: "print(temps)" },
            { at: d4.at + 40, py: "temps[idx] = -1" },
            { at: d4.at + 70, py: "print(temps)" },
          ]}
          salida={[
            { t: "[21 19 18]", at: d1.at + 110 },
            { t: "[24 21 24]", at: d2.at + 40 },
            { t: "[21 23 19 25 22 18 24]", at: d3.at + 110 },
            { t: "[-1 23 -1 25 22 -1 24]", at: d4.at + 95 },
          ]}
        />
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <Chip bg={C.green} size={26}>
            ORIGINAL · temps
          </Chip>
          <FilaIdx
            vals={vals}
            on={(i) => (menos ? [0, 2, 5].includes(i) : frame < d4.at && (fila2?.de.includes(i) ?? false))}
            resalte={() => (menos ? C.coral : C.yellow)}
          />
          <div style={{ height: 40 }}>
            {frame < d4.at && (
              <Aparece at={d3.at + 115}>
                <Chip bg={C.green} size={26}>
                  ✓ el original no cambió
                </Chip>
              </Aparece>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minHeight: 170 }}>
            <Aparece at={d1.at + 100}>
              <Chip bg={C.blue} color={C.ink} size={26}>
                {frame >= d3.at ? "SELECCIÓN · copia aparte" : "SELECCIÓN"}
              </Chip>
            </Aparece>
            <div style={{ display: "flex", gap: 8, opacity: frame >= d4.at ? 0.35 : 1 }}>
              {(fila2?.vals ?? ["", "", ""]).map((v, i) => (
                <Casilla key={i} v={i === 0 && quinientos ? "500" : v} on={i === 0 && quinientos} resalte={C.blue} ancho={110} alto={100} size={38} apagada={!fila2} />
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

// ---------------------------------------------------------------- 7 · Ejemplos

const Ejemplos: React.FC<EscenaProps> = ({ lineas }) => {
  const [, e2, e3] = lineas;
  return (
    <>
      <Stage direction="row" gap={36}>
        <Tarjeta at={0} n={1} tipo="INDUSTRIA" color={C.coral} titulo="Sensor con errores" dato="Dos lecturas de 99.9 por un fallo">
          <Res color={C.coral}>{"[20.1 20.3 99.9 20.2\n 20.4 99.9 20.0]"}</Res>
          <Fijo texto="lect[[2, 5]] = 20.2" size={26} />
          <Res>{"[20.1 20.3 20.2 20.2\n 20.4 20.2 20. ]"}</Res>
        </Tarjeta>
        <Tarjeta at={e2.at} n={2} tipo="CIENCIA" color={C.blue} titulo="Aparato que se estabiliza" dato="Descarta las 2 primeras y la última">
          <Fijo texto="datos[2:-1]" size={26} />
          <Res>[ 9.8  9.9 10.1  9.7 10. ]</Res>
          <Fijo texto="datos[2:-1].mean()" size={26} />
          <Res>9.9</Res>
        </Tarjeta>
        <Tarjeta at={e3.at} n={3} tipo="DÍA A DÍA" color={C.yellow} titulo="Tu playlist" dato="Tus favoritas: posiciones 3, 1 y 4">
          <Fijo texto="canciones[[3, 1, 4]]" size={26} />
          <Res>['Sol' 'Luna' 'Mar']</Res>
        </Tarjeta>
      </Stage>
      <Nota>Ejemplos simplificados (datos y canciones inventados)</Nota>
    </>
  );
};

// ---------------------------------------------------------------- 8 · Plus

const PERM = [4, 6, 2, 7, 3, 5, 9, 0, 8, 1];

const Barajar: React.FC<{ at: number; corte: number }> = ({ at, corte }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const paso = 108;
  return (
    <div style={{ position: "relative", width: paso * 10, height: 170 }}>
      {Array.from({ length: 10 }, (_, fila) => {
        const destino = PERM.indexOf(fila);
        const x = interpolate(p, [0, 1], [fila * paso, destino * paso]);
        const y = Math.sin(p * Math.PI) * (fila % 2 ? -40 : 40);
        const tren = frame >= corte;
        const color = !tren ? C.green : destino < 8 ? C.green : C.yellow;
        return (
          <div key={fila} style={{ position: "absolute", left: x, top: 30 + y }}>
            <Casilla v={String(fila)} on={tren} resalte={color} ancho={100} alto={90} size={38} />
          </div>
        );
      })}
    </div>
  );
};

const TablaDf: React.FC<{ filas: number[] }> = ({ filas }) => {
  const temps = [21, 23, 19, 25, 22];
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: MONO, fontSize: 36, border: `3px solid ${C.dim}44`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", background: `${C.bg2}`, color: C.dim, fontWeight: 700 }}>
        <span style={{ width: 90, padding: "8px 16px" }} />
        <span style={{ width: 140, padding: "8px 16px" }}>temp</span>
      </div>
      {temps.map((t, i) => (
        <div key={i} style={{ display: "flex", background: filas.includes(i) ? `${C.purple}33` : "transparent", color: C.ink, borderTop: `1px solid ${C.dim}22` }}>
          <span style={{ width: 90, padding: "6px 16px", color: C.yellow }}>{i}</span>
          <span style={{ width: 140, padding: "6px 16px", fontWeight: 700 }}>{t}</span>
        </div>
      ))}
    </div>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [q1, q2, q3] = lineas;
  const filas = frame >= q3.at + 90 ? [0, 4] : frame >= q3.at + 30 ? [1, 2, 3] : [];
  return (
    <>
      <PlusDatos />
      <Fase desde={0} hasta={q3.at}>
        <Stage gap={26}>
          <Words text="Entrenamiento y *prueba*" size={80} accent={C.yellow} delay={q1.at} />
          <Consola at={q2.at} texto="idx = rng.permutation(10)" size={36} />
          <Barajar at={q2.at + 40} corte={q2.at + 120} />
          <Aparece at={q2.at + 75}>
            <Mono size={36} color={C.green}>
              [4 6 2 7 3 5 9 0 8 1]
            </Mono>
          </Aparece>
          <div style={{ display: "flex", gap: 30 }}>
            <Aparece at={q2.at + 120}>
              <Chip bg={C.green} size={28}>
                idx[:8] · ENTRENAR
              </Chip>
            </Aparece>
            <Aparece at={q2.at + 135}>
              <Chip bg={C.yellow} size={28}>
                idx[8:] · PROBAR
              </Chip>
            </Aparece>
          </div>
        </Stage>
      </Fase>
      <Fase desde={q3.at}>
        <Split
          ratio={0.42}
          left={
            <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
              <Chip bg={C.blue} color={C.ink} size={26}>
                tabla de pandas (df)
              </Chip>
              <TablaDf filas={filas} />
            </div>
          }
          right={
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Consola at={q3.at + 15} texto="df.iloc[1:4]      # corte" size={40} />
              <Consola at={q3.at + 75} texto="df.iloc[[0, 4]]   # lista de posiciones" size={40} />
            </div>
          }
        />
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 9 · Reto y cierre

const Reto: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, , r3] = lineas;
  return (
    <>
      <Seccion bg={C.yellow}>RETO · NOTEBOOK</Seccion>
      <RetoResumen
        atReto={r1.at}
        atResumen={r3.at}
        durResumen={r3.frames}
        reto={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Consola at={r1.at + 15} texto="a = np.arange(1, 11)" size={42} prompt="" />
            <FilaIdx vals={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]} idx={false} ancho={84} size={32} />
            <Consola at={r1.at + 90} texto="a[ ? ]   # invertido y uno de cada tres" size={42} prompt="" />
          </div>
        }
        ideas={["Índice a[i]: un elemento", "Corte a[i:j:k]: un rango (es una vista)", "Lista a[[i, j]]: elementos sueltos (es una copia)"]}
      />
    </>
  );
};

const CierreN02: React.FC<EscenaProps> = (props) => (
  <>
    <CierreCurso {...props} titulo="Seguimos con los *arreglos*" sub="Próximo video | Numpy 1D" />
    <Fase desde={0} hasta={props.lineas[1].at}>
      <AvisoNotebook at={20} ruta={NB} />
    </Fase>
  </>
);

export const N02 = leerGuion(guion);

export const N02IndicesCortes: React.FC = () => (
  <VideoLargo
    guion={N02}
    escenas={{
      gancho: Gancho,
      sello: Sello,
      recuerda: Recuerda,
      teoria: Teoria,
      indices: Indices,
      cortes: Cortes,
      dispersos: Dispersos,
      ejemplos: Ejemplos,
      plus: Plus,
      reto: Reto,
      cierre: CierreN02,
    }}
  />
);

