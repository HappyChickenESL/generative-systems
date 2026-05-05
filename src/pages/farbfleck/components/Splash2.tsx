import { Shape } from "three";
import { useMemo } from "react";

const defaultCoords: { x: number; y: number }[] = [
  { x: 0.0, y: 0.0 },
  { x: 0.2, y: 0.6 },
  { x: 0.4, y: 0.2 },
  { x: 0.6, y: 0.9 },
  { x: 0.8, y: 0.3 },
  { x: 1.0, y: 1.1 },
  { x: 1.2, y: 0.4 },
  { x: 1.4, y: 0.7 },
  { x: 1.6, y: 0.0 },
];

export const Splash2 = ({ x = 0, y = 0, size = 1 }) => {
  const shape = useMemo(() => {
    const s = new Shape();

    for (let i = 1; i < defaultCoords.length; i += 3) {
      s.bezierCurveTo(
        defaultCoords[i].x,
        defaultCoords[i].y,
        defaultCoords[i + 1].x,
        defaultCoords[i + 1].y,
        defaultCoords[i + 2].x,
        defaultCoords[i + 2].y,
      );
    }

    return s;
  }, [x, y, size]);

  return (
    <mesh scale={0.05}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
    </mesh>
  );
};
