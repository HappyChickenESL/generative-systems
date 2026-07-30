import { Shape } from "three";
import type { SegmentType } from "../Grammatik";

export function Roads({ segments }: { segments: SegmentType[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        const shape = new Shape();

        if (seg.start.x !== seg.end.x) {
          shape.moveTo(seg.start.x, seg.start.z - 0.1);
          shape.lineTo(seg.end.x, seg.end.z - 0.1);
          shape.lineTo(seg.end.x, seg.end.z + 0.1);
          shape.lineTo(seg.start.x, seg.start.z + 0.1);
        } else {
          shape.moveTo(seg.start.x - 0.1, seg.start.z);
          shape.lineTo(seg.end.x - 0.1, seg.end.z);
          shape.lineTo(seg.end.x + 0.1, seg.end.z);
          shape.lineTo(seg.start.x + 0.1, seg.start.z);
        }

        return (
          <mesh key={i}>
            <shapeGeometry args={[shape]}></shapeGeometry>
          </mesh>
        );
      })}
      )
    </>
  );
}

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
    </mesh>
  );
}
