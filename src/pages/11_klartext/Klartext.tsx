import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Word } from "./components/Word";

const Klartext = () => {
  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1 border-4">
        <Canvas>
          <OrthographicCamera makeDefault zoom={90} position={[0, 0, 10]} />
          <Word
            obfuscationAmount={0.9}
            position={[-4.5, 0, 0]}
            text="ICH"
          ></Word>
          <Word
            obfuscationAmount={0.4}
            position={[1.5, 0, 0]}
            text="WAR"
          ></Word>
          <Word
            obfuscationAmount={0.3}
            position={[-4.5, -3, 0]}
            text="HIER"
          ></Word>
        </Canvas>
      </div>
    </div>
  );
};

export const klartextRoute = createRoute({
  component: Klartext,
  path: "/klartext",
  getParentRoute: () => rootRoute,
});
