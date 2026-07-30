import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useCallback, useEffect, useState } from "react";
import {
  ForestFireScene,
  type Cell,
  type CellState,
} from "./components/ForestFireScene";

const ROWS = 30;
const COLS = 40;
const TREE_DENSITY = 0.1;
const FIRE_SPREAD_CHANCE = 0.4;
const TREE_SPREAD_CHANCE = 0.04;
const RECOVERY_CHANCE = 0.02;
const BURN_DURATION = 2;
const TICK_MS = 100;

const createForest = () =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => {
      const isTree = Math.random() < TREE_DENSITY;
      return {
        state: isTree ? "tree" : "empty",
        burnTicksLeft: 0,
      } as Cell;
    }),
  );

const hasNeighborState = (
  grid: Cell[][],
  row: number,
  col: number,
  state: CellState,
) => {
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      if (x === 0 && y === 0) {
        continue;
      }

      const nextRow = row + y;
      const nextCol = col + x;

      if (
        nextRow < 0 ||
        nextRow >= grid.length ||
        nextCol < 0 ||
        nextCol >= grid[0].length
      ) {
        continue;
      }

      if (grid[nextRow][nextCol].state === state) {
        return true;
      }
    }
  }

  return false;
};

const stepForest = (grid: Cell[][]) =>
  grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (cell.state === "burning") {
        const burnTicksLeft = cell.burnTicksLeft - 1;

        if (burnTicksLeft <= 0) {
          return { state: "burned", burnTicksLeft: 0 } as Cell;
        }

        return { state: "burning", burnTicksLeft } as Cell;
      }

      if (cell.state === "tree") {
        if (
          hasNeighborState(grid, rowIndex, colIndex, "burning") &&
          Math.random() < FIRE_SPREAD_CHANCE
        ) {
          return { state: "burning", burnTicksLeft: BURN_DURATION } as Cell;
        }

        return cell;
      }

      if (cell.state === "empty") {
        if (
          hasNeighborState(grid, rowIndex, colIndex, "tree") &&
          Math.random() < TREE_SPREAD_CHANCE
        ) {
          return { state: "tree", burnTicksLeft: 0 } as Cell;
        }

        return cell;
      }

      if (cell.state === "burned") {
        if (Math.random() < RECOVERY_CHANCE) {
          return { state: "empty", burnTicksLeft: 0 } as Cell;
        }

        return cell;
      }

      return cell;
    }),
  );

const Unterbrechung = () => {
  const [forest, setForest] = useState<Cell[][]>(createForest());

  useEffect(() => {
    const interval = setInterval(() => {
      setForest((prev) => stepForest(prev));
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  const igniteCell = useCallback((row: number, col: number) => {
    setForest((prev) =>
      prev.map((line, rowIndex) =>
        line.map((cell, colIndex) => {
          if (rowIndex !== row || colIndex !== col) {
            return cell;
          }

          if (cell.state === "tree") {
            return { state: "burning", burnTicksLeft: BURN_DURATION } as Cell;
          }

          return cell;
        }),
      ),
    );
  }, []);

  const counts = forest.flat().reduce(
    (acc, cell) => {
      acc[cell.state] += 1;
      return acc;
    },
    { tree: 0, empty: 0, burning: 0, burned: 0 },
  );

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2">
        <div className="text-xs space-y-1">
          <p>Trees: {counts.tree}</p>
          <p>Grass: {counts.empty}</p>
          <p>Burning: {counts.burning}</p>
          <p>Burned: {counts.burned}</p>
        </div>
      </div>

      <div className="flex-1 border-4">
        <Canvas>
          <OrthographicCamera makeDefault zoom={24} position={[0, 0, 20]} />
          <ForestFireScene grid={forest} onIgnite={igniteCell} />
        </Canvas>
      </div>
    </div>
  );
};

export const unterbrechungRoute = createRoute({
  component: Unterbrechung,
  path: "/unterbrechung",
  getParentRoute: () => rootRoute,
});
