import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useState } from "react";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { HookWrapper } from "./components/HookWrapper";

const Loops = () => {
  const [scale, setScale] = useState(0.5);

  const [confirmedScale, setConfirmedScale] = useState(0.5);

  const [delay, setDelay] = useState(500);
  const [confirmedDelay, setConfirmedDelay] = useState(500);

  const [maxEdges, setMaxEdges] = useState(8);
  const [confirmedMaxEdges, setConfirmedMaxEdges] = useState(8);

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-10 m-4">
        <div className="flex flex-col space-y-2">
          <Input
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            type="number"
            label="Scale"
          ></Input>
          <Input
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            type="number"
            label="Delay (ms)"
          ></Input>
          <Input
            value={maxEdges}
            onChange={(e) => {
              let newvalue = Number(e.target.value);
              setMaxEdges(newvalue <= 4 ? 5 : newvalue);
            }}
            type="number"
            label="Max Edges (3-10)"
            max={10}
            min={3}
          ></Input>
        </div>

        <Button
          type="button"
          onClick={() => {
            setConfirmedScale(scale);
            setConfirmedMaxEdges(maxEdges);
            setConfirmedDelay(delay);
          }}
        >
          Reload
        </Button>
      </div>
      <div className="flex-1 border-4 rounded-xl p-1">
        <Canvas>
          <OrthographicCamera makeDefault zoom={120} position={[0, 0, 10]} />
          <HookWrapper
            delay={confirmedDelay}
            maxEdges={confirmedMaxEdges}
            scale={confirmedScale}
          ></HookWrapper>
        </Canvas>
      </div>
    </div>
  );
};

export const loopsRoute = createRoute({
  component: Loops,
  path: "/loops",
  getParentRoute: () => rootRoute,
});
