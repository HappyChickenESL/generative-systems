import { useMemo } from "react";
import { Shape } from "three";

export const Seed = ({ size, color }: { size: number; color: string }) => {
  const shape = useMemo(() => {
    const newShape = new Shape();
    const steps = 32;
    console.log("reloaded");

    for (let i = 0; i < steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const x = size * Math.cos(theta);
      const y = size * Math.sin(theta);

      if (i === 0) {
        newShape.moveTo(x, y);
      } else {
        newShape.lineTo(x, y);
      }
    }

    newShape.closePath();
    return newShape;
  }, [size]);

  return (
    <>
      <meshBasicMaterial color={color} />
      <shapeGeometry args={[shape]} />
    </>
  );
};
