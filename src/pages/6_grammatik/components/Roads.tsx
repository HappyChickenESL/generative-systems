import { DoubleSide, Shape } from "three";
import type { SegmentType } from "../Grammatik";

export function Road({ segment }: { segment: SegmentType }) {
  const shape = new Shape();

  if (segment.start.x !== segment.end.x) {
    shape.moveTo(segment.start.x, segment.start.z - 0.1);
    shape.lineTo(segment.end.x, segment.end.z - 0.1);
    shape.lineTo(segment.end.x, segment.end.z + 0.1);
    shape.lineTo(segment.start.x, segment.start.z + 0.1);
  } else {
    shape.moveTo(segment.start.x - 0.1, segment.start.z);
    shape.lineTo(segment.end.x - 0.1, segment.end.z);
    shape.lineTo(segment.end.x + 0.1, segment.end.z);
    shape.lineTo(segment.start.x + 0.1, segment.start.z);
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <shapeGeometry args={[shape]}></shapeGeometry>
      <meshBasicMaterial color="gray" side={DoubleSide} />
    </mesh>
  );
}
