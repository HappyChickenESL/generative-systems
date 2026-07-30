import { create } from "zustand";
import { Vector2 } from "three";

export interface Tile {
  id: string;
  position: Vector2;
  size: number;
  color: string;
  merged: string[];
}

export interface TilesStore {
  tiles: Map<string, Tile>;
  selectedId: string | null;
  imageUrl: string | null;
  gridSize: number;
  setImageUrl: (url: string | null) => void;
  setGridSize: (size: number) => void;
  addTile: (tile: Tile) => void;
  removeTile: (id: string) => void;
  updateTilePosition: (id: string, position: Vector2) => void;
  setSelectedId: (id: string | null) => void;
  mergeTiles: (
    sourceId: string,
    targetId: string,
    xOffset: number,
    yOffset: number,
  ) => void;
  getTile: (id: string) => Tile | undefined;
  getNeighbors: (id: string) => Tile[];
}

export const useTilesStore = create<TilesStore>((set, get) => ({
  tiles: new Map(),
  selectedId: null,
  imageUrl: "/tiles/animal-1.png",
  gridSize: 4,

  setImageUrl: (url) => set({ imageUrl: url }),
  setGridSize: (size) => set({ gridSize: size }),

  addTile: (tile) => {
    set((state) => {
      const newMap = new Map(state.tiles);
      newMap.set(tile.id, tile);
      return { tiles: newMap };
    });
  },

  removeTile: (id) => {
    set((state) => {
      const newMap = new Map(state.tiles);
      newMap.delete(id);
      return { tiles: newMap };
    });
  },

  updateTilePosition: (id, position) => {
    set((state) => {
      const tile = state.tiles.get(id);
      if (!tile) return state;
      const newMap = new Map(state.tiles);
      newMap.set(id, { ...tile, position });
      return { tiles: newMap };
    });
  },

  setSelectedId: (id) => {
    set({ selectedId: id });
  },

  mergeTiles: (sourceId, targetId, xOffset, yOffset) => {
    set((state) => {
      const source = state.tiles.get(sourceId);
      const target = state.tiles.get(targetId);

      if (!source || !target) return state;

      const newMap = new Map(state.tiles);

      // Keep both tiles, but track that source is connected to target
      const targetConnections = new Set(target.merged || []);
      targetConnections.add(sourceId);
      if (source.merged)
        source.merged.forEach((id) => targetConnections.add(id));

      const newPosition = target.position.clone();

      newPosition.x += xOffset;
      newPosition.y += yOffset;

      newMap.set(sourceId, {
        ...source,
        position: newPosition,
        merged: [targetId], // source is now part of target's group
      });

      newMap.set(targetId, {
        ...target,
        merged: Array.from(targetConnections),
      });

      return { tiles: newMap };
    });
  },

  getTile: (id) => {
    return get().tiles.get(id);
  },

  getNeighbors: (id) => {
    const tiles = get().tiles;
    const [col, row] = id.split("-").map(Number);

    const neighborIds = [
      `${col + 1}-${row}`, // right
      `${col - 1}-${row}`, // left
      `${col}-${row + 1}`, // down
      `${col}-${row - 1}`, // up
    ];

    return neighborIds.flatMap((nid) => {
      const tile = tiles.get(nid);
      return tile ? [tile] : [];
    });
  },
}));
