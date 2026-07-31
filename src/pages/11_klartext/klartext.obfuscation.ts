import seedrandom from "seedrandom";
import { createNoise2D } from "simplex-noise";
import type { Point3 } from "./klartext.model";
import { Point3Utils } from "./point3.util";

export interface SegmentDefinition {
  start: Point3;
  end: Point3;
}

export interface ObfuscationOptions {
  amount: number;
  seed: string;
}

const NOISE_SCALE = 2.1;
const INDEX_PHASE = 0.31;

const MAX_POSITION_OFFSET = 0.35;
const MAX_ROTATION = 0.6;
const MAX_LENGTH_DELTA = 0.45;
const MAX_ENDPOINT_JITTER = 0.08;

const MIN_LENGTH_FACTOR = 0.35;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const toHalf = (vector: Point3) => Point3Utils.mul(vector, 0.5);

const cloneSegment = (segment: SegmentDefinition): SegmentDefinition => ({
  start: [...segment.start],
  end: [...segment.end],
});

const transformSegment = (
  segment: SegmentDefinition,
  amount: number,
  index: number,
  noise2D: (x: number, y: number) => number,
): SegmentDefinition => {
  const center = Point3Utils.midpoint(segment.start, segment.end);
  const delta = Point3Utils.sub(segment.end, segment.start);
  const direction = Point3Utils.normalize(delta);
  const baseLength = Math.max(Point3Utils.length(delta), 1e-4);

  const phase = index * INDEX_PHASE;

  const centerNoiseX = noise2D(
    center[0] * NOISE_SCALE + phase,
    center[1] * NOISE_SCALE,
  );
  const centerNoiseY = noise2D(
    center[0] * NOISE_SCALE + 11.7,
    center[1] * NOISE_SCALE - phase,
  );
  const rotationNoise = noise2D(
    center[0] * NOISE_SCALE + 23.4,
    center[1] * NOISE_SCALE + phase,
  );
  const lengthNoise = noise2D(
    center[0] * NOISE_SCALE + 35.1,
    center[1] * NOISE_SCALE - phase,
  );

  const positionAmplitude = amount * MAX_POSITION_OFFSET;
  const centerOffset: Point3 = [
    centerNoiseX * positionAmplitude,
    centerNoiseY * positionAmplitude,
    0,
  ];
  const displacedCenter = Point3Utils.add(center, centerOffset);

  const angle = rotationNoise * amount * amount * MAX_ROTATION;
  const rotatedDirection = Point3Utils.rotateAroundZ(direction, angle);

  const lengthFactor = Math.max(
    MIN_LENGTH_FACTOR,
    1 + lengthNoise * amount * MAX_LENGTH_DELTA,
  );
  const halfDirection = toHalf(
    Point3Utils.mul(rotatedDirection, baseLength * lengthFactor),
  );

  const jitterAmplitude = amount * amount * MAX_ENDPOINT_JITTER;
  const startJitterNoise = noise2D(
    segment.start[0] * 2.6 + phase,
    segment.start[1] * 2.6,
  );
  const endJitterNoise = noise2D(
    segment.end[0] * 2.6 - phase,
    segment.end[1] * 2.6,
  );

  const startJitter: Point3 = [
    startJitterNoise * jitterAmplitude,
    -startJitterNoise * jitterAmplitude,
    0,
  ];
  const endJitter: Point3 = [
    endJitterNoise * jitterAmplitude,
    endJitterNoise * jitterAmplitude,
    0,
  ];

  return {
    start: Point3Utils.add(
      Point3Utils.sub(displacedCenter, halfDirection),
      startJitter,
    ),
    end: Point3Utils.add(
      Point3Utils.add(displacedCenter, halfDirection),
      endJitter,
    ),
  };
};

export const obfuscateSegments = (
  segments: SegmentDefinition[],
  options: ObfuscationOptions,
): SegmentDefinition[] => {
  const amount = clamp01(options.amount);

  if (amount === 0) {
    return segments.map(cloneSegment);
  }

  const noise2D = createNoise2D(seedrandom(`${options.seed}:noise`));

  return segments.map((segment, index) =>
    transformSegment(segment, amount, index, noise2D),
  );
};
