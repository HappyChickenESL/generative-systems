import { DoubleSide, ExtrudeGeometry, Shape } from "three";
import type { SegmentType } from "../Grammatik";
import { minMaxRand } from "../../../shared/utils";

export const Building = ({ segment }: { segment: SegmentType }) => {
  const shape = new Shape();

  const inset = 0.2; // shorten at both ends
  const offset = 0.5; // distance from road

  const dx = segment.end.x - segment.start.x;
  const dz = segment.end.z - segment.start.z;

  const length = Math.hypot(dx, dz);

  if (length > 0) {
    // normalized direction
    const dirX = dx / length;
    const dirZ = dz / length;

    // perpendicular (left)
    let perpX = -dirZ;
    let perpZ = dirX;

    // if segment should be right
    if (!segment.left) {
      perpX *= -1;
      perpZ *= -1;
    }

    // shorten the segment
    const sx = segment.start.x + dirX * inset;
    const sz = segment.start.z + dirZ * inset;

    const ex = segment.end.x - dirX * inset;
    const ez = segment.end.z - dirZ * inset;

    // offset away from the road
    const p1x = sx + perpX * offset;
    const p1z = sz + perpZ * offset;

    const p2x = ex + perpX * offset;
    const p2z = ez + perpZ * offset;

    const p3x = ex;
    const p3z = ez;

    const p4x = sx;
    const p4z = sz;

    shape.moveTo(p1x, p1z);
    shape.lineTo(p2x, p2z);
    shape.lineTo(p3x, p3z);
    shape.lineTo(p4x, p4z);
    shape.closePath();
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth: minMaxRand(0.7, 3),
    bevelEnabled: false,
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry}>
      <meshBasicMaterial color="#E69A6A" side={DoubleSide} />
    </mesh>
  );
};
