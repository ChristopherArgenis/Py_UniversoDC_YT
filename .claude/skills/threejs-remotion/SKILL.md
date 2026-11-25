---
name: threejs-remotion
description: Modelado y animación 3D con Three.js DENTRO de los videos de Remotion de este repo (@remotion/three + React Three Fiber). Úsala cuando una escena se explique mejor en 3D — arreglos de NumPy en 1D/2D/3D, tensores, superficies z = f(x, y), nubes de puntos, clusters, matrices como bloques, ejes x/y/z, rotaciones, vectores — o cuando el usuario pida "3D", "Three.js", "modelo 3D", "cubo de datos" o "que gire la cámara". No la uses para lo que se ve igual o mejor en 2D (barras, líneas, tablas, código).
---

# Three.js en los videos (Remotion)

El repo ya trae `@remotion/three`, `three` y `@react-three/fiber` (MIT, gratis) y las piezas en
`src/kit/tres.tsx`. Para teoría general de Three.js (instancing, materiales, GLTF, disposal) ver la skill
`threejs-animation` (iart-ai); **esta** skill manda sobre ella en todo lo que tenga que ver con el tiempo.

## Cuándo usar 3D (y cuándo no)
Usa 3D solo si aporta comprensión: la tercera dimensión ES el concepto.
- Sí: `shape` y `ndim` de arreglos (1D fila → 2D tabla → 3D cubo), ejes `axis=0/1/2` de NumPy,
  imágenes RGB (alto × ancho × 3 canales), tensores, `reshape`, broadcasting en 3D, superficies de una función de
  dos variables, nubes de puntos y clusters (k-means), PCA (rotar la nube), producto punto/vectores.
- No: barras, líneas, tablas, código, texto. Ahí el 2D del kit es más claro y más barato de renderizar.
- Máximo 1–2 escenas 3D por video. Decláralo en el plan del guion ("pantalla": "Three.js: …").

## Regla de oro: el tiempo sale de `useCurrentFrame()`
Remotion renderiza cada fotograma por separado y en paralelo. Por eso:
- **Prohibido** `useFrame`, `THREE.Clock`, `clock.getDelta()`, `requestAnimationFrame`, `setAnimationLoop`,
  `Date.now()` y física acumulada. Todo estado = función pura del frame.
- Movimiento con `interpolate()` / `spring()` de `remotion` usando `useCurrentFrame()` y `fps`.
- Aleatoriedad solo con semilla: `semilla(42)` de `src/kit/tres.tsx` (nunca `Math.random()`).
- `AnimationMixer` de un GLTF: `mixer.setTime(frame / fps)` (absoluto), nunca `mixer.update(dt)`.
- Cámara: se mueve con `useThree((s) => s.camera)` + `useLayoutEffect` según el frame (ver `Camara` en
  `tres.tsx`). `<perspectiveCamera makeDefault>` es de drei y no está instalado.

## Piezas listas (`src/kit/tres.tsx`)
```tsx
import { Arreglo3D, Escena3D, colorValor, semilla } from "../kit/tres";

// Lienzo 3D a pantalla completa, luces del canal y cámara que orbita `orbita` grados/seg.
<Escena3D orbita={10} dist={11} altura={4.5}>
  {/* Arreglo NumPy como bloques: [n] 1D, [filas, cols] 2D, [capas, filas, cols] 3D.
      Aparecen uno a uno desde `at`; `resaltar` pinta de coral los que cumplen (ej. una columna). */}
  <Arreglo3D forma={[3, 3, 6]} at={0} ritmo={1.2} resaltar={(i, j, k) => k === 2} atResaltar={60} />
</Escena3D>
```
- `orbita` cuenta desde el frame 0 de la ESCENA, no desde que aparece el 3D: si el 3D entra a mitad de escena
  (dentro de una `Fase`), usa `orbita={0}` o compensa `anguloInicial`; si no, la cámara ya giró y se ve de lado.
- `ThreeCanvas` SIEMPRE lleva `width` y `height` (lo pone `Escena3D`; para miniaturas pásalos, p. ej. 520×520).
- El texto (etiquetas, `shape`, chips) va en HTML **encima** del lienzo (`AbsoluteFill` + `Chip`), no en 3D:
  se lee mejor, usa las fuentes del canal y no necesita cargar fuentes 3D.
- Colores: solo los del tema (`C` en `theme.ts`). Escala de valores: `colorValor(v)` azul → verde → amarillo;
  resaltado = `C.coral`. Mismo código de colores que el resto del curso.
- Para cambiar de forma (1D → 2D → 3D) usa `key={forma.join("x")}` para que los bloques vuelvan a entrar.
- Muchos objetos (> 500): usa `InstancedMesh` (ver skill `threejs-animation`) y fija las matrices según el frame.
- Geometrías/materiales creados con `new THREE.X()` van en `useMemo` (ver `Arreglo3D`).

## Escribir una pieza 3D nueva
```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Superficie: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 200 } }); // 0 → 1, puro
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(6, 6, 60, 60);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, Math.sin(x) * Math.cos(y));          // z = f(x, y)
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, Math.max(0.001, p)]}>
      <meshStandardMaterial color={C.blue} side={THREE.DoubleSide} roughness={0.5} />
    </mesh>
  );
};
```
Ponla en `src/kit/tres.tsx` si se va a reutilizar; si es de un solo video, en su archivo de `src/videos/`.

## Verificar (obligatorio antes de dar la escena por buena)
1. `npm run lint` (eslint + tsc).
2. Fotogramas al inicio, a la mitad y al final de la escena 3D:
   `npx remotion still <Comp> out/f/3d-a.png --frame=<N>` (el Chromium del entorno ya trae WebGL por software).
3. Revisar: lienzo no negro/vacío (si sale vacío, error de WebGL o cámara mirando a otro lado), nada cortado,
   no tapa subtítulos (franja inferior) ni la barra de capítulos (franja superior), texto encima legible.
4. Mismo frame dos veces → misma imagen (si cambia, hay algo que no depende del frame).
5. `scripts/iart/contact-sheet.sh hoja.png a.png b.png c.png` para verlos juntos.
6. El render 3D es más lento: si una escena tarda mucho, baja segmentos de geometría o usa instancing.
