import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { C } from "./theme";

// Piezas 3D con Three.js dentro de Remotion (@remotion/three, MIT, gratis).
// Regla de oro: TODO movimiento sale de useCurrentFrame(). Nada de useFrame/clock/Math.random sin semilla:
// cada fotograma se renderiza por separado y en paralelo, así que el estado debe depender solo del frame.
// Ver .claude/skills/threejs-remotion/SKILL.md.

/**
 * Lienzo 3D con luces y cámara que orbita despacio.
 * `orbita` = grados que gira la cámara por segundo (0 = fija). `dist` = distancia de la cámara.
 */
export const Escena3D: React.FC<{
  width?: number;
  height?: number;
  orbita?: number;
  dist?: number;
  altura?: number;
  anguloInicial?: number;
  objetivo?: [number, number, number];
  /** Campo de visión vertical en grados (bajo = menos deformación, para filas largas en lienzos bajos). */
  fov?: number;
  children: React.ReactNode;
}> = ({ width = 1920, height = 1080, orbita = 8, dist = 9, altura = 4, anguloInicial = 35, objetivo = [0, 0, 0], fov = 40, children }) => (
  <ThreeCanvas width={width} height={height} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, alpha: true }} dpr={1} camera={{ fov, near: 0.1, far: 200 }}>
    <Camara orbita={orbita} dist={dist} altura={altura} anguloInicial={anguloInicial} objetivo={objetivo} />
    <ambientLight intensity={0.55} />
    <directionalLight position={[6, 10, 8]} intensity={1.6} />
    <directionalLight position={[-6, 4, -4]} intensity={0.5} color={C.blue} />
    {children}
  </ThreeCanvas>
);

const Camara: React.FC<{ orbita: number; dist: number; altura: number; anguloInicial: number; objetivo: [number, number, number] }> = ({
  orbita,
  dist,
  altura,
  anguloInicial,
  objetivo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ang = ((anguloInicial + (orbita * frame) / fps) * Math.PI) / 180;
  const camera = useThree((st) => st.camera);
  const invalidate = useThree((st) => st.invalidate);
  useLayoutEffect(() => {
    camera.position.set(objetivo[0] + Math.sin(ang) * dist, objetivo[1] + altura, objetivo[2] + Math.cos(ang) * dist);
    camera.lookAt(...objetivo);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, ang, dist, altura, objetivo]);
  return null;
};

/** Color por valor (0–1) en la escala del canal: azul → verde → amarillo. */
export const colorValor = (v: number) => {
  const a = new THREE.Color(C.blue);
  const b = new THREE.Color(C.green);
  const c = new THREE.Color(C.yellow);
  return v < 0.5 ? a.lerp(b, v * 2) : b.clone().lerp(c, (v - 0.5) * 2);
};

/** Generador pseudoaleatorio con semilla (mismos valores en cada frame y cada render). */
export const semilla = (s: number) => () => {
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
};

/**
 * Un arreglo de NumPy como bloques 3D. `forma` = [n] (1D), [filas, cols] (2D) o [capas, filas, cols] (3D).
 * Los bloques aparecen uno a uno desde el frame `at`; `resaltar(i, j, k)` pinta de coral los que cumplan.
 * El eje 0 de NumPy va hacia el fondo (capas), el 1 hacia abajo (filas) y el 2 a la derecha (columnas).
 */
export const Arreglo3D: React.FC<{
  forma: number[];
  at?: number;
  /** Frames entre bloque y bloque. */
  ritmo?: number;
  valores?: (i: number, j: number, k: number) => number;
  resaltar?: (i: number, j: number, k: number) => boolean;
  atResaltar?: number;
  lado?: number;
  hueco?: number;
}> = ({ forma, at = 0, ritmo = 1.5, valores, resaltar, atResaltar = 0, lado = 0.8, hueco = 0.18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [D, R, K] = forma.length === 1 ? [1, 1, forma[0]] : forma.length === 2 ? [1, forma[0], forma[1]] : [forma[0], forma[1], forma[2]];
  const paso = lado + hueco;
  const geo = useMemo(() => new THREE.BoxGeometry(lado, lado, lado), [lado]);
  const bloques: React.ReactNode[] = [];
  let n = 0;
  for (let i = 0; i < D; i++)
    for (let j = 0; j < R; j++)
      for (let k = 0; k < K; k++) {
        const s = spring({ frame: frame - at - n * ritmo, fps, config: { damping: 14, mass: 0.6 } });
        const on = resaltar?.(i, j, k) && frame >= atResaltar;
        const v = valores ? valores(i, j, k) : (k + j * K) / Math.max(1, R * K - 1);
        const x = (k - (K - 1) / 2) * paso;
        const y = ((R - 1) / 2 - j) * paso + interpolate(s, [0, 1], [1.5, 0]);
        const z = (i - (D - 1) / 2) * -paso;
        bloques.push(
          <mesh key={`${i}-${j}-${k}`} geometry={geo} position={[x, y, z]} scale={Math.max(0.001, s)}>
            <meshStandardMaterial color={on ? C.coral : colorValor(v)} roughness={0.45} metalness={0.05} emissive={on ? C.coral : "#000"} emissiveIntensity={on ? 0.35 : 0} />
          </mesh>,
        );
        n++;
      }
  return <group>{bloques}</group>;
};
