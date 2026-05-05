import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import type { JSX } from "react";
import { Tree } from "./components/Tree";
import { OrbitControls } from "@react-three/drei";

const Unwahrscheinlich = () => {
  const arr: JSX.Element[] = [];

  // for (let i = 0; i < 20; i++) {
  //   arr.push(
  //     <Tree
  //       key={i}
  //       x={randomMinMax(-10, 10)}
  //       y={0}
  //       z={randomMinMax(-10, 10)}
  //       size={1}
  //     ></Tree>,
  //   );
  // }

  arr.push(<Tree key={1} x={0} y={0} z={0} size={1}></Tree>);

  return (
    // <Canvas camera={{ position: [0, 20, 50], fov: 50 }}>
    <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
      <OrbitControls></OrbitControls>
      <ambientLight />
      {arr}
    </Canvas>
  );
};

export const unwahrscheinlichRoute = createRoute({
  component: Unwahrscheinlich,
  path: "/unwahrscheinlich",
  getParentRoute: () => rootRoute,
});

function randomMinMax(min: number, max: number) {
  return gaussianRandom() * (max - min) + min;
}

function gaussianRandom() {
  const mean = 0;
  const stdev = 1;
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}
