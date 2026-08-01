import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState, type JSX } from "react";
import { Splash3 } from "./components/Splash3";
import { OrbitControls } from "@react-three/drei";
import { minMaxRand } from "../../shared/utils";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";

const Farbfleck = () => {
  const [cubes, setCubes] = useState<JSX.Element[]>([]);
  const [count, setCount] = useState(500);

  const generate = () => {
    const arr: JSX.Element[] = [];

    for (let i = 0; i < count; i++) {
      arr.push(
        <Splash3
          key={i}
          x={minMaxRand(-10, 10)}
          y={minMaxRand(-10, 10)}
          z={minMaxRand(-10, 10)}
          size={1}
        ></Splash3>,
      );
    }

    setCubes(arr);
  };

  useEffect(generate, []);

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-10 m-4">
        <Input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          label="Count"
        ></Input>
        <Button type="button" onClick={generate}>
          Regenerate
        </Button>
      </div>
      <div className="flex-1 border-4 rounded-xl p-1">
        <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
          <OrbitControls></OrbitControls>
          <ambientLight />
          {cubes}
        </Canvas>
      </div>
    </div>
  );
};

export const farbfleckRoute = createRoute({
  component: Farbfleck,
  path: "/farbfleck",
  getParentRoute: () => rootRoute,
});
