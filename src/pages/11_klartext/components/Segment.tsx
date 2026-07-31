import { Line } from "@react-three/drei";
import { type ColorRepresentation } from "three";
import type { Point3 } from "../klartext.model";

interface SegmentProps {
  start: Point3;
  end: Point3;
  color?: ColorRepresentation;
  lineWidth?: number;
}

export const Segment = ({
  start,
  end,
  color = "#ffffff",
  lineWidth = 5,
}: SegmentProps) => {
  return (
    <Line points={[start, end]} color={color} linewidth={lineWidth}></Line>
  );
};
