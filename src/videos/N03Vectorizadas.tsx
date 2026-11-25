import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { Sfx, Split, Stage, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, useP } from "../kit/piezas";
import { CierreCurso, Cuidado, Curva, Nota, Plano, PlusDatos, RetoResumen, Seccion, SelloSerie } from "../kit/curso";
import { AvisoNotebook, Celda, Consola } from "../kit/codigo";
import { Barra, Fase, Fijo, FilaIdx, Mono, Res, Tarjeta, tramo } from "../kit/escena";
import { colorValor, Escena3D } from "../kit/tres";
import { C, FONT } from "../kit/theme";
import guion from "../guiones/n03-vectorizadas.json";

// Numpy 1D · Video 3 · Operaciones vectorizadas (Plantilla A con 5 bloques + respuesta del reto del video 2).
// Salidas reales y tiempos medidos (ver `codigo` del guion y el notebook). Sin destellos ni saltos.

const NB = guion.notebook;

// ---------------------------------------------------------------- 1 · Gancho

const Panel: React.FC<{ chip: string; color: string; lineas: string[]; children: React.ReactNode; ancho?: number }> = ({ chip, color, lineas, children, ancho = 820 }) => (
  <div
    style={{
      width: ancho,
      background: `${C.bg2}cc`,
      border: `4px solid ${color}88`,
      borderRadius: 28,
      padding: "28px 34px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div>
      <Chip bg={color} size={28}>
        {chip}
      </Chip>
    </div>
    <div style={{ minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {lineas.map((l) => (
        <Fijo key={l} texto={l} size={30} />
      ))}
    </div>
    {children}
  </div>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [, g2, g3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.ink }}>
        <span style={{ color: C.yellow }}>1,000,000</span> de temperaturas · °C → °F
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <Panel chip="CICLO FOR" color={C.coral} lineas={["resultado = []", "for t in lista:", "    resultado.append(t * 9 / 5 + 32)"]}>
          <Barra label="Tiempo" valor={73.7} max={73.7} unidad="ms" dec={1} color={C.coral} at={-120} ancho={750} />
        </Panel>
        <Panel chip="NUMPY" color={C.green} lineas={["resultado = temps * 9 / 5 + 32"]}>
          <Barra label="Tiempo" valor={1.54} max={73.7} unidad="ms" color={C.green} at={-120} ancho={750} />
        </Panel>
      </div>
      <div style={{ height: 120, display: "flex", alignItems: "center", gap: 40 }}>
        <Aparece at={g2.at + 60}>
          <Chip bg={C.yellow} size={40}>
            ≈ 48× más rápido
          </Chip>
        </Aparece>
        <Aparece at={g3.at}>
          <Words text="Operaciones *vectorizadas*" size={76} delay={g3.at} accent={C.blue} />
        </Aparece>
      </div>
      <Nota>Medido con timeit (mejor de 5) en el notebook · varía según la computadora</Nota>
      <Sfx src="boom.wav" at={g2.at + 60} volume={0.3} />
    </Stage>
  );
};

const Sello: React.FC<EscenaProps> = () => (
  <SelloSerie
    nombre="NUMPY *1D*"
    temas={["De listas a arreglos", "Índices y cortes", "Operaciones vectorizadas"]}
    n={3}
    lema="NumPy desde cero · curso de Python para Ciencia de Datos"
  />
);

// ---------------------------------------------------------------- 2 · Respuesta del reto

const Recuerda: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [m1, m2] = lineas;
  const elegidos = [9, 6, 3, 0].filter((_, k) => frame >= m2.at + 25 + k * 28);
  return (
    <Stage gap={34}>
      <Chip bg={C.yellow} size={30}>
        RESPUESTA DEL RETO
      </Chip>
      <Consola at={m1.at + 10} texto="a = np.arange(1, 11)" size={42} prompt="" />
      <FilaIdx vals={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]} on={(i) => elegidos.includes(i)} ancho={110} size={40} />
      <Consola at={m1.at + 50} texto="a[::-3]" size={52} prompt="" />
      <div style={{ height: 70 }}>
        <Aparece at={m2.at + 125}>
          <Mono size={58} color={C.green}>
            [10  7  4  1]
          </Mono>
        </Aparece>
      </div>
    </Stage>
  );
};

// ---------------------------------------------------------------- 3 · Teoría (Three.js)

const N_CUBOS = 8;

/** Fila de cubos: en `for` un cabezal los visita uno por uno; en `todos` cambian a la vez. Todo depende del frame. */
const FilaProceso: React.FC<{ inicioFor: number; finFor: number; todos: number }> = ({ inicioFor, finFor, todos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const porCubo = (finFor - inicioFor) / N_CUBOS;
  const k = Math.floor((frame - inicioFor) / porCubo);
  const enFor = frame >= inicioFor && frame < todos;
  const flash = spring({ frame: frame - todos, fps, config: { damping: 12 } });
  const base = colorValor(0).getStyle();
  return (
    <group>
      {Array.from({ length: N_CUBOS }, (_, i) => {
        const x = (i - (N_CUBOS - 1) / 2) * 1.2;
        let color = base;
        let lift = 0;
        if (frame >= todos) color = C.green;
        else if (enFor && i < k) color = C.coral;
        else if (enFor && i === k) {
          color = C.yellow;
          lift = 0.4;
        }
        const s = frame >= todos ? 1 + 0.15 * Math.sin(Math.min(1, flash) * Math.PI) : 1;
        return (
          <mesh key={i} geometry={geo} position={[x, lift, 0]} scale={s}>
            <meshStandardMaterial color={color} roughness={0.45} emissive={frame >= todos ? C.green : "#000"} emissiveIntensity={frame >= todos ? 0.3 * (1 - Math.min(1, flash)) + 0.05 : 0} />
          </mesh>
        );
      })}
      {enFor && k >= 0 && k < N_CUBOS && (
        <mesh position={[(k - (N_CUBOS - 1) / 2) * 1.2, 1.6, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.35, 0.7, 4]} />
          <meshStandardMaterial color={C.yellow} />
        </mesh>
      )}
    </group>
  );
};

const Teoria: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [t1, t2, t3] = lineas;
  const todos = t2.at + 60;
  const fase = frame < todos ? 0 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
        <div style={{ opacity: fase === 0 ? 1 : 0.4 }}>
          <Chip bg={C.coral} size={32}>
            for · uno por uno (Python)
          </Chip>
        </div>
        <Aparece at={todos}>
          <Chip bg={C.green} size={32}>
            NumPy · todos a la vez (en C)
          </Chip>
        </Aparece>
      </div>
      <div style={{ position: "absolute", top: 260, left: 0, width: 1920, height: 480 }}>
        <Escena3D width={1920} height={480} orbita={0} dist={11.5} altura={3} anguloInicial={-10} fov={30} objetivo={[0, 0.3, 0]}>
          <FilaProceso inicioFor={t1.at + 20} finFor={t1.at + t1.frames + 10} todos={todos} />
        </Escena3D>
      </div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
        <Aparece at={t3.at}>
          <Chip bg={C.blue} color={C.ink} size={30}>
            sin for en tu código
          </Chip>
        </Aparece>
        <Aparece at={t3.at + 20}>
          <Mono size={44} color={C.ink}>
            temps * 9 / 5 + 32
          </Mono>
        </Aparece>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · Operaciones vectorizadas

const Vectorizadas: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [v1, v2, v3] = lineas;
  const ops = [
    { desde: v1.at + 70, op: "precios + 5", vals: ["15", "30", "12", "45"] },
    { desde: v1.at + 130, op: "precios - 5", vals: ["5", "20", "2", "35"] },
    { desde: v1.at + 185, op: "precios * 2", vals: ["20", "50", "14", "80"] },
    { desde: v2.at + 20, op: "precios / 2", vals: ["5.", "12.5", "3.5", "20."] },
    { desde: v3.at + 40, op: "10 - precios", vals: ["0", "-15", "3", "-30"] },
  ];
  const act = tramo<(typeof ops)[number] | null>(frame, ops.map((o) => ({ desde: o.desde, v: o })), null);
  const pulso = act ? interpolate(frame - act.desde, [0, 8, 24], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <Split
      ratio={0.52}
      left={
        <Celda
          ancho={940}
          size={26}
          desde={0}
          titulo="consola · cada línea muestra su resultado"
          lineas={[
            { at: v1.at + 10, py: "precios = np.array([10, 25, 7, 40])" },
            { at: ops[0].desde - 25, py: "precios + 5", res: "array([15, 30, 12, 45])", resAt: ops[0].desde },
            { at: ops[1].desde - 25, py: "precios - 5", res: "array([ 5, 20,  2, 35])", resAt: ops[1].desde },
            { at: ops[2].desde - 25, py: "precios * 2", res: "array([20, 50, 14, 80])", resAt: ops[2].desde },
            { at: ops[3].desde - 25, py: "precios / 2", res: "array([ 5. , 12.5,  3.5, 20. ])", resAt: ops[3].desde },
            { at: ops[4].desde - 25, py: "10 - precios", res: "array([  0, -15,   3, -30])", resAt: ops[4].desde },
          ]}
          resaltar={[4]}
          resaltarDesde={v2.at + 20}
        />
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Chip bg={C.blue} color={C.ink} size={28}>
            precios
          </Chip>
          <FilaIdx vals={["10", "25", "7", "40"]} idx={false} ancho={150} size={46} />
          <Mono size={48} color={C.dim}>
            ↓
          </Mono>
          <div style={{ height: 50 }}>
            {act && (
              <Mono size={40} color={C.yellow}>
                {act.op}
              </Mono>
            )}
          </div>
          <div style={{ scale: `${1 + 0.06 * pulso}` }}>
            <FilaIdx vals={act ? act.vals : ["", "", "", ""]} idx={false} ancho={150} size={46} on={() => !!act} resalte={() => (act && act.op.includes("/") ? C.purple : C.green)} />
          </div>
          <div style={{ height: 50 }}>
            <Aparece at={v2.at + 40}>
              <Chip bg={C.purple} size={26}>
                / siempre da decimales (float64)
              </Chip>
            </Aparece>
          </div>
        </div>
      }
    />
  );
};

// ---------------------------------------------------------------- 5 · Potencias, // y %

const Bolitas: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", gap: 30 * p + 10, alignItems: "center" }}>
        {[0, 1, 2].map((g) => (
          <div
            key={g}
            style={{
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 20,
              border: `4px solid ${g < 2 && p > 0.5 ? C.yellow : "transparent"}`,
            }}
          >
            {Array.from({ length: g < 2 ? 3 : 1 }, (_, i) => (
              <div key={i} style={{ width: 54, height: 54, borderRadius: 27, background: g < 2 ? C.blue : C.coral }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 40, opacity: p }}>
        <Mono size={36} color={C.yellow}>
          7 // 3 = 2 grupos
        </Mono>
        <Mono size={36} color={C.coral}>
          7 % 3 = 1 sobra
        </Mono>
      </div>
    </div>
  );
};

const Potencias: React.FC<EscenaProps> = ({ lineas }) => {
  const [w1, w2, w3, w4] = lineas;
  return (
    <>
      <Fase desde={0} hasta={w3.at}>
        <Split
          ratio={0.5}
          left={
            <Celda
              ancho={900}
              size={30}
              desde={0}
              titulo="consola · cada línea muestra su resultado"
              lineas={[
                { at: w1.at + 5, py: "x = np.array([7, 8, 9, 10])" },
                { at: w1.at + 60, py: "x ** 2", res: "array([ 49,  64,  81, 100])" },
                { at: w2.at + 40, py: "x // 3", res: "array([2, 2, 3, 3])" },
                { at: w2.at + 120, py: "x % 3", res: "array([1, 2, 0, 1])" },
              ]}
            />
          }
          right={
            <div style={{ position: "relative", width: 820, height: 420 }}>
              <Fase desde={0} hasta={w2.at}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20 }}>
                  <FilaIdx vals={["7", "8", "9", "10"]} idx={false} ancho={130} size={44} />
                  <Mono size={40} color={C.yellow}>
                    ** 2
                  </Mono>
                  <Aparece at={w1.at + 80}>
                    <FilaIdx vals={["49", "64", "81", "100"]} idx={false} ancho={130} size={44} on={() => true} resalte={() => C.green} />
                  </Aparece>
                </div>
              </Fase>
              <Fase desde={w2.at}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Bolitas at={w2.at + 150} />
                </div>
              </Fase>
            </div>
          }
        />
      </Fase>
      <Fase desde={w3.at} hasta={w4.at}>
        <Stage gap={30}>
          <Chip bg={C.blue} color={C.ink} size={28}>
            MINUTOS → HORAS Y MINUTOS
          </Chip>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Consola at={w3.at + 10} texto="minutos = np.array([75, 130, 45])" size={38} />
            <Consola at={w3.at + 60} texto="minutos // 60    # horas" size={38} />
            <Consola at={w3.at + 100} texto="minutos % 60     # minutos" size={38} />
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            {[
              ["75 min", "1 h 15 min"],
              ["130 min", "2 h 10 min"],
              ["45 min", "0 h 45 min"],
            ].map(([a, b], i) => (
              <Aparece key={a} at={w3.at + 140 + i * 10}>
                <div style={{ background: `${C.bg2}dd`, border: `3px solid ${C.green}66`, borderRadius: 20, padding: "16px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Mono size={32} color={C.dim}>
                    {a}
                  </Mono>
                  <Mono size={42} color={C.green}>
                    {b}
                  </Mono>
                </div>
              </Aparece>
            ))}
          </div>
        </Stage>
      </Fase>
      <Fase desde={w4.at}>
        <Stage gap={30}>
          <Chip bg={C.purple} size={30}>
            ¡CUIDADO! · NEGATIVOS
          </Chip>
          <Cuidado at={w4.at + 5}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "6px 16px" }}>
              <Consola at={w4.at + 15} texto="np.array([-7]) // 2" size={44} />
              <Aparece at={w4.at + 55}>
                <Mono size={48} color={C.coral}>
                  array([-4])
                </Mono>
              </Aparece>
              <Consola at={w4.at + 80} texto="np.array([-7]) % 2" size={44} />
              <Aparece at={w4.at + 115}>
                <Mono size={48} color={C.coral}>
                  array([1])
                </Mono>
              </Aparece>
            </div>
          </Cuidado>
          <Aparece at={w4.at + 140}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.ink }}>
              -7 / 2 = -3.5 → hacia <span style={{ color: C.yellow }}>abajo</span> → -4
            </div>
          </Aparece>
        </Stage>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 6 · Combinar (Three.js)

const PASO_C = 1.7;

/** Dos filas (precios arriba, cantidades abajo) que se juntan; cada par se convierte en su resultado. */
const Emparejar: React.FC<{ junta: number }> = ({ junta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const geo = useMemo(() => new THREE.BoxGeometry(1.1, 1.1, 1.1), []);
  const p = spring({ frame: frame - junta, fps, config: { damping: 16 } });
  const listo = p > 0.92;
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const x = (i - 1) * PASO_C;
        if (listo) {
          return (
            <mesh key={`r${i}`} geometry={geo} position={[x, 0, 0]} scale={1.15}>
              <meshStandardMaterial color={C.green} roughness={0.4} />
            </mesh>
          );
        }
        return (
          <group key={i}>
            <mesh geometry={geo} position={[x, 1.6 * (1 - p), 0]}>
              <meshStandardMaterial color={C.blue} roughness={0.45} />
            </mesh>
            <mesh geometry={geo} position={[x, -1.6 * (1 - p), 0]}>
              <meshStandardMaterial color={C.yellow} roughness={0.45} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Combinar: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [b1, b2, b3, b4] = lineas;
  const junta = b1.at + 150;
  const p = spring({ frame: frame - junta, fps, config: { damping: 16 } });
  const listo = p > 0.92;
  // Cámara de frente (altura 0): las etiquetas HTML quedan sobre el centro de cada cubo.
  const H = 600;
  const ppu = H / 2 / (14 * Math.tan((15 * Math.PI) / 180));
  const etiqueta = (x: number, y: number, t: string, color: string) => (
    <div key={`${x}-${y}-${t}`} style={{ position: "absolute", left: 450 + x * ppu - 80, top: H / 2 - y * ppu - 30, width: 160, textAlign: "center" }}>
      <Mono size={46} color={color}>
        {t}
      </Mono>
    </div>
  );
  return (
    <>
      <Fase desde={0} hasta={b3.at}>
        <Split
          ratio={0.5}
          left={
            <Celda
              ancho={900}
              size={26}
              desde={0}
              titulo="consola · cada línea muestra su resultado"
              lineas={[
                { at: b1.at + 20, py: "precios = np.array([10, 25, 7])" },
                { at: b1.at + 70, py: "cantidades = np.array([3, 1, 5])" },
                { at: junta - 20, py: "precios * cantidades", res: "array([30, 25, 35])", resAt: junta + 20 },
                { at: b2.at + 90, py: "(precios * cantidades).sum()", res: "90" },
              ]}
            />
          }
          right={
            <div style={{ position: "relative", width: 900, height: H }}>
              <Escena3D width={900} height={H} orbita={0} dist={14} altura={0} anguloInicial={0} fov={30}>
                <Emparejar junta={junta} />
              </Escena3D>
              {!listo && [10, 25, 7].map((v, i) => etiqueta((i - 1) * PASO_C, 1.6 * (1 - p), String(v), C.bg))}
              {!listo && [3, 1, 5].map((v, i) => etiqueta((i - 1) * PASO_C, -1.6 * (1 - p), String(v), C.bg))}
              {listo && [30, 25, 35].map((v, i) => etiqueta((i - 1) * PASO_C, 0, String(v), C.bg))}
              <div style={{ position: "absolute", top: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
                <Chip bg={C.blue} color={C.ink} size={26}>
                  precios
                </Chip>
                <Mono size={30} color={C.dim}>
                  ×
                </Mono>
                <Chip bg={C.yellow} size={26}>
                  cantidades
                </Chip>
              </div>
              <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                <Aparece at={b2.at + 100}>
                  <Chip bg={C.green} size={30}>
                    total = 90
                  </Chip>
                </Aparece>
              </div>
            </div>
          }
        />
      </Fase>
      <Fase desde={b3.at} hasta={b4.at}>
        <Stage gap={40}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <Chip bg={C.coral} size={26}>
              LISTAS · une
            </Chip>
            <Consola at={b3.at + 10} texto="[1, 2, 3] + [10, 20, 30]" size={46} />
            <Aparece at={b3.at + 55}>
              <Mono size={50} color={C.coral}>
                [1, 2, 3, 10, 20, 30]
              </Mono>
            </Aparece>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <Chip bg={C.green} size={26}>
              ARREGLOS · suma elemento a elemento
            </Chip>
            <Consola at={b3.at + 100} texto="a + b" size={46} />
            <Aparece at={b3.at + 130}>
              <Mono size={50} color={C.green}>
                array([11, 22, 33])
              </Mono>
            </Aparece>
          </div>
        </Stage>
      </Fase>
      <Fase desde={b4.at}>
        <Stage gap={30}>
          <Chip bg={C.purple} size={30}>
            ¡CUIDADO! · MISMO TAMAÑO
          </Chip>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <FilaIdx vals={["1", "2", "3"]} idx={false} ancho={120} size={44} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <FilaIdx vals={["1", "2"]} idx={false} ancho={120} size={44} />
              <Mono size={60} color={C.purple} style={{ width: 120, textAlign: "center" }}>
                ?
              </Mono>
            </div>
          </div>
          <Cuidado at={b4.at + 70}>
            <Mono size={30} color={C.purple}>
              ValueError:
            </Mono>
            <Mono size={28}>operands could not be broadcast together</Mono>
            <Mono size={28}>with shapes (3,) (2,)</Mono>
          </Cuidado>
        </Stage>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 7 · Encadenar

const Orden: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const partes = [
    { t: "temps_c", n: 0 },
    { t: " * 9", n: 1 },
    { t: " / 5", n: 2 },
    { t: " + 32", n: 3 },
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-end" }}>
      {partes.map((p) => {
        const on = p.n > 0 && frame >= at + (p.n - 1) * 35;
        return (
          <div key={p.t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                background: on ? C.yellow : "transparent",
                color: C.bg,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {on ? p.n : ""}
            </div>
            <Mono size={64} color={on ? C.yellow : C.ink} style={{ whiteSpace: "pre" }}>
              {p.t}
            </Mono>
          </div>
        );
      })}
    </div>
  );
};

const Eslabon: React.FC<{ at: number; t: string; res: string; ultimo?: boolean }> = ({ at, t, res, ultimo }) => (
  <Aparece at={at}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ background: `${C.bg2}ee`, border: `3px solid ${C.coral}`, borderRadius: 16, padding: "12px 20px" }}>
          <Mono size={34}>{t}</Mono>
        </div>
        <Mono size={28} color={C.green}>
          {res}
        </Mono>
      </div>
      {!ultimo && (
        <Mono size={40} color={C.dim}>
          →
        </Mono>
      )}
    </div>
  </Aparece>
);

const Encadenar: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3] = lineas;
  return (
    <>
      <Fase desde={0} hasta={c2.at}>
        <Stage gap={40}>
          <Orden at={c1.at + 130} />
          <Aparece at={c1.at + 240}>
            <Mono size={52} color={C.green}>
              array([70.7 , 73.4 , 67.64, 77.18])
            </Mono>
          </Aparece>
          <Aparece at={c1.at + 20}>
            <Mono size={30} color={C.dim}>
              temps_c = np.array([21.5, 23.0, 19.8, 25.1])
            </Mono>
          </Aparece>
        </Stage>
      </Fase>
      <Fase desde={c2.at} hasta={c3.at}>
        <Stage gap={30}>
          <Chip bg={C.purple} size={30}>
            ¡CUIDADO! · PARÉNTESIS
          </Chip>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <Consola at={c2.at + 10} texto="temps_c * 9 / 5 + 32" size={44} />
            <Mono size={44} color={C.green}>
              array([70.7 , 73.4 , 67.64, 77.18])
            </Mono>
            <Consola at={c2.at + 60} texto="temps_c * (9 / 5 + 32)" size={44} />
            <Aparece at={c2.at + 100}>
              <Mono size={44} color={C.coral}>
                array([726.7 , 777.4 , 669.24, 848.38])
              </Mono>
            </Aparece>
          </div>
        </Stage>
      </Fase>
      <Fase desde={c3.at}>
        <Stage gap={40}>
          <Words text="Una *cadena* de operaciones" size={76} accent={C.coral} delay={c3.at} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <Eslabon at={c3.at + 25} t="precios * cantidades" res="[30 25 35]" />
            <Eslabon at={c3.at + 70} t="* 1.16" res="[34.8 29.  40.6]" />
            <Eslabon at={c3.at + 115} t=".round(1)" res="[34.8 29.  40.6]" />
            <Eslabon at={c3.at + 160} t=".sum()" res="104.4" ultimo />
          </div>
        </Stage>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 8 · Funciones

const Funciones: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2, f3] = lineas;
  const trazo = useP(f1.at + 30, f1.at + 90, false);
  return (
    <Split
      ratio={0.52}
      left={
        <Celda
          ancho={960}
          size={27}
          desde={0}
          lineas={[
            { at: f1.at + 20, py: "print(np.sqrt(np.array([1, 4, 9, 16])))" },
            { at: f1.at + 80, py: "print(np.abs(np.array([-3, 2, -1])))" },
            { at: f1.at + 130, py: "print(np.exp(np.array([0, 1, 2])).round(2))" },
            { at: f1.at + 180, py: "print(np.log10(np.array([1, 10, 100])))" },
          ]}
          salida={[
            { t: "[1. 2. 3. 4.]", at: f1.at + 60 },
            { t: "[3 2 1]", at: f1.at + 115 },
            { t: "[1.   2.72 7.39]", at: f1.at + 170 },
            { t: "[0. 1. 2.]", at: f1.at + 215 },
          ]}
          resaltar={[0, 1, 2, 3]}
          resaltarDesde={f2.at + 30}
        />
      }
      right={
        <div style={{ position: "relative", width: 820, height: 520 }}>
          <Fase desde={0} hasta={f3.at}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14 }}>
              <Plano w={620} h={300} x={[0, 17]} y={[0, 4.5]} paso={4} pasoY={1} etiquetaX="x" etiquetaY="√x">
                {(e) => (
                  <>
                    <Curva e={e} f={Math.sqrt} x={[0, 17]} p={trazo} color={C.blue} />
                    {[1, 4, 9, 16].map((v) => (
                      <circle key={v} cx={e.X(v)} cy={e.Y(Math.sqrt(v))} r={10} fill={C.green} opacity={trazo >= v / 17 ? 1 : 0} />
                    ))}
                  </>
                )}
              </Plano>
              <Aparece at={f2.at}>
                <Chip bg={C.coral} size={28}>
                  ufunc: arreglo → arreglo
                </Chip>
              </Aparece>
            </div>
          </Fase>
          <Fase desde={f3.at}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
              <Cuidado at={f3.at + 10}>
                <Mono size={34}>math.sqrt(arreglo)</Mono>
                <Mono size={34} color={C.purple}>
                  → TypeError
                </Mono>
              </Cuidado>
              <Aparece at={f3.at + 120}>
                <div style={{ background: `${C.green}22`, border: `4px solid ${C.green}`, borderRadius: 24, padding: "18px 30px" }}>
                  <Mono size={34}>np.sqrt(arreglo) ✓</Mono>
                </div>
              </Aparece>
            </div>
          </Fase>
        </div>
      }
    />
  );
};

// ---------------------------------------------------------------- 9 · Ejemplos

const MiniCafe: React.FC = () => (
  <svg width={300} height={80}>
    {[90, 62.5, 45.8, 29.5].map((v, i, a) => {
      if (i === 0) return null;
      const X = (k: number) => 20 + ([0, 5, 10, 20][k] / 20) * 260;
      const Y = (t: number) => 70 - ((t - 20) / 70) * 60;
      return <line key={i} x1={X(i - 1)} y1={Y(a[i - 1])} x2={X(i)} y2={Y(v)} stroke={C.coral} strokeWidth={5} strokeLinecap="round" />;
    })}
  </svg>
);

const Ejemplos: React.FC<EscenaProps> = ({ lineas }) => {
  const [, e2, e3] = lineas;
  return (
    <>
      <Stage direction="row" gap={36}>
        <Tarjeta at={0} n={1} tipo="COMERCIO" color={C.coral} titulo="Total con IVA" dato="precio × cantidad × 1.16">
          <Fijo texto="precios * cantidades * 1.16" size={24} />
          <Res>[34.8 29.  40.6]</Res>
        </Tarjeta>
        <Tarjeta at={e2.at} n={2} tipo="CIENCIA" color={C.blue} titulo="Café que se enfría" dato="T = 20 + 70 · e^(−0.1 t)">
          <Fijo texto="t = np.array([0, 5, 10, 20])" size={24} />
          <Fijo texto="20 + 70 * np.exp(-0.1 * t)" size={24} />
          <Res>[90.  62.5 45.8 29.5] °C</Res>
          <MiniCafe />
        </Tarjeta>
        <Tarjeta at={e3.at} n={3} tipo="DÍA A DÍA" color={C.yellow} titulo="Tiempos de carrera" dato="segundos → minutos:segundos">
          <Fijo texto="segundos // 60" size={24} />
          <Res>[1 2 4]</Res>
          <Fijo texto="segundos % 60" size={24} />
          <Res>[35 10  5]</Res>
          <Res color={C.yellow}>1:35 · 2:10 · 4:05</Res>
        </Tarjeta>
      </Stage>
      <Nota>Ejemplos simplificados (datos inventados)</Nota>
    </>
  );
};

// ---------------------------------------------------------------- 10 · Plus

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3] = lineas;
  return (
    <>
      <PlusDatos />
      <Stage gap={18}>
        <Words text="Misma *escala* para todos" size={58} accent={C.purple} delay={q1.at} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Mono size={28} color={C.dim} style={{ width: 230, textAlign: "right" }}>
            estaturas
          </Mono>
          <FilaIdx vals={["150", "160", "170", "180", "190"]} idx={false} ancho={140} size={40} />
        </div>
        <Consola at={q2.at + 60} texto="(alt - alt.min()) / (alt.max() - alt.min())" size={32} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Mono size={28} color={C.yellow} style={{ width: 230, textAlign: "right" }}>
            min-max (0–1)
          </Mono>
          <Aparece at={q2.at + 130}>
            <FilaIdx vals={["0.", "0.25", "0.5", "0.75", "1."]} idx={false} ancho={140} size={40} on={() => true} resalte={() => C.yellow} />
          </Aparece>
        </div>
        <Consola at={q3.at + 50} texto="((alt - alt.mean()) / alt.std()).round(2)" size={32} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Mono size={28} color={C.green} style={{ width: 230, textAlign: "right" }}>
            estandarizado
          </Mono>
          <Aparece at={q3.at + 120}>
            <FilaIdx vals={["-1.41", "-0.71", "0.", "0.71", "1.41"]} idx={false} ancho={140} size={40} on={() => true} resalte={() => C.green} />
          </Aparece>
        </div>
      </Stage>
    </>
  );
};

// ---------------------------------------------------------------- 11 · Reto y cierre

const Reto: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r3] = lineas;
  return (
    <>
      <Seccion bg={C.yellow}>RETO · NOTEBOOK</Seccion>
      <RetoResumen
        atReto={r1.at}
        atResumen={r3.at}
        durResumen={r3.frames}
        reto={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Consola at={r1.at + 15} texto="a = np.arange(1, 11)" size={40} prompt="" />
            <FilaIdx vals={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]} idx={false} ancho={84} size={32} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Aparece at={r2.at + 20}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mono size={26} color={C.yellow} style={{ width: 110, textAlign: "right" }}>
                    a % 2
                  </Mono>
                  <FilaIdx vals={["1", "0", "1", "0", "1", "0", "1", "0", "1", "0"]} idx={false} ancho={84} size={30} on={(i) => i % 2 === 0} resalte={() => C.yellow} />
                </div>
              </Aparece>
            </div>
            <Mono size={30} color={C.dim}>
              # suma de los cuadrados de los impares · una línea · sin for
            </Mono>
          </div>
        }
        ideas={["Arreglo y número: se aplica a cada elemento", "Dos arreglos del mismo tamaño: elemento a elemento", "np.sqrt, np.exp…: ya vienen vectorizadas"]}
      />
    </>
  );
};

const CierreN03: React.FC<EscenaProps> = (props) => (
  <>
    <CierreCurso {...props} titulo="Seguimos con los *arreglos*" sub="Próximo video | Numpy 1D" />
    <Fase desde={0} hasta={props.lineas[1].at}>
      <AvisoNotebook at={20} ruta={NB} />
    </Fase>
  </>
);

export const N03 = leerGuion(guion);

export const N03Vectorizadas: React.FC = () => (
  <VideoLargo
    guion={N03}
    escenas={{
      gancho: Gancho,
      sello: Sello,
      recuerda: Recuerda,
      teoria: Teoria,
      vectorizadas: Vectorizadas,
      potencias: Potencias,
      combinar: Combinar,
      encadenar: Encadenar,
      funciones: Funciones,
      ejemplos: Ejemplos,
      plus: Plus,
      reto: Reto,
      cierre: CierreN03,
    }}
  />
);
