import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, useP } from "../kit/piezas";
import { CierreCurso, Cuidado, Curva, Nota, Plano, PlusDatos, RetoResumen, Seccion, SelloSerie } from "../kit/curso";
import { AvisoNotebook, Celda, Consola } from "../kit/codigo";
import { Arreglo3D, Escena3D, semilla } from "../kit/tres";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/n01-listas-arreglos.json";

// Numpy 1D · Video 1 · De listas a arreglos (Plantilla A con 6 bloques).
// Todas las salidas en pantalla son las reales (ver campo `codigo` del guion y el notebook).
// Reglas: sin destellos entre secciones; cada escena muestra algo desde su frame 0; lo que aparece después
// tiene su espacio reservado (Aparece deja el hueco aunque aún no se vea).

const NB = guion.notebook;

/** Muestra su contenido solo entre los frames [desde, hasta) de la escena, con un fundido corto de entrada. */
const Fase: React.FC<{ desde: number; hasta?: number; children: React.ReactNode }> = ({ desde, hasta = 1e9, children }) => {
  const frame = useCurrentFrame();
  if (frame < desde || frame >= hasta) return null;
  return <AbsoluteFill style={{ opacity: interpolate(frame, [desde, desde + 8], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

/** Texto de código fijo (ya escrito), con el resaltado del kit. */
const Fijo: React.FC<{ texto: string; size?: number; prompt?: string }> = ({ texto, size = 40, prompt = "" }) => (
  <Consola at={-1000} texto={texto} size={size} prompt={prompt} />
);

const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  color = C.ink,
  style,
}) => <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color, whiteSpace: "pre", fontVariantLigatures: "none", ...style }}>{children}</div>;

const Barra: React.FC<{ label: string; valor: number; max: number; unidad: string; color: string; at: number; dec?: number; ancho?: number }> = ({
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
const AvisoGrande: React.FC<{ at: number }> = ({ at }) => (
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
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{NB}</div>
      </div>
      <Sfx src="pop.wav" at={at} volume={0.35} />
    </Aparece>
  </Stage>
);

// ---------------------------------------------------------------- 1 · Gancho

const Lado: React.FC<{ chip: string; color: string; codigo: string; salida: string; brilla: number }> = ({ chip, color, codigo, salida, brilla }) => (
  <div
    style={{
      width: 760,
      background: `${C.bg2}cc`,
      border: `4px solid ${color}${brilla > 0.5 ? "" : "66"}`,
      borderRadius: 28,
      padding: "34px 40px",
      display: "flex",
      flexDirection: "column",
      gap: 26,
      boxShadow: `0 0 ${60 * brilla}px ${color}55`,
    }}
  >
    <div>
      <Chip bg={color} size={28}>
        {chip}
      </Chip>
    </div>
    <Fijo texto={codigo} size={46} prompt=">>> " />
    <Mono size={58} color={color} style={{ scale: `${1 + 0.06 * brilla}`, transformOrigin: "left center" }}>
      {salida}
    </Mono>
  </div>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [, g2, g3] = lineas;
  const izq = useP(g2.at, g2.at + 12) * (1 - useP(g2.at + 70, g2.at + 82));
  const der = useP(g2.at + 75, g2.at + 87);
  return (
    <Stage gap={60}>
      <div style={{ display: "flex", gap: 60 }}>
        <Lado chip="LISTA DE PYTHON" color={C.coral} codigo="lista * 2" salida="[1, 2, 3, 1, 2, 3]" brilla={izq} />
        <Lado chip="ARREGLO DE NUMPY" color={C.green} codigo="arreglo * 2" salida="[2 4 6]" brilla={der} />
      </div>
      <div style={{ height: 130 }}>
        {/* Espacio reservado desde el cuadro 0. */}
        <Aparece at={g3.at}>
          <Words text="De listas a *arreglos*" size={100} delay={g3.at} accent={C.blue} />
        </Aparece>
      </div>
      <Sfx src="boom.wav" at={g2.at} volume={0.3} />
    </Stage>
  );
};

const Sello: React.FC<EscenaProps> = () => (
  <SelloSerie nombre="NUMPY *1D*" temas={["De listas a arreglos"]} n={1} lema="NumPy desde cero · curso de Python para Ciencia de Datos" />
);

// ---------------------------------------------------------------- 2 · Teoría

/** Lista de Python en 3D: objetos sueltos, de tipos distintos, conectados con "flechas" desde la lista. */
const ListaSuelta: React.FC<{ at: number; x: number }> = ({ at, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pos = useMemo(() => {
    const r = semilla(7);
    return [0, 1, 2, 3, 4].map((i) => new THREE.Vector3(x + (r() - 0.5) * 3.2, 1.8 - i * 0.9 + (r() - 0.5) * 0.6, (r() - 0.5) * 2.4));
  }, [x]);
  const colores = [C.coral, C.yellow, C.purple, C.blue, C.green];
  const origen = new THREE.Vector3(x - 3.2, 0, 0);
  return (
    <group>
      <mesh position={origen}>
        <boxGeometry args={[0.5, 4.4, 0.5]} />
        <meshStandardMaterial color={C.bg2} />
      </mesh>
      {pos.map((p0, i) => {
        const s = spring({ frame: frame - at - i * 6, fps, config: { damping: 14 } });
        const p = p0.clone().add(new THREE.Vector3(0, Math.sin(frame / 18 + i) * 0.12, 0));
        const a = new THREE.Vector3(origen.x + 0.25, 1.8 - i * 0.9, 0);
        const dir = new THREE.Vector3().subVectors(p, a);
        const largo = dir.length() * s;
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        const medio = a.clone().add(dir.clone().multiplyScalar(0.5 * s));
        return (
          <group key={i}>
            <mesh position={medio} quaternion={q}>
              <cylinderGeometry args={[0.03, 0.03, Math.max(0.001, largo), 6]} />
              <meshStandardMaterial color={C.dim} />
            </mesh>
            <mesh position={p} rotation={[i * 0.5, i * 0.8, i * 0.3]} scale={Math.max(0.001, s) * (0.55 + (i % 3) * 0.12)}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={colores[i]} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Teoria: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2, t3, t4] = lineas;
  return (
    <>
      <Fase desde={0} hasta={t2.at}>
        <Stage gap={30}>
          <Words text="NumPy = *Num*erical *Py*thon" size={110} accent={C.blue} delay={4} />
          <Aparece at={t1.at + 40}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 48, color: C.dim }}>Python numérico: muchos números a la vez</div>
          </Aparece>
        </Stage>
      </Fase>
      <Fase desde={t2.at} hasta={t4.at}>
        <Escena3D orbita={2} dist={12} altura={2.5} anguloInicial={0}>
          <ListaSuelta at={t2.at + 6} x={-3.2} />
          <group position={[3.0, 0, 0]}>
            <Arreglo3D forma={[5]} at={t3.at} ritmo={4} valores={() => 0.5} hueco={0.03} />
          </group>
        </Escena3D>
        <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
          <Aparece at={t2.at}>
            <Chip bg={C.coral} size={30}>
              LISTA · objetos sueltos
            </Chip>
          </Aparece>
          <Aparece at={t3.at}>
            <Chip bg={C.green} size={30}>
              ARREGLO · juntos y del mismo tipo
            </Chip>
          </Aparece>
        </div>
      </Fase>
      <Fase desde={t4.at}>
        <Stage gap={22}>
          <div style={{ display: "flex", gap: 22 }}>
            {["pandas", "Matplotlib", "scikit-learn"].map((t, i) => (
              <Aparece key={t} at={t4.at + 50 + i * 18}>
                <div
                  style={{
                    width: 380,
                    padding: "30px 0",
                    textAlign: "center",
                    borderRadius: 22,
                    background: `${C.bg2}ee`,
                    border: `3px solid ${C.blue}88`,
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 48,
                    color: C.ink,
                  }}
                >
                  {t}
                </div>
              </Aparece>
            ))}
          </div>
          <Aparece at={t4.at + 10}>
            <div
              style={{
                width: 1184,
                padding: "34px 0",
                textAlign: "center",
                borderRadius: 22,
                background: C.green,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 64,
                color: C.bg,
              }}
            >
              NumPy
            </div>
          </Aparece>
        </Stage>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 3 · Tu primer arreglo

const Casilla: React.FC<{ v: string; on: boolean }> = ({ v, on }) => (
  <div
    style={{
      width: 120,
      height: 110,
      borderRadius: 14,
      border: `4px solid ${on ? C.yellow : C.green}`,
      background: on ? `${C.yellow}33` : `${C.green}1a`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 44,
      color: C.ink,
    }}
  >
    {v}
  </div>
);

const Primero: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [a1, a2, a3, a4, a5, a6, a7] = lineas;
  const atenua = interpolate(frame, [a7.at, a7.at + 10], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const valores = ["21", "23", "19", "25", "22"];
  const extremo = frame >= a6.at + 20;
  return (
    <>
      <AbsoluteFill style={{ opacity: atenua }}>
        <Split
          ratio={0.5}
          left={
            <>
              <Celda
                ancho={880}
                size={30}
                desde={0}
                lineas={[
                  { at: a1.at + 8, py: "import numpy as np" },
                  { at: a2.at + 30, py: "temperaturas = [21, 23, 19, 25, 22]" },
                  { at: a2.at + 85, py: "arr = np.array(temperaturas)" },
                  { at: a3.at, py: "print(arr)" },
                ]}
                salida={[{ t: "[21 23 19 25 22]", at: a3.at + 25 }]}
              />
              <Celda
                ancho={880}
                size={30}
                n={2}
                desde={0}
                lineas={[
                  { at: a4.at, py: "print(type(arr))" },
                  { at: a5.at, py: "print(arr.shape, arr.ndim, arr.size)" },
                  { at: a6.at, py: "print(arr[0], arr[-1])" },
                ]}
                salida={[
                  { t: "<class 'numpy.ndarray'>", at: a4.at + 30 },
                  { t: "(5,) 1 5", at: a5.at + 45 },
                  { t: "21 22", at: a6.at + 30 },
                ]}
              />
            </>
          }
          right={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <Aparece at={a2.at + 30}>
                <Mono size={44} color={C.coral}>
                  [21, 23, 19, 25, 22]
                </Mono>
              </Aparece>
              <Aparece at={a2.at + 85}>
                <Mono size={32} color={C.dim}>
                  ↓ np.array
                </Mono>
              </Aparece>
              <Aparece at={a3.at + 25}>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <Mono size={44} color={C.green}>
                    [21 23 19 25 22]
                  </Mono>
                  <Chip bg={C.yellow} size={24}>
                    sin comas
                  </Chip>
                </div>
              </Aparece>
              <Aparece at={a5.at + 20} style={{ marginTop: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    {valores.map((_, i) => (
                      <Mono key={i} size={28} color={C.yellow} style={{ width: 120, textAlign: "center" }}>
                        {i}
                      </Mono>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {valores.map((v, i) => (
                      <Casilla key={i} v={v} on={extremo && (i === 0 || i === 4)} />
                    ))}
                  </div>
                  <Aparece at={a6.at + 20}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[-5, -4, -3, -2, -1].map((v) => (
                        <Mono key={v} size={28} color={C.purple} style={{ width: 120, textAlign: "center" }}>
                          {v}
                        </Mono>
                      ))}
                    </div>
                  </Aparece>
                  <Aparece at={a5.at + 60} style={{ marginTop: 10 }}>
                    <Chip bg={C.blue} color={C.ink} size={30}>
                      shape (5,) · 1 dimensión
                    </Chip>
                  </Aparece>
                </div>
              </Aparece>
            </div>
          }
        />
      </AbsoluteFill>
      <Fase desde={a7.at}>
        <AvisoGrande at={a7.at} />
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 4 · Arreglos vs listas

const Diferencias: React.FC<EscenaProps> = ({ lineas }) => {
  const [l1, l2, l3, l4, l5] = lineas;
  return (
    <>
      <Fase desde={0} hasta={l3.at}>
        <Stage gap={34}>
          <Chip bg={C.blue} color={C.ink} size={28}>
            DIFERENCIA 1 · OPERACIONES
          </Chip>
          <Celda
            ancho={1250}
            size={40}
            desde={0}
            lineas={[
              { at: 6, py: "lista = [1, 2, 3]" },
              { at: 26, py: "arr = np.array([1, 2, 3])" },
              { at: l1.at + 55, py: "print(lista + [10])" },
              { at: l1.at + 115, py: "print(arr + 10)" },
            ]}
            salida={[
              { t: "[1, 2, 3, 10]", at: l1.at + 85 },
              { t: "[11 12 13]", at: l1.at + 150 },
            ]}
            resaltar={[3]}
            resaltarDesde={l2.at}
          />
          <Aparece at={l2.at + 25}>
            <Sticker bg={C.green} color={C.bg} size={36}>
              Operación vectorizada: sin ciclo for
            </Sticker>
          </Aparece>
        </Stage>
      </Fase>
      <Fase desde={l3.at} hasta={l4.at}>
        <Stage gap={40}>
          <Chip bg={C.coral} size={28}>
            DIFERENCIA 2 · UN SOLO TIPO
          </Chip>
          <Cuidado at={l3.at + 8}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "10px 20px" }}>
              <Consola at={l3.at + 20} texto='np.array([1, "dos", 3.0])' size={50} />
              <Aparece at={l3.at + 100}>
                <Mono size={58} color={C.coral}>
                  ['1' 'dos' '3.0']
                </Mono>
              </Aparece>
            </div>
          </Cuidado>
          <Aparece at={l3.at + 140}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink }}>Todo se volvió texto: hasta el 1 y el 3.0</div>
          </Aparece>
        </Stage>
      </Fase>
      <Fase desde={l4.at}>
        <Stage gap={30}>
          <Chip bg={C.purple} size={28}>
            DIFERENCIA 3 · VELOCIDAD Y MEMORIA
          </Chip>
          <div style={{ display: "flex", gap: 90, marginTop: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.dim }}>Sumar 1,000,000 de números</div>
              <Barra label="Lista" valor={5.09} max={5.09} unidad="ms" color={C.coral} at={l4.at + 30} ancho={740} />
              <Barra label="NumPy" valor={0.44} max={5.09} unidad="ms" color={C.green} at={l4.at + 30} ancho={740} />
            </div>
            <Aparece at={l5.at}>
              <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.dim }}>Memoria</div>
                <Barra label="Lista" valor={36} max={36} unidad="MB" dec={0} color={C.coral} at={l5.at + 5} ancho={740} />
                <Barra label="NumPy" valor={8} max={36} unidad="MB" dec={0} color={C.green} at={l5.at + 5} ancho={740} />
              </div>
            </Aparece>
          </div>
        </Stage>
        <Nota>Medido en el notebook (timeit, mejor de 5; memoria aprox. con sys.getsizeof) · varía según la computadora</Nota>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 5 · Tipos de datos

const PASO = 0.8 + 0.08;
const FilaBytes: React.FC<{ tipo: string; n: number; at: number; color: string }> = ({ tipo, n, at, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <div style={{ width: 190, textAlign: "right" }}>
      <Chip bg={color} color={C.bg} size={28}>
        {tipo}
      </Chip>
    </div>
    <div style={{ position: "relative", width: 620, height: 92 }}>
      <Escena3D width={620} height={92} orbita={0} dist={8} altura={1.1} anguloInicial={14} fov={10} objetivo={[3.5 * PASO - ((n - 1) / 2) * PASO, 0, 0]}>
        <Arreglo3D forma={[n]} at={at} ritmo={3} valores={() => (n > 1 ? 1 : 0)} hueco={0.08} />
      </Escena3D>
    </div>
    <Mono size={30} color={C.dim}>
      {n} {n === 1 ? "byte" : "bytes"}
    </Mono>
  </div>
);

const Tipos: React.FC<EscenaProps> = ({ lineas }) => {
  const [d1, d2, d3, d4, d5] = lineas;
  return (
    <Split
      ratio={0.47}
      left={
        <Celda
          ancho={840}
          size={29}
          desde={0}
          lineas={[
            { at: d1.at + 8, py: "a = np.array([1, 2, 3])" },
            { at: d1.at + 32, py: "b = np.array([1.5, 2, 3])" },
            { at: d1.at + 56, py: "c = np.array([True, False, True])" },
            { at: d1.at + 80, py: 'd = np.array(["sol", "luna"])' },
            { at: d2.at, py: "print(a.dtype, b.dtype, c.dtype, d.dtype)" },
            { at: d2.at + 95, py: "print(b)" },
            { at: d5.at, py: "print(a.itemsize, a.nbytes)" },
          ]}
          salida={[
            { t: "int64 float64 bool <U4", at: d2.at + 35 },
            { t: "[1.5 2.  3. ]", at: d2.at + 120 },
            { t: "8 24", at: d5.at + 40 },
          ]}
          resaltar={[6]}
          resaltarDesde={d5.at}
        />
      }
      right={
        <div style={{ position: "relative", width: 900, height: 640 }}>
          <Fase desde={0} hasta={d4.at}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 14, padding: "0 60px" }}>
              {[
                { k: "a · enteros", v: "int64", c: C.blue, at: d2.at + 35 },
                { k: "b · un decimal", v: "float64", c: C.blue, at: d2.at + 70 },
                { k: "c · verdadero / falso", v: "bool", c: C.yellow, at: d3.at + 30 },
                { k: "d · texto (U = Unicode)", v: "<U4", c: C.purple, at: d3.at + 75 },
              ].map((f) => (
                <Aparece key={f.k} at={f.at}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 38, padding: "14px 0", borderBottom: `2px solid ${C.dim}22` }}>
                    <span style={{ color: C.dim }}>{f.k}</span>
                    <span style={{ color: f.c, fontWeight: 700 }}>{f.v}</span>
                  </div>
                </Aparece>
              ))}
            </div>
          </Fase>
          <Fase desde={d4.at}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 12 }}>
              <FilaBytes tipo="int8" n={1} at={d4.at + 10} color={C.blue} />
              <FilaBytes tipo="bool" n={1} at={d4.at + 20} color={C.yellow} />
              <FilaBytes tipo="int64" n={8} at={d4.at + 40} color={C.blue} />
              <FilaBytes tipo="float64" n={8} at={d4.at + 70} color={C.blue} />
              <Aparece at={d5.at + 45} style={{ marginTop: 14, alignSelf: "center" }}>
                <Chip bg={C.green} size={32}>
                  3 números × 8 bytes = 24 bytes
                </Chip>
              </Aparece>
            </div>
          </Fase>
        </div>
      }
    />
  );
};

// ---------------------------------------------------------------- 6 · Cambiar el tipo

const Precio: React.FC<{ ent: string; dec: string; at: number; corta: number; res: string }> = ({ ent, dec, at, corta, res }) => {
  const frame = useCurrentFrame();
  const tachado = frame >= corta;
  return (
    <Aparece at={at}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: MONO, fontWeight: 700, fontSize: 64 }}>
        <span style={{ width: 300, textAlign: "right" }}>
          <span style={{ color: C.ink }}>{ent}</span>
          <span style={{ color: C.purple, textDecoration: tachado ? "line-through" : "none", opacity: tachado ? 0.55 : 1 }}>{dec}</span>
        </span>
        <span style={{ color: C.dim, opacity: tachado ? 1 : 0 }}>→</span>
        <span style={{ color: C.coral, width: 90, opacity: tachado ? 1 : 0 }}>{res}</span>
      </div>
    </Aparece>
  );
};

const Astype: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4, c5] = lineas;
  return (
    <>
      <Fase desde={0} hasta={c5.at}>
        <Split
          ratio={0.52}
          left={
            <Celda
              ancho={930}
              size={30}
              desde={0}
              lineas={[
                { at: c1.at + 10, py: "precios = np.array([19.99, 5.50, 3.75])" },
                { at: c2.at, py: "print(precios.astype(int))" },
                { at: c3.at, py: "print(np.round(precios).astype(int))" },
                { at: c4.at + 10, py: 'textos = np.array(["10", "20", "30"])' },
                { at: c4.at + 70, py: "print(textos.astype(int) + 1)" },
              ]}
              salida={[
                { t: "[19  5  3]", at: c2.at + 30 },
                { t: "[20  6  4]", at: c3.at + 45 },
                { t: "[11 21 31]", at: c4.at + 110 },
              ]}
            />
          }
          right={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <Precio ent="19" dec=".99" at={c1.at + 20} corta={c2.at + 45} res="19" />
              <Precio ent="5" dec=".50" at={c1.at + 26} corta={c2.at + 45} res="5" />
              <Precio ent="3" dec=".75" at={c1.at + 32} corta={c2.at + 45} res="3" />
              <Aparece at={c2.at + 80}>
                <Chip bg={C.coral} size={30}>
                  astype corta, no redondea
                </Chip>
              </Aparece>
              <Aparece at={c3.at + 45} style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Chip bg={C.green} size={28}>
                    np.round + astype
                  </Chip>
                  <Mono size={52} color={C.green}>
                    [20  6  4]
                  </Mono>
                </div>
              </Aparece>
              <Aparece at={c4.at + 110} style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Mono size={44} color={C.purple}>
                    "10"
                  </Mono>
                  <Mono size={36} color={C.dim}>
                    → astype(int) →
                  </Mono>
                  <Mono size={44} color={C.blue}>
                    10
                  </Mono>
                </div>
              </Aparece>
            </div>
          }
        />
      </Fase>
      <Fase desde={c5.at}>
        <Stage gap={36}>
          <Chip bg={C.purple} size={30}>
            ¡CUIDADO! · EL NÚMERO NO CABE
          </Chip>
          <Cuidado at={c5.at + 6}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "10px 20px" }}>
              <Consola at={c5.at + 15} texto="x = np.array([100, 200, 300], dtype=np.int16)" size={40} />
              <Consola at={c5.at + 60} texto="x.astype(np.int8)" size={40} />
              <Aparece at={c5.at + 95}>
                <Mono size={56}>
                  {"array(["}
                  <span>100, </span>
                  <span style={{ color: C.bg, background: C.purple, borderRadius: 10, padding: "0 10px" }}>-56</span>
                  <span>,  44]</span>
                  {", dtype=int8)"}
                </Mono>
              </Aparece>
            </div>
          </Cuidado>
          <Aparece at={c5.at + 140}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.ink }}>
              int8 solo guarda de <span style={{ color: C.yellow }}>-128 a 127</span> · NumPy no avisa
            </div>
          </Aparece>
        </Stage>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 7 · Funciones fábrica

const Recta: React.FC<{ titulo: string; at: number; puntos: number[]; max: number; fuera?: number; etiquetas: string[] }> = ({ titulo, at, puntos, max, fuera, etiquetas }) => {
  const w = 640;
  const X = (v: number) => 30 + (v / max) * w;
  return (
    <Aparece at={at}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <Mono size={30} color={C.yellow}>
          {titulo}
        </Mono>
        <svg width={w + 60} height={120}>
          <line x1={20} y1={50} x2={w + 40} y2={50} stroke={C.dim} strokeWidth={4} />
          {puntos.map((v, i) => (
            <g key={i}>
              <circle cx={X(v)} cy={50} r={14} fill={C.green} />
              <text x={X(v)} y={100} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={C.ink}>
                {etiquetas[i]}
              </text>
            </g>
          ))}
          {fuera !== undefined && (
            <g>
              <circle cx={X(fuera)} cy={50} r={14} fill="none" stroke={C.coral} strokeWidth={4} />
              <line x1={X(fuera) - 16} y1={34} x2={X(fuera) + 16} y2={66} stroke={C.coral} strokeWidth={4} />
              <text x={X(fuera)} y={100} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={C.coral}>
                {fuera}
              </text>
            </g>
          )}
        </svg>
      </div>
    </Aparece>
  );
};

const Dado: React.FC<{ v: number; at: number }> = ({ v, at }) => {
  const PIPS: Record<number, [number, number][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [2, 0], [0, 2], [2, 2]],
    5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
    6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
  };
  return (
    <Aparece at={at}>
      <svg width={96} height={96} viewBox="0 0 96 96">
        <rect x={4} y={4} width={88} height={88} rx={18} fill={C.ink} />
        {PIPS[v].map(([cx, cy], i) => (
          <circle key={i} cx={24 + cx * 24} cy={24 + cy * 24} r={8} fill={C.bg} />
        ))}
      </svg>
    </Aparece>
  );
};

const Fabrica: React.FC<EscenaProps> = ({ lineas }) => {
  const [, f2, f3, f4, f5] = lineas;
  return (
    <AbsoluteFill style={{ padding: "150px 140px 210px 140px", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <Celda
        ancho={1500}
        size={31}
        desde={0}
        titulo="consola · cada línea muestra su resultado"
        lineas={[
          { at: 4, py: "np.zeros(5)", res: "array([0., 0., 0., 0., 0.])", resAt: f2.at + 20 },
          { at: 14, py: "np.ones(3)", res: "array([1., 1., 1.])", resAt: f2.at + 50 },
          { at: f2.at + 170, py: "np.full(4, 7)", res: "array([7, 7, 7, 7])" },
          { at: f3.at + 10, py: "np.arange(0, 10, 2)", res: "array([0, 2, 4, 6, 8])" },
          { at: f4.at + 20, py: "np.linspace(0, 1, 5)", res: "array([0.  , 0.25, 0.5 , 0.75, 1.  ])" },
          { at: f5.at + 10, py: "rng = np.random.default_rng(42)" },
          { at: f5.at + 60, py: "rng.integers(1, 7, size=10)", res: "array([1, 5, 4, 3, 3, 6, 1, 5, 2, 1])" },
        ]}
      />
      <div style={{ position: "relative", width: 1640, flex: 1 }}>
        <Fase desde={f3.at} hasta={f5.at + 70}>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
            <Recta titulo="arange(0, 10, 2) · paso 2" at={f3.at + 30} puntos={[0, 2, 4, 6, 8]} max={10} fuera={10} etiquetas={["0", "2", "4", "6", "8"]} />
            <Recta titulo="linspace(0, 1, 5) · 5 números" at={f4.at + 40} puntos={[0, 0.25, 0.5, 0.75, 1]} max={1} etiquetas={["0", "0.25", "0.5", "0.75", "1"]} />
          </div>
        </Fase>
        <Fase desde={f5.at + 70}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", gap: 22 }}>
            {[1, 5, 4, 3, 3, 6, 1, 5, 2, 1].map((v, i) => (
              <Dado key={i} v={v} at={f5.at + 75 + i * 4} />
            ))}
          </div>
        </Fase>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8 · Graficar

const HIST = guion.escenas.find((e) => e.id === "graficar")!.datos!.hist_conteos as number[];

const Histograma: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const w = 640;
  const h = 210;
  const max = Math.max(...HIST);
  const bw = w / HIST.length;
  return (
    <svg width={w + 60} height={h + 60}>
      <line x1={20} y1={h} x2={w + 30} y2={h} stroke={C.dim} strokeWidth={3} />
      {HIST.map((c, i) => {
        const p = interpolate(frame, [at + i * 2, at + i * 2 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bh = (c / max) * (h - 10) * p;
        return <rect key={i} x={25 + i * bw} y={h - bh} width={bw - 4} height={bh} rx={4} fill={C.yellow} />;
      })}
      {[
        ["144 cm", 0],
        ["170", 0.557],
        ["190 cm", 1],
      ].map(([t, f]) => (
        <text key={t as string} x={25 + (f as number) * (w - 4)} y={h + 40} textAnchor={f === 0 ? "start" : f === 1 ? "end" : "middle"} fontFamily={MONO} fontSize={24} fill={C.dim}>
          {t}
        </text>
      ))}
    </svg>
  );
};

const Graficar: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3, p4] = lineas;
  const trazo = useP(p3.at + 20, p3.at + 70, false);
  return (
    <Split
      ratio={0.48}
      left={
        <>
          <Celda
            ancho={860}
            size={28}
            desde={0}
            lineas={[
              { at: p1.at, py: "import matplotlib.pyplot as plt" },
              { at: p2.at + 20, py: "x = np.linspace(0, 2 * np.pi, 100)" },
              { at: p2.at + 110, py: "y = np.sin(x)" },
              { at: p3.at, py: "plt.plot(x, y)" },
              { at: p3.at + 20, py: "plt.show()" },
            ]}
          />
          <Celda
            ancho={860}
            size={28}
            n={2}
            desde={0}
            lineas={[
              { at: p4.at + 5, py: "rng = np.random.default_rng(7)" },
              { at: p4.at + 40, py: "alturas = rng.normal(170, 8, size=1000)" },
              { at: p4.at + 115, py: "plt.hist(alturas, bins=20)" },
              { at: p4.at + 135, py: "plt.show()" },
            ]}
          />
        </>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <Aparece at={p2.at + 20}>
            <Plano w={620} h={210} x={[0, 6.4]} y={[-1.2, 1.2]} paso={1} pasoY={1} etiquetaX="x" etiquetaY="sin(x)">
              {(e) => <Curva e={e} f={Math.sin} x={[0, 2 * Math.PI]} p={trazo} color={C.blue} />}
            </Plano>
          </Aparece>
          <Aparece at={p4.at + 115}>
            <Histograma at={p4.at + 125} />
          </Aparece>
        </div>
      }
    />
  );
};

// ---------------------------------------------------------------- 9 · Ejemplos

const Tarjeta: React.FC<{ at: number; n: number; tipo: string; color: string; titulo: string; dato: string; children: React.ReactNode }> = ({
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

const Res: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.green }) => (
  <Mono size={24} color={color}>
    {children}
  </Mono>
);

const Ejemplos: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [, e2, e3] = lineas;
  const dias = ["L", "M", "M", "J", "V", "S", "D"];
  const meta = [false, false, true, false, true, false, false];
  return (
    <>
      <Stage direction="row" gap={36}>
        <Tarjeta at={0} n={1} tipo="INDUSTRIA" color={C.coral} titulo="Sensor de temperatura" dato="De °C a °F, todas a la vez">
          <Fijo texto="temp_c * 9 / 5 + 32" size={26} />
          <Res>[70.7  73.4  67.64 77.18]</Res>
        </Tarjeta>
        <Tarjeta at={e2.at} n={2} tipo="CIENCIA" color={C.blue} titulo="Caída libre" dato="Distancia: d = 4.9 · t²">
          <Fijo texto="t = np.linspace(0, 2, 5)" size={26} />
          <Fijo texto="4.9 * t**2" size={26} />
          <Res>{"[ 0.     1.225  4.9\n 11.025 19.6  ]"}</Res>
        </Tarjeta>
        <Tarjeta at={e3.at} n={3} tipo="DÍA A DÍA" color={C.yellow} titulo="Pasos de tu semana" dato="Total y días con 10,000 o más">
          <Fijo texto="pasos.sum()" size={26} />
          <Res>56550</Res>
          <Fijo texto="pasos >= 10000" size={26} />
          <div style={{ display: "flex", gap: 8 }}>
            {dias.map((d, i) => {
              const on = meta[i] && frame >= e3.at + 150;
              return (
                <div
                  key={i}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    background: on ? C.green : C.bg2,
                    color: on ? C.bg : C.dim,
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </Tarjeta>
      </Stage>
      <Nota>Ejemplos simplificados (caída libre sin resistencia del aire)</Nota>
    </>
  );
};

// ---------------------------------------------------------------- 10 · Plus

const Tabla: React.FC<{ resalta: boolean }> = ({ resalta }) => {
  const filas = [
    ["precio", "cantidad"],
    ["10", "3"],
    ["25", "1"],
    ["7", "5"],
  ];
  return (
    <div style={{ display: "flex", gap: 0, fontFamily: MONO, fontSize: 40 }}>
      {[0, 1].map((col) => (
        <div
          key={col}
          style={{
            display: "flex",
            flexDirection: "column",
            border: `3px solid ${col === 1 && resalta ? C.purple : C.dim + "44"}`,
            background: col === 1 && resalta ? `${C.purple}22` : `${C.bg2}aa`,
            borderRadius: 14,
            marginLeft: col === 1 ? 14 : 0,
            translate: col === 1 && resalta ? "20px 0px" : "0px 0px",
          }}
        >
          {filas.map((f, i) => (
            <div key={i} style={{ padding: "12px 34px", color: i === 0 ? C.dim : C.ink, fontWeight: 700, borderBottom: i < 3 ? `1px solid ${C.dim}22` : "none" }}>
              {f[col]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const frame = useCurrentFrame();
  const [q1, q2, q3] = lineas;
  const items = ["Revisar los tipos (dtype)", "Convertir con astype", "Valores faltantes", "Duplicados"];
  return (
    <>
      <PlusDatos />
      <Fase desde={0} hasta={q2.at}>
        <Split
          ratio={0.4}
          left={
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
              <Chip bg={C.blue} color={C.ink} size={26}>
                tabla de pandas (df)
              </Chip>
              <Tabla resalta={frame >= q1.at + 90} />
            </div>
          }
          right={
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Consola at={q1.at + 100} texto='df["cantidad"].to_numpy()' size={40} />
              <Aparece at={q1.at + 135}>
                <Mono size={40} color={C.green}>
                  array([3, 1, 5])
                </Mono>
              </Aparece>
              <Consola at={q1.at + 160} texto='df["cantidad"].dtype' size={40} />
              <Aparece at={q1.at + 190}>
                <Mono size={40} color={C.green}>
                  dtype('int64')
                </Mono>
              </Aparece>
            </div>
          }
        />
      </Fase>
      <Fase desde={q2.at} hasta={q3.at}>
        <Stage gap={30}>
          <Words text="*1,000,000* de enteros" size={84} accent={C.yellow} delay={q2.at} />
          <Barra label="int64" valor={8} max={8} unidad="MB" dec={0} color={C.coral} at={q2.at + 60} />
          <Barra label="int8" valor={1} max={8} unidad="MB" dec={0} color={C.green} at={q2.at + 130} />
          <Aparece at={q2.at + 150}>
            <Mono size={28} color={C.dim}>
              np.zeros(1_000_000, dtype=np.int8).nbytes → 1000000
            </Mono>
          </Aparece>
        </Stage>
      </Fase>
      <Fase desde={q3.at}>
        <Stage gap={24}>
          <Words text="Limpieza de datos: *paso 1*" size={76} accent={C.purple} delay={q3.at} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((t, i) => {
              const on = i < 2 && frame >= q3.at + 40 + i * 20;
              return (
                <Aparece key={t} at={q3.at + 10 + i * 8}>
                  <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: i < 2 ? C.ink : C.dim }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 12,
                        border: `4px solid ${on ? C.green : C.dim}`,
                        background: on ? C.green : "transparent",
                        color: C.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                      }}
                    >
                      {on ? "✓" : ""}
                    </div>
                    {t}
                  </div>
                </Aparece>
              );
            })}
          </div>
        </Stage>
      </Fase>
    </>
  );
};

// ---------------------------------------------------------------- 11 · Reto y cierre

const ESCALONES = Array.from({ length: 50 }, (_, i) => Math.floor((10 * i) / 49));

const Reto: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r3] = lineas;
  const p = useP(r2.at, r2.at + 45, false);
  return (
    <>
      <Seccion bg={C.yellow}>RETO · NOTEBOOK</Seccion>
      <RetoResumen
        atReto={r1.at}
        atResumen={r3.at}
        durResumen={r3.frames}
        reto={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Consola at={r1.at + 15} texto="x = np.linspace(0, 10, 50).astype(int)" size={40} prompt="" />
            <Consola at={r1.at + 75} texto="plt.plot(x)   # ¿por qué sale en escalones?" size={40} prompt="" />
            <Plano w={600} h={190} x={[0, 50]} y={[0, 10]} paso={10} pasoY={5} etiquetaX="i" etiquetaY="x">
              {(e) => (
                <polyline
                  points={ESCALONES.slice(0, Math.max(1, Math.round(50 * p)))
                    .map((v, i) => `${e.X(i)},${e.Y(v)}`)
                    .join(" ")}
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={5}
                  strokeLinejoin="round"
                  opacity={p > 0 ? 1 : 0}
                />
              )}
            </Plano>
          </div>
        }
        ideas={["Un arreglo guarda datos juntos y del mismo tipo (dtype)", "Opera con todos a la vez, sin ciclos for", "Se fabrica y se grafica con una línea"]}
      />
    </>
  );
};

const CierreN01: React.FC<EscenaProps> = (props) => (
  <>
    <CierreCurso {...props} titulo="Seguimos con los *arreglos*" sub="Próximo video | Numpy 1D" />
    {props.lineas[1].at > 0 && <CierreAviso hasta={props.lineas[1].at} />}
  </>
);

const CierreAviso: React.FC<{ hasta: number }> = ({ hasta }) => (
  <Fase desde={0} hasta={hasta}>
    <AvisoNotebook at={20} ruta={NB} />
  </Fase>
);

export const N01 = leerGuion(guion);

export const N01ListasArreglos: React.FC = () => (
  <VideoLargo
    guion={N01}
    escenas={{
      gancho: Gancho,
      sello: Sello,
      teoria: Teoria,
      primero: Primero,
      diferencias: Diferencias,
      tipos: Tipos,
      astype: Astype,
      fabrica: Fabrica,
      graficar: Graficar,
      ejemplos: Ejemplos,
      plus: Plus,
      reto: Reto,
      cierre: CierreN01,
    }}
  />
);

