import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { Mesh, Shape, Vector3 } from "three";

export const GearShape = ({
  radius,
  toothHeight,
  teeth,
  direction,
}: {
  radius: number;
  toothHeight: number;
  teeth: number;
  direction: boolean;
}) => {
  const shape = useMemo(() => {
    const newShape = new Shape();
    const stepsPerTooth = 32;
    const totalSteps = teeth * stepsPerTooth;

    for (let tooth = 0; tooth < teeth; tooth++) {
      for (let step = 0; step < stepsPerTooth; step++) {
        const sampleIndex = tooth * stepsPerTooth + step;
        const theta = (sampleIndex / totalSteps) * Math.PI * 2;

        const currentRadius = toothHeight * Math.cos(teeth * theta) + radius;
        const x = currentRadius * Math.cos(theta);
        const y = currentRadius * Math.sin(theta);

        if (sampleIndex === 0) {
          newShape.moveTo(x, y);
          continue;
        }

        newShape.lineTo(x, y);
      }
    }

    newShape.lineTo(radius + toothHeight, 0);

    newShape.closePath();
    return newShape;
  }, [radius, toothHeight, teeth]);

  const mesh: RefObject<Mesh | null> = useRef(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.z += (0.1 / (teeth * 0.5)) * (direction ? 1 : -1);
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
  direction: boolean;
}
