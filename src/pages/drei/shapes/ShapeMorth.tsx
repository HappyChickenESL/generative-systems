import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function createPolygon(sides: number, radius = 1) {
  const shape = new THREE.Shape();

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

function getNormalizedPoints(shape: THREE.Shape, count: number) {
  const pts = shape.getPoints();

  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    const idx = t * (pts.length - 1);

    const a = pts[Math.floor(idx)];
    const b = pts[Math.ceil(idx)] || a;

    return new THREE.Vector2(
      THREE.MathUtils.lerp(a.x, b.x, idx % 1),
      THREE.MathUtils.lerp(a.y, b.y, idx % 1),
    );
  });
}

export const ShapeMorph = ({
  x,
  y,
  scale,
}: {
  x: number;
  y: number;
  scale: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.ShapeGeometry | null>(null);

  const fromSides = useRef(4);
  const toSides = useRef(5);

  const progress = useRef(0);
  const pauseUntil = useRef(0);

  const resolution = 64;

  useFrame(() => {
    const now = performance.now();

    // ⛔ PAUSED: do nothing
    if (now < pauseUntil.current) return;

    // progress animation
    progress.current += 0.01;
    const t = Math.min(progress.current, 1);

    const fromShape = createPolygon(fromSides.current);
    const toShape = createPolygon(toSides.current);

    const a = getNormalizedPoints(fromShape, resolution);
    const b = getNormalizedPoints(toShape, resolution);

    const interpolated: THREE.Vector2[] = [];

    for (let i = 0; i < resolution; i++) {
      interpolated.push(
        new THREE.Vector2(
          THREE.MathUtils.lerp(a[i].x, b[i].x, t),
          THREE.MathUtils.lerp(a[i].y, b[i].y, t),
        ),
      );
    }

    const shape = new THREE.Shape(interpolated);

    if (geometryRef.current) {
      geometryRef.current.dispose();
    }

    geometryRef.current = new THREE.ShapeGeometry(shape);
    meshRef.current.geometry = geometryRef.current;

    // finished morph step
    if (t >= 1) {
      progress.current = 0;

      fromSides.current = toSides.current;
      toSides.current += 1;

      if (toSides.current > 10) {
        toSides.current = 4;
      }

      // ⏱ pause for 1 second
      pauseUntil.current = now + 1000;
    }
  });

  return (
    <mesh scale={scale} position={[x, y, 0]} ref={meshRef}>
      <shapeGeometry args={[createPolygon(3)]} />
      <meshBasicMaterial color="hotpink" />
    </mesh>
  );
};
