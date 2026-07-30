import { useRef, useEffect } from "react";
import { Mesh } from "three";
import { useTilesStore } from "../tiles.store";
import type { Tile as TileType } from "../tiles.store";

interface TileProps {
  tile: TileType;
  onMount: (mesh: Mesh) => void;
  onUnmount: () => void;
}

export const Tile = ({ tile, onMount, onUnmount }: TileProps) => {
  const meshRef = useRef<Mesh>(null);
  const store = useTilesStore();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.tileId = tile.id;
      onMount(meshRef.current);
    }
    return onUnmount;
  }, []);

  // Sync mesh position from store
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(tile.position.x, tile.position.y, 0);
    }
  }, [tile.position]);

  const isSelected = store.selectedId === tile.id;

  return (
    <mesh ref={meshRef} position={[tile.position.x, tile.position.y, 0]}>
      <boxGeometry args={[tile.size, tile.size, 0.1]} />
      <meshStandardMaterial
        color={tile.color}
        emissive={isSelected ? 0x444444 : 0x000000}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
};
