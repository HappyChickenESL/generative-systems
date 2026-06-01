import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { Mesh, Shape, Vector3 } from "three";

export const GearShape = ({
  radius,
  toothHeight,
  teeth,
}: {
  radius: number;
  toothHeight: number;
  teeth: number;
}) => {
  const shape = useMemo(() => {
    const newShape = new Shape();
    const steps = 400;

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;

      const r = radius + toothHeight * Math.cos(teeth * theta);

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      if (i === 0) newShape.moveTo(x, y);
      else newShape.lineTo(x, y);
    }

    newShape.closePath();
    return newShape;
  }, []);

  const mesh: RefObject<Mesh | null> = useRef(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.005;
    }
  });

  return (
    <>
      <mesh ref={mesh}>
        <shapeGeometry args={[shape]}></shapeGeometry>
      </mesh>
    </>
  );
};

export interface GearShapeType {
  radius: number;
  teeth: number;
  toothHeight: number;
  center: Vector3;
}
