import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useTilesStore } from "./tiles.store";
import { TilesScene } from "./components/TilesScene";
import { Vector2 } from "three";

const TilesCanvas = () => {
  const store = useTilesStore();

  // Initialize with some tiles
  useEffect(() => {
    if (store.tiles.size === 0) {
      // const colors = [
      //   "#ff6b6b",
      //   "#4ecdc4",
      //   "#45b7d1",
      //   "#f9ca24",
      //   "#6c5ce7",
      //   "#a29bfe",
      //   "#fd79a8",
      //   "#fdcb6e",
      // ];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          store.addTile({
            id: `${i}-${j}`,
            position: new Vector2(
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
            ),
            size: 3,
            color: `hsl(${((i + j) / 14) * 240}, 80%, 60%)`,
            merged: [],
          });
        }
      }
    }
  }, [store]);

  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* <OrbitControls enableZoom enablePan enableRotate={false} /> */}
      <ambientLight intensity={0.8} />

      <TilesScene />
    </Canvas>
  );
};

const Tiles = () => {
  const store = useTilesStore();

  return (
    <div className="w-full h-full flex flex-col bg-slate-900">
      <div className="h-160">
        <TilesCanvas />
      </div>

      {/* Info panel */}
      <div className="bg-slate-800 text-white p-4 border-t border-slate-700">
        <div className="text-sm">
          <p className="mb-2">
            <strong>Tiles: {store.tiles.size}</strong>
          </p>
          <p className="text-xs text-slate-400">
            Drag tiles to move them. Drop near other tiles to snap and merge
            them together.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {Array.from(store.tiles.values()).map((tile) => (
              <div
                key={tile.id}
                className="bg-slate-700 p-2 rounded"
                style={{ borderLeft: `4px solid ${tile.color}` }}
              >
                <div className="font-mono">{tile.id}</div>
                <div className="text-slate-400">
                  Size: {tile.size.toFixed(2)}
                </div>
                {tile.merged.length > 0 && (
                  <div className="text-slate-400">
                    Merged: {tile.merged.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const tilesRoute = createRoute({
  component: Tiles,
  path: "/tiles",
  getParentRoute: () => rootRoute,
});
