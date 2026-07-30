import { Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";

export type CellState = "tree" | "empty" | "burning" | "burned";

export interface Cell {
  state: CellState;
  burnTicksLeft: number;
}

const CELL_COLORS: Record<CellState, string> = {
  tree: "#2f7a39",
  empty: "#8ebf75",
  burning: "#ff5b2e",
  burned: "#2e2e2e",
};

const CELL_EMOJIS: Record<CellState, string> = {
  tree: "🌲",
  empty: "",
  burning: "🔥",
  burned: "🪦",
};

export const ForestFireScene = ({
  grid,
  onIgnite,
}: {
  grid: Cell[][];
  onIgnite: (row: number, col: number) => void;
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const step = 1;

  const xOffset = ((cols - 1) * step) / 2;
  const yOffset = ((rows - 1) * step) / 2;

  const handlePointerDown = (
    e: ThreeEvent<PointerEvent>,
    row: number,
    col: number,
  ) => {
    e.stopPropagation();
    onIgnite(row, col);
  };

  return (
    <group>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <mesh
            key={`${rowIndex}-${colIndex}`}
            position={[colIndex * step - xOffset, yOffset - rowIndex * step, 0]}
            onPointerDown={(e) => handlePointerDown(e, rowIndex, colIndex)}
          >
            <planeGeometry args={[0.92, 0.92]} />
            <meshBasicMaterial color={CELL_COLORS[cell.state]} />
            {CELL_EMOJIS[cell.state] && (
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.9}
                anchorX="center"
                anchorY="middle"
              >
                {CELL_EMOJIS[cell.state]}
              </Text>
            )}
          </mesh>
        )),
      )}
    </group>
  );
};
