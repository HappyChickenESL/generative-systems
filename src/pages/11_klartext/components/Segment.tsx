import { Line } from "@react-three/drei";
import { Vector3, type ColorRepresentation } from "three";

export interface SegmentProps {
  start: Vector3;
  end: Vector3;
  color?: ColorRepresentation;
  lineWidth?: number;
}

export const Segment = ({
  start,
  end,
  color = "#000000",
  lineWidth = 1,
}: SegmentProps) => {
  return (
    <Line points={[start, end]} color={color} linewidth={lineWidth}></Line>
  );
};
