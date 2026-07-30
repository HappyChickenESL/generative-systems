import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Mesh, Vector2 } from "three";
import { DragControls } from "three/addons/controls/DragControls.js";
import { useTilesStore } from "../tiles.store";
import { Tile } from "./Tile";

const SNAP_DISTANCE = 2;

export const TilesScene = () => {
  const { camera, gl } = useThree();
  const store = useTilesStore();
  const meshRefs = useRef<Map<string, Mesh>>(new Map());
  const controlsRef = useRef<DragControls | null>(null);

  const tiles = Array.from(store.tiles.values());

  // Rebuild DragControls whenever the tile list changes
  useEffect(() => {
    console.log("useeffect");
    const meshes = Array.from(meshRefs.current.values());
    if (meshes.length === 0) return;

    controlsRef.current?.dispose();
    controlsRef.current = new DragControls(meshes, camera, gl.domElement);

    controlsRef.current.addEventListener("dragstart", (e) => {
      store.setSelectedId(e.object.userData.tileId);
    });

    controlsRef.current.addEventListener("drag", (e) => {
      e.object.position.z = 0; // lock to 2D
    });

    controlsRef.current.addEventListener("dragend", (e) => {
      console.log(e.object);
      const id: string = e.object.userData.tileId;
      const pos = new Vector2(e.object.position.x, e.object.position.y);
      store.setSelectedId(null);
      checkSnapping(id, pos);
    });

    return () => controlsRef.current?.dispose();
  }, [tiles.length]);

  const checkSnapping = (id: string, currentPos: Vector2) => {
    const currentTile = store.getTile(id);
    if (!currentTile) return;

    const neighbors = store.getNeighbors(id);
    const [sc, sr] = id.split("-").map(Number);

    for (const neighbor of neighbors) {
      const distance = currentPos.distanceTo(neighbor.position);
      if (distance < SNAP_DISTANCE) {
        console.log("test");
        const [nc, nr] = neighbor.id.split("-").map(Number);
        store.mergeTiles(
          id,
          neighbor.id,
          (sc - nc) * currentTile.size,
          -(sr - nr) * currentTile.size, // negate: grid row increases down, Three.js Y increases up
        );
        break;
      }

      store.updateTilePosition(id, currentPos);
    }
  };

  return (
    <>
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          onMount={(mesh) => {
            meshRefs.current.set(tile.id, mesh);
          }}
          onUnmount={() => {
            meshRefs.current.delete(tile.id);
          }}
        />
      ))}
    </>
  );
};
