import { type ColorRepresentation } from "three";
import { Segment } from "./Segment";
import type { Point3, UppercaseLetter } from "../klartext.model";
import {
  obfuscateSegments,
  type SegmentDefinition,
  type ObfuscationOptions,
} from "../klartext.obfuscation.ts";

interface LetterProps {
  character: UppercaseLetter;
  position: Point3;
  scale?: number;
  color?: ColorRepresentation;
  lineWidth?: number;
  obfuscation?: ObfuscationOptions;
}

// 16-segment layout indices (according to wikipedia)
// https://upload.wikimedia.org/wikipedia/commons/9/95/16-segmente.png
// 0:a1 1:a2 2:b 3:c 4:d1 5:d2 6:e 7:f 8:g1 9:g2 10:h 11:i 12:j 13:k 14:l 15:m
const LETTER_SEGMENTS: Record<UppercaseLetter, number[]> = {
  A: [0, 1, 2, 3, 6, 7, 8, 9],
  B: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  C: [0, 1, 4, 5, 6, 7],
  D: [0, 1, 2, 3, 4, 5, 6, 7],
  E: [0, 1, 4, 5, 6, 7, 8, 9],
  F: [0, 1, 6, 7, 8, 9],
  G: [0, 1, 3, 4, 5, 6, 7, 9],
  H: [2, 3, 6, 7, 8, 9],
  I: [0, 1, 4, 5, 14, 15],
  J: [2, 3, 4, 5, 6],
  K: [6, 7, 8, 11, 13],
  L: [4, 5, 6, 7],
  M: [2, 3, 6, 7, 10, 11],
  N: [2, 3, 6, 7, 10, 13],
  O: [0, 1, 2, 3, 4, 5, 6, 7],
  P: [0, 1, 2, 6, 7, 8, 9],
  Q: [0, 1, 2, 3, 4, 5, 6, 7, 13],
  R: [0, 1, 2, 6, 7, 8, 9, 13],
  S: [0, 1, 3, 4, 5, 7, 8, 9],
  T: [0, 1, 14, 15],
  U: [2, 3, 4, 5, 6, 7],
  V: [2, 7, 12, 13],
  W: [2, 3, 6, 7, 12, 13],
  X: [10, 11, 12, 13],
  Y: [10, 11, 15],
  Z: [0, 1, 4, 5, 11, 12],
  // debugging
  "#": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
};

const SEGMENT_LAYOUT: SegmentDefinition[] = [
  { start: [-0.5, 1, 0], end: [0, 1, 0] },
  { start: [0, 1, 0], end: [0.5, 1, 0] },
  { start: [0.5, 1, 0], end: [0.5, 0, 0] },
  { start: [0.5, 0, 0], end: [0.5, -1, 0] },
  { start: [-0.5, -1, 0], end: [0, -1, 0] },
  { start: [0, -1, 0], end: [0.5, -1, 0] },
  { start: [-0.5, 0, 0], end: [-0.5, -1, 0] },
  { start: [-0.5, 1, 0], end: [-0.5, 0, 0] },
  { start: [-0.5, 0, 0], end: [0, 0, 0] },
  { start: [0, 0, 0], end: [0.5, 0, 0] },
  { start: [-0.5, 1, 0], end: [0, 0, 0] },
  { start: [0.5, 1, 0], end: [0, 0, 0] },
  { start: [-0.5, -1, 0], end: [0, 0, 0] },
  { start: [0.5, -1, 0], end: [0, 0, 0] },
  { start: [0, 1, 0], end: [0, 0, 0] },
  { start: [0, 0, 0], end: [0, -1, 0] },
];

export const Letter = ({
  character,
  position,
  scale = 1,
  color,
  lineWidth,
  obfuscation,
}: LetterProps) => {
  const segments = LETTER_SEGMENTS[character];

  let segmentLayout = SEGMENT_LAYOUT;

  if (obfuscation) {
    segmentLayout = obfuscateSegments(SEGMENT_LAYOUT, {
      amount: obfuscation?.amount,
      seed: `${obfuscation.seed}-${position}`,
    });
  }

  return (
    <group position={position} scale={scale}>
      {segments.map((segmentIndex) => {
        const segment = segmentLayout[segmentIndex];

        return (
          <Segment
            key={segmentIndex}
            start={segment.start}
            end={segment.end}
            color={color}
            lineWidth={lineWidth}
          />
        );
      })}
    </group>
  );
};
