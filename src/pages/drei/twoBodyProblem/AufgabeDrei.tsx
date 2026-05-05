import { Canvas } from "@react-three/fiber";
import { Body } from "./components/Body";
import { useBodyOne, useBodyTwo } from "./body.store";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../main";

export const AufgabeDrei = () => {
  const bodyOne = useBodyOne();
  const bodyTwo = useBodyTwo();

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Body {...bodyOne} otherPos={bodyTwo.position} otherMass={bodyTwo.mass} />

      <Body {...bodyTwo} otherPos={bodyOne.position} otherMass={bodyOne.mass} />
    </Canvas>
  );
};

export const bodyProblemRoute = createRoute({
  component: AufgabeDrei,
  path: "/bodyProblem",
  getParentRoute: () => rootRoute,
});
