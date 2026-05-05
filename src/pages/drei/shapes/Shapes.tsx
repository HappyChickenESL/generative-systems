import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../main";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useMemo, useState, type JSX } from "react";
import { ShapeMorph } from "./ShapeMorth";

const Shapes = () => {
  const [scale, setScale] = useState(0.5);

  const [confirmedScale, setConfirmedScale] = useState(0.5);

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col">
        <div>
          <input
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            type="number"
            className="bg-white w-20"
            title="hi"
          ></input>
        </div>
        <div>
          <button onClick={() => setConfirmedScale(scale)}>Reload</button>
        </div>
      </div>
      <div className="flex-1">
        <Canvas>
          <OrthographicCamera makeDefault zoom={120} position={[0, 0, 10]} />
          <HookWrapper scale={confirmedScale}></HookWrapper>
        </Canvas>
      </div>
    </div>
  );
};

const HookWrapper = ({ scale }: { scale: number }) => {
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
          />,
        );
      }
    }

    return result;
  }, [viewport.width, viewport.height, scale]);

  const topLeft = {
    x: -viewport.width / 2,
    y: viewport.height / 2,
  };

  console.log(viewport);

  return <mesh position={[topLeft.x, topLeft.y, 0]}>{...shapes}</mesh>;
};

export const shapesRoute = createRoute({
  component: Shapes,
  path: "/shapes",
  getParentRoute: () => rootRoute,
});
