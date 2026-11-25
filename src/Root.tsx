import { Composition, Folder, Still } from "remotion";
import { FPS, H, W } from "./kit/theme";
import { planificar } from "./kit/largo";
import { MINI_H, MINI_W } from "./kit/miniatura";
import { Plantilla, PLANTILLA } from "./videos/Plantilla";
import { N01, N01ListasArreglos } from "./videos/N01ListasArreglos";
import { N02, N02IndicesCortes } from "./videos/N02IndicesCortes";
import { N03, N03Vectorizadas } from "./videos/N03Vectorizadas";
import { MiniN01, MiniN02, MiniN03, MiniPlantilla } from "./miniaturas/Miniaturas";

// Cada video largo: <Composition id="NN-Nombre"> con la duración que sale de su guion.
// Cada miniatura: <Still id="Mini-NN-Nombre"> de 1280×720.
// Una carpeta (<Folder>) por serie, con el mismo nombre que su carpeta en Notebook/.

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Videos">
      <Composition
        id="00-Plantilla"
        component={Plantilla}
        durationInFrames={planificar(PLANTILLA).total}
        fps={FPS}
        width={W}
        height={H}
      />
    </Folder>
    <Folder name="Numpy-1D">
      <Composition
        id="N01-ListasArreglos"
        component={N01ListasArreglos}
        durationInFrames={planificar(N01).total}
        fps={FPS}
        width={W}
        height={H}
      />
      <Still id="Mini-N01-ListasArreglos" component={MiniN01} width={MINI_W} height={MINI_H} />
      <Composition
        id="N02-IndicesCortes"
        component={N02IndicesCortes}
        durationInFrames={planificar(N02).total}
        fps={FPS}
        width={W}
        height={H}
      />
      <Still id="Mini-N02-IndicesCortes" component={MiniN02} width={MINI_W} height={MINI_H} />
      <Composition
        id="N03-Vectorizadas"
        component={N03Vectorizadas}
        durationInFrames={planificar(N03).total}
        fps={FPS}
        width={W}
        height={H}
      />
      <Still id="Mini-N03-Vectorizadas" component={MiniN03} width={MINI_W} height={MINI_H} />
    </Folder>
    <Folder name="Miniaturas">
      <Still id="Mini-00-Plantilla" component={MiniPlantilla} width={MINI_W} height={MINI_H} />
    </Folder>
  </>
);
