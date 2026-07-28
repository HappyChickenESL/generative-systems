import { ExtrudeGeometry, Shape } from "three";
import type { SegmentType } from "../Grammatik";

export const Building = ({ segment }: { segment: SegmentType }) => {
  const shape = new Shape();

  if (segment.start.x !== segment.end.x && segment.left) {
    const x = segment.start.x - segment.end.x > 0;

    if (x) {
      const diff = 0.2;
      const length = Math.abs(segment.start.x - segment.end.x);
      shape.moveTo(segment.start.x + diff, segment.start.z + diff + length);
      shape.lineTo(segment.end.x - diff, segment.start.z + diff + length);
      shape.lineTo(segment.end.x - diff, segment.start.z + diff);
      shape.lineTo(segment.start.x + diff, segment.start.z + diff);
    }
  } else {
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth: 1,
    bevelEnabled: false,
  });
  return <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry} />;
};
