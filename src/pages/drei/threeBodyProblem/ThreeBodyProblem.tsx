import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../main";
import { Planet } from "./Planet";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useWorld } from "./world.store";

const ThreeBodyProblem = () => {
  const worldState = useWorld();

  return (
    <div className="w-full h-full flex">
      <div className="w-60">
        {Object.entries(worldState.bodies).map(([key, value]) => {
          return (
            <div key={key} className="flex flex-row">
              <div>{key}</div>
              <div>{value.position}</div>
            </div>
          );
        })}
      </div>
      <div className="flex-1">
        <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
          <OrbitControls></OrbitControls>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Planet id="earth"></Planet>
          <Planet id="moon"></Planet>
          <Planet id="jupiter"></Planet>
        </Canvas>
      </div>
    </div>
  );
};

export const threeBodyProblemRoute = createRoute({
  component: ThreeBodyProblem,
  path: "/bodyProblem/3",
  getParentRoute: () => rootRoute,
});
