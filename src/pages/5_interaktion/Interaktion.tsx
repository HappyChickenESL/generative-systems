import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import { Firework } from "./components/Firework";

type FireworkEntry = {
  id: number;
  x: number;
  y: number;
};

const ClickPlane = ({
  onPointerDown,
}: {
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
}) => (
  <mesh position={[0, 0, -1]} onPointerDown={onPointerDown}>
    <planeGeometry args={[1000, 1000]} />
    <meshBasicMaterial transparent opacity={0} />
  </mesh>
);

const Interaktion = () => {
  const [fireworks, setFireworks] = useState<FireworkEntry[]>([]);
  const nextId = useRef(0);

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = nextId.current++;
    setFireworks((prev) => [...prev, { id, x: e.point.x, y: e.point.y }]);
  };

  const removeFirework = (id: number) => {
    setFireworks((prev) => prev.filter((fw) => fw.id !== id));
  };

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-10 m-4">
        Click on the canvas to shoot fireworks!
      </div>
      <div className="flex-1 border-4 rounded-xl p-1">
        <Canvas>
          <OrthographicCamera makeDefault zoom={120} position={[0, 0, 10]} />
          <ClickPlane onPointerDown={handleClick} />
          {fireworks.map((fw) => (
            <Firework
              key={fw.id}
              x={fw.x}
              y={fw.y}
              onDone={() => removeFirework(fw.id)}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
};

export const interaktionRoute = createRoute({
  component: Interaktion,
  path: "/interaktion",
  getParentRoute: () => rootRoute,
});
