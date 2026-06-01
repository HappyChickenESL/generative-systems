import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../main";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useMemo, useState, type JSX } from "react";
import { ShapeMorph } from "./ShapeMorth";

const Shapes = () => {
  const [scale, setScale] = useState(0.5);

  const [confirmedScale, setConfirmedScale] = useState(0.5);

  const [delay, setDelay] = useState(500);
  const [confirmedDelay, setConfirmedDelay] = useState(500);

  const [maxEdges, setMaxEdges] = useState(8);
  const [confirmedMaxEdges, setConfirmedMaxEdges] = useState(8);

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2">
        <div className="flex flex-col">
          <label htmlFor="scaleInput">Scale</label>
          <input
            id="scaleInput"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            type="number"
            className="bg-white w-20"
          ></input>
        </div>
        <div className="flex flex-col">
          <label htmlFor="delayInput">Delay</label>
          <input
            id="delayInput"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            type="number"
            className="bg-white w-20"
          ></input>
        </div>
        <div className="flex flex-col">
          <label htmlFor="edgesInput">Max Edges</label>
          <input
            id="edgesInput"
            value={maxEdges}
            onChange={(e) => {
              let newvalue = Number(e.target.value);
              setMaxEdges(newvalue <= 4 ? 5 : newvalue);
            }}
            type="number"
            className="bg-white w-20"
          ></input>
        </div>
        <div>
          <button
            className="hover:font-bold"
            onClick={() => {
              setConfirmedScale(scale);
              setConfirmedMaxEdges(maxEdges);
              setConfirmedDelay(delay);
            }}
          >
            Reload
          </button>
        </div>
      </div>
      <div className="flex-1">
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

const HookWrapper = ({
  scale,
  delay,
  maxEdges,
}: {
  scale: number;
  delay: number;
  maxEdges: number;
}) => {
  const { viewport } = useThree();

  const shapes = useMemo(() => {
    const result: JSX.Element[] = [];

    const maxCountX = Math.ceil(viewport.width * (1 / scale) * 0.4);
    const maxCountY = Math.ceil(viewport.height * (1 / scale) * 0.4);

    for (let i = 0; i < maxCountX; i++) {
      for (let j = 0; j < maxCountY; j++) {
        result.push(
          <ShapeMorph
            key={`${i}-${j}`}
            x={i * 2.5 * scale}
            y={-j * 2.5 * scale}
            scale={scale}
            maxEdges={Math.floor(maxEdges)}
            delay={Math.ceil(delay)}
          />,
        );
      }
    }

    return result;
  }, [viewport.width, viewport.height, scale, maxEdges, delay]);

  const topLeft = {
    x: -viewport.width / 2,
    y: viewport.height / 2,
  };

  return <mesh position={[topLeft.x, topLeft.y, 0]}>{...shapes}</mesh>;
};

export const shapesRoute = createRoute({
  component: Shapes,
  path: "/shapes",
  getParentRoute: () => rootRoute,
});
