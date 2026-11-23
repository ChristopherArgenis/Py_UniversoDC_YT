import React from "react";
import { C } from "../kit/theme";
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

export const MiniN01: React.FC = () => (
  <FondoMini accent={C.blue}>
    <MiniSplit
      texto={
        <>
          <ChipMini bg={C.blue} color={C.ink}>
            NUMPY 1D
          </ChipMini>
          <Grande size={128} color={C.coral}>
            [1,2,3]
          </Grande>
          <Grande size={150} color={C.yellow}>
            × 2 = ?
          </Grande>
        </>
      }
      visual={
        <div style={{ position: "relative", width: 520, height: 520 }}>
          <Escena3D width={520} height={520} orbita={0} dist={9} altura={4} anguloInicial={30}>
            <Arreglo3D forma={[5]} at={-200} lado={1.1} hueco={0.08} />
          </Escena3D>
        </div>
      }
    />
  </FondoMini>
);
