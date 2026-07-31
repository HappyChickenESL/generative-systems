import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Letter } from "./components/Letter";

const Klartext = () => {
  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1 border-4">
        <Canvas>
          <OrthographicCamera makeDefault zoom={90} position={[0, 0, 10]} />
          <Letter character="T" position={[-4.5, 0, 0]} />
          <Letter character="E" position={[-3, 0, 0]} />
          <Letter character="S" position={[-1.5, 0, 0]} />
          <Letter character="T" position={[0, 0, 0]} />
          <Letter character="R" position={[1.5, 0, 0]} />
          <Letter character="Q" position={[3, 0, 0]} />
          <Letter character="K" position={[4.5, 0, 0]} />
          <Letter character="#" position={[6, 0, 0]} />
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
