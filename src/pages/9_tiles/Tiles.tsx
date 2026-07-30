import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useTilesStore } from "./tiles.store";
import { TilesScene } from "./components/TilesScene";
import { Vector2 } from "three";

const MIN_GRID = 2;
const MAX_GRID = 12;
const SCATTER = 20;

const generateTiles = (
  store: ReturnType<typeof useTilesStore>,
  gridSize: number,
  withImage: boolean = false,
) => {
  Array.from(store.tiles.keys()).forEach((id) => store.removeTile(id));
  const tileSize = Math.max(0.5, 40 / gridSize);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      store.addTile({
        id: `${i}-${j}`,
        position: new Vector2(
          (Math.random() - 0.5) * SCATTER,
          (Math.random() - 0.5) * SCATTER,
        ),
        size: tileSize,
        color: withImage
          ? "white"
          : `hsl(${((i + j) / ((gridSize - 1) * 2)) * 60}, 80%, 60%)`,
        merged: [],
      });
    }
  }
};

const TilesCanvas = () => {
  const store = useTilesStore();

  useEffect(() => {
    if (store.tiles.size === 0) {
      generateTiles(store, store.gridSize);
    }
  }, [store]);

  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.8} />
      <TilesScene />
    </Canvas>
  );
};

const Tiles = () => {
  const store = useTilesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      // Clear existing tiles
      store.setImageUrl(url);
      generateTiles(store, store.gridSize, true);
      // Note: do NOT revoke url — tiles need it for their textures
    };
    img.src = url;
  };

  return (
    <div className="w-full h-full flex bg-slate-900">
      {/* Sidebar */}
      <div className="w-48 flex flex-col gap-4 p-4 bg-slate-800 border-r border-slate-700 text-white text-sm">
        <div>
          <p className="text-slate-400 text-xs mb-1">Tiles</p>
          <p className="font-mono text-lg">{store.tiles.size}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">Grid size</p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={MIN_GRID}
              max={MAX_GRID}
              value={store.gridSize}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                store.setGridSize(newSize);
                generateTiles(store, newSize, !!store.imageUrl);
              }}
              className="flex-1"
            />
            <span className="text-sm font-mono w-8">{store.gridSize}</span>
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">Upload image</p>
          <button
            className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 px-3 rounded cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <p className="text-slate-500 text-xs mt-1">
            Each pixel becomes a tile
          </p>
        </div>

        <div className="border-t border-slate-700 pt-4 flex flex-col gap-1 overflow-y-auto">
          {/* {Array.from(store.tiles.values()).map((tile) => (
            <div
              key={tile.id}
              className="flex items-center gap-2 text-xs text-slate-300"
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: tile.color }}
              />
              <span className="font-mono">{tile.id}</span>
              {tile.merged.length > 0 && (
                <span className="text-slate-500 text-xs">
                  +{tile.merged.length}
                </span>
              )}
            </div>
          ))} */}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <TilesCanvas />
      </div>
    </div>
  );
};

export const tilesRoute = createRoute({
  component: Tiles,
  path: "/tiles",
  getParentRoute: () => rootRoute,
});
