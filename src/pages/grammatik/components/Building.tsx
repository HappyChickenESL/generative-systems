import { ExtrudeGeometry, Shape } from "three";
import type { SegmentType } from "../Grammatik";

export const Building = ({ segment }: { segment: SegmentType }) => {
  const shape = new Shape();

  const diff =
    segment.left === undefined ? 0.1 : segment.left === true ? 0.2 : -0.2;

  if (segment.start.x !== segment.end.x) {
    shape.moveTo(segment.start.x, segment.start.z - diff);
    shape.lineTo(segment.end.x, segment.end.z - diff);
    shape.lineTo(segment.end.x, segment.end.z + diff);
    shape.lineTo(segment.start.x, segment.start.z + diff);
  } else {
    shape.moveTo(segment.start.x - diff, segment.start.z);
    shape.lineTo(segment.end.x - diff, segment.end.z);
    shape.lineTo(segment.end.x + diff, segment.end.z);
    shape.lineTo(segment.start.x + diff, segment.start.z);
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth: 1, // building height
    bevelEnabled: false,
  });
  return (
    // <mesh
    //   scale={1}
    //   position={[
    //     segment.start.x + (segment.start.x - segment.end.x),
    //     segment.start.y,
    //     segment.start.z + (segment.start.z - segment.end.z),
    //   ]}
    // >
    //   <boxGeometry args={[0.85, 2]}></boxGeometry>
    //   <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
    // </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry} />
  );
};
