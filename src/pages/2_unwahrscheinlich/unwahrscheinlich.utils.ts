import seedrandom from "seedrandom";
import { createNoise2D } from "simplex-noise";
import { Color } from "three";

export type TerrainSampler = (x: number, z: number) => number;

export type TreeData = {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  trunkHeight: number;
  trunkRadius: number;
  leafRadius: number;
  leafHeight: number;
  leafColor: string;
};

export type ForestData = {
  seed: string;
  terrainSize: number;
  terrainSegments: number;
  trees: TreeData[];
};

export const TERRAIN_SIZE = 90;
export const TERRAIN_SEGMENTS = 120;

const createRng = (seed: string, channel: string) =>
  seedrandom(`${seed}:${channel}`);

const randRange = (rng: seedrandom.PRNG, min: number, max: number) =>
  min + (max - min) * rng.quick();

const isFarEnough = (
  items: Array<{ x: number; z: number; radius: number }>,
  x: number,
  z: number,
  radius: number,
  spacingMultiplier: number,
) => {
  for (const item of items) {
    const dx = x - item.x;
    const dz = z - item.z;
    const minDistance = (item.radius + radius) * spacingMultiplier;

    if (dx * dx + dz * dz < minDistance * minDistance) {
      return false;
    }
  }

  return true;
};

const colorFromHsl = (h: number, s: number, l: number) =>
  new Color().setHSL(h, s, l).getStyle();

export const createTerrainSampler = (seed: string): TerrainSampler => {
  const rng = createRng(seed, "terrain");
  const noise = createNoise2D(rng);

  return (x: number, z: number) => {
    const large = noise(x * 0.03, z * 0.03) * 2.2;
    const small = noise(x * 0.09 + 100, z * 0.09 - 100) * 0.7;

    return large + small;
  };
};

export const generateForestData = (
  seed: string,
  terrainSampler: TerrainSampler = createTerrainSampler(seed),
): ForestData => {
  const rng = createRng(seed, "forest");
  const halfTerrain = TERRAIN_SIZE * 0.5;
  const usableHalfTerrain = halfTerrain * 0.92;

  const targetTrees = Math.floor(randRange(rng, 80, 151));
  const trees: TreeData[] = [];

  let attempts = 0;
  const maxTreeAttempts = targetTrees * 100;

  while (trees.length < targetTrees && attempts < maxTreeAttempts) {
    attempts++;

    const trunkHeight = randRange(rng, 1.8, 4.7);
    const trunkRadius = randRange(rng, 0.14, 0.34);
    const leafRadius = randRange(rng, 0.7, 1.7);
    const leafHeight = leafRadius * randRange(rng, 1.1, 1.8);

    const x = randRange(rng, -usableHalfTerrain, usableHalfTerrain);
    const z = randRange(rng, -usableHalfTerrain, usableHalfTerrain);

    if (!isFarEnough(trees, x, z, leafRadius, 1.25)) {
      continue;
    }

    const y = terrainSampler(x, z);
    const leafColor = colorFromHsl(
      randRange(rng, 0.28, 0.36),
      randRange(rng, 0.45, 0.7),
      randRange(rng, 0.25, 0.42),
    );

    trees.push({
      id: `tree-${trees.length}`,
      x,
      y,
      z,
      radius: leafRadius,
      trunkHeight,
      trunkRadius,
      leafRadius,
      leafHeight,
      leafColor,
    });
  }

  return {
    seed,
    terrainSize: TERRAIN_SIZE,
    terrainSegments: TERRAIN_SEGMENTS,
    trees,
  };
};
