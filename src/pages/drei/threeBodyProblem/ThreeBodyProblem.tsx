import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../main";
import { Planet } from "./Planet";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ThreeBodyProblem = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <OrbitControls></OrbitControls>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Planet id="earth"></Planet>
      <Planet id="moon"></Planet>
    </Canvas>
  );
};

export const threeBodyProblemRoute = createRoute({
  component: ThreeBodyProblem,
  path: "/bodyProblem/3",
  getParentRoute: () => rootRoute,
});
