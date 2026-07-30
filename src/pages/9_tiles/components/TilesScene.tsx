import { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import {
  Mesh,
  Vector2,
  Vector3,
  Texture,
  TextureLoader,
  SRGBColorSpace,
} from "three";
import { DragControls } from "three/addons/controls/DragControls.js";
import { useTilesStore } from "../tiles.store";
import { Tile } from "./Tile";

const SNAP_DISTANCE = 2;

export const TilesScene = () => {
  const { camera, gl } = useThree();
  const store = useTilesStore();
  const meshRefs = useRef<Map<string, Mesh>>(new Map());
  const controlsRef = useRef<DragControls | null>(null);
  const lastDragPos = useRef<Vector3 | null>(null);
  const [sharedTexture, setSharedTexture] = useState<Texture | null>(null);

  const tiles = Array.from(store.tiles.values());
  const { imageUrl, gridSize } = store;

  // Load image as a single shared texture when imageUrl changes
  useEffect(() => {
    if (!imageUrl) {
      setSharedTexture(null);
      return;
    }
    const loader = new TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.colorSpace = SRGBColorSpace;
      setSharedTexture(tex);
    });
  }, [imageUrl]);

  // BFS to find all tile ids connected to a given tile
  const getConnectedIds = (id: string): string[] => {
    const visited = new Set<string>();
    const queue = [id];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      store.getTile(current)?.merged.forEach((cid) => {
        if (!visited.has(cid)) queue.push(cid);
      });
    }
    return Array.from(visited);
  };

  // Rebuild DragControls whenever the tile list changes
  useEffect(() => {
    const meshes = Array.from(meshRefs.current.values());
    if (meshes.length === 0) return;

    controlsRef.current?.dispose();
    controlsRef.current = new DragControls(meshes, camera, gl.domElement);

    controlsRef.current.addEventListener("dragstart", (e) => {
      store.setSelectedId(e.object.userData.tileId);
      lastDragPos.current = e.object.position.clone();
    });

    controlsRef.current.addEventListener("drag", (e) => {
      e.object.position.z = 0;

      if (!lastDragPos.current) return;

      // Compute how far the dragged tile moved this frame
      const delta = new Vector3()
        .subVectors(e.object.position, lastDragPos.current)
        .setZ(0);

      // Move all connected tiles' meshes by the same delta
      const connectedIds = getConnectedIds(e.object.userData.tileId);
      connectedIds.forEach((cid) => {
        if (cid === e.object.userData.tileId) return;
        const mesh = meshRefs.current.get(cid);
        if (mesh) {
          mesh.position.add(delta);
          mesh.position.z = 0;
        }
      });

      lastDragPos.current = e.object.position.clone();
    });

    controlsRef.current.addEventListener("dragend", (e) => {
      const id: string = e.object.userData.tileId;
      lastDragPos.current = null;

      // Sync all connected tiles' final positions back to the store
      const connectedIds = getConnectedIds(id);
      connectedIds.forEach((cid) => {
        const mesh = meshRefs.current.get(cid);
        if (mesh) {
          store.updateTilePosition(
            cid,
            new Vector2(mesh.position.x, mesh.position.y),
          );
        }
      });

      store.setSelectedId(null);
      checkSnapping(id);
    });

    return () => controlsRef.current?.dispose();
  }, [tiles.length]);

  const checkSnapping = (id: string) => {
    const connectedIds = getConnectedIds(id);

    // Check every tile in the group for a neighboring tile outside the group
    for (const cid of connectedIds) {
      const connectedTile = store.getTile(cid);
      if (!connectedTile) continue;

      const mesh = meshRefs.current.get(cid);
      if (!mesh) continue;

      const neighbors = store.getNeighbors(cid);
      const [col, row] = cid.split("-").map(Number);

      for (const neighbor of neighbors) {
        // Skip tiles already in the same group
        if (connectedIds.includes(neighbor.id)) continue;

        const meshPos = new Vector2(mesh.position.x, mesh.position.y);
        const [nCol, nRow] = neighbor.id.split("-").map(Number);

        const dirX = nCol - col;
        const dirY = -(nRow - row);

        // Center of the facing edge on each tile
        const cidFace = new Vector2(
          meshPos.x + (dirX * connectedTile.size) / 2,
          meshPos.y + (dirY * connectedTile.size) / 2,
        );
        const neighborFace = new Vector2(
          neighbor.position.x - (dirX * neighbor.size) / 2,
          neighbor.position.y - (dirY * neighbor.size) / 2,
        );

        const faceDistance = cidFace.distanceTo(neighborFace);

        if (faceDistance < SNAP_DISTANCE) {
          // Where `cid` needs to be to align perfectly with the neighbor
          const snapX = neighbor.position.x + (col - nCol) * connectedTile.size;
          const snapY = neighbor.position.y - (row - nRow) * connectedTile.size;

          // Translate the entire group by this delta
          const dx = snapX - mesh.position.x;
          const dy = snapY - mesh.position.y;

          connectedIds.forEach((gid) => {
            const gmesh = meshRefs.current.get(gid);
            if (gmesh) {
              gmesh.position.x += dx;
              gmesh.position.y += dy;
              store.updateTilePosition(
                gid,
                new Vector2(gmesh.position.x, gmesh.position.y),
              );
            }
          });

          store.mergeTiles(
            cid,
            neighbor.id,
            (col - nCol) * connectedTile.size,
            -(row - nRow) * connectedTile.size,
          );
          return;
        }
      }
    }
  };

  return (
    <>
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          sharedTexture={sharedTexture}
          gridSize={gridSize}
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
