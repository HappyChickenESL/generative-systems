import { Shape } from "three";
import { useMemo } from "react";

export const Splash = ({ x = 0, y = 0, size = 1 }) => {
  const shape = useMemo(() => {
    const s = new Shape();

    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    s.moveTo(x, y);

    const points: { x: number; y: number }[] = [];
    const segments = Math.floor(rand(6, 9));

    // generate radial points (slightly less extreme)
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      // tighter radius range = less spikes
      const radius = rand(30, 50) * size;

      points.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
      });
    }

    const smoothness = 0.1; // lower = tighter, higher = more blobby

    for (let i = 0; i < points.length; i++) {
      const prev = points[(i - 1 + points.length) % points.length];
      const current = points[i];
      const next = points[(i + 1) % points.length];
      const nextNext = points[(i + 2) % points.length];

      // direction vectors
      const dx1 = next.x - prev.x;
      const dy1 = next.y - prev.y;

      const dx2 = nextNext.x - current.x;
      const dy2 = nextNext.y - current.y;

      const cp1x = current.x + dx1 * smoothness;
      const cp1y = current.y + dy1 * smoothness;

      const cp2x = next.x - dx2 * smoothness;
      const cp2y = next.y - dy2 * smoothness;

      s.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
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
