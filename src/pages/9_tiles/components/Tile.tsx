import { useRef, useEffect } from "react";
import {
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  RepeatWrapping,
} from "three";
import { useTilesStore } from "../tiles.store";
import type { Tile as TileType } from "../tiles.store";
import type { Texture } from "three";

interface TileProps {
  tile: TileType;
  sharedTexture: Texture | null;
  gridSize: number;
  onMount: (mesh: Mesh) => void;
  onUnmount: () => void;
}

export const Tile = ({
  tile,
  sharedTexture,
  gridSize,
  onMount,
  onUnmount,
}: TileProps) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
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

  // Update material imperatively so Three.js recompiles the shader correctly
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;

    if (sharedTexture) {
      const [col, row] = tile.id.split("-").map(Number);
      const t = sharedTexture.clone();
      t.colorSpace = SRGBColorSpace;
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat.set(1 / gridSize, 1 / gridSize);
      // UV origin is bottom-left; grid row 0 is visually top → invert
      t.offset.set(col / gridSize, (gridSize - row - 1) / gridSize);
      t.needsUpdate = true;
      mat.map = t;
      mat.color.set(0xffffff);
    } else {
      if (mat.map) {
        mat.map.dispose();
        mat.map = null;
      }
      mat.color.set(tile.color);
    }

    mat.needsUpdate = true;
  }, [sharedTexture, tile.id, gridSize, tile.color]);

  const isSelected = store.selectedId === tile.id;

  return (
    <mesh ref={meshRef} position={[tile.position.x, tile.position.y, 0]}>
      <boxGeometry args={[tile.size, tile.size, 0.1]} />
      <meshStandardMaterial
        ref={materialRef}
        color={tile.color}
        emissive={isSelected ? 0x444444 : 0x000000}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
};

interface TileProps {
  tile: TileType;
  sharedTexture: Texture | null;
  gridSize: number;
  onMount: (mesh: Mesh) => void;
  onUnmount: () => void;
}
