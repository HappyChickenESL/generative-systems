import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { ForestScene } from "./components/Forest";
import {
  createTerrainSampler,
  generateForestData,
  type ForestData,
} from "./unwahrscheinlich.utils";

const createSeed = () => {
  const values = new Uint32Array(1);

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    crypto.getRandomValues(values);
    return values[0].toString(36);
  }

  return `${Date.now().toString(36)}-${performance.now().toFixed(0)}`;
};

const Unwahrscheinlich = () => {
  const [seed, setSeed] = useState(createSeed);

  const terrainSampler = useMemo(() => createTerrainSampler(seed), [seed]);
  const forestData: ForestData = useMemo(
    () => generateForestData(seed, terrainSampler),
    [seed, terrainSampler],
  );

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2 mx-2">
        <button
          type="button"
          className="hover:font-bold cursor-pointer text-white border-white border rounded-sm p-1"
          onClick={() => setSeed(createSeed())}
        >
          Regenerate
        </button>
      </div>
      <div className="flex-1 border-4 rounded-sm">
        <Canvas
          camera={{ position: [34, 28, 34], fov: 50, near: 0.1, far: 300 }}
        >
          <ForestScene
            forestData={forestData}
            terrainSampler={terrainSampler}
          />
        </Canvas>
      </div>
    </div>
  );
};

export const unwahrscheinlichRoute = createRoute({
  component: Unwahrscheinlich,
  path: "/unwahrscheinlich",
  getParentRoute: () => rootRoute,
});
