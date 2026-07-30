import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { PlaneGeometry } from "three";
import type {
  ForestData,
  TerrainSampler,
  TreeData,
} from "../unwahrscheinlich.utils";

type ForestSceneProps = {
  forestData: ForestData;
  terrainSampler: TerrainSampler;
};

const Tree = ({ tree }: { tree: TreeData }) => {
  return (
    <group position={[tree.x, tree.y, tree.z]}>
      <mesh position={[0, tree.trunkHeight * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[tree.trunkRadius, tree.trunkRadius * 1.1, tree.trunkHeight, 6]}
        />
        <meshStandardMaterial color="#5f3b1f" flatShading />
      </mesh>
      <mesh
        position={[0, tree.trunkHeight + tree.leafHeight * 0.5, 0]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[tree.leafRadius, tree.leafHeight, 7]} />
        <meshStandardMaterial color={tree.leafColor} flatShading />
      </mesh>
    </group>
  );
};

export const ForestScene = ({
  forestData,
  terrainSampler,
}: ForestSceneProps) => {
  const terrainGeometry = useMemo(() => {
    const geometry = new PlaneGeometry(
      forestData.terrainSize,
      forestData.terrainSize,
      forestData.terrainSegments,
      forestData.terrainSegments,
    );

    geometry.rotateX(-Math.PI * 0.5);

    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      positions.setY(i, terrainSampler(x, z));
    }

    positions.needsUpdate = true;

    return geometry;
  }, [forestData.terrainSegments, forestData.terrainSize, terrainSampler]);

  return (
    <>
      <OrbitControls minDistance={20} maxDistance={120} />
      <ambientLight intensity={1} />

      <mesh geometry={terrainGeometry}>
        <meshStandardMaterial color="green" />
      </mesh>

      {forestData.trees.map((tree) => (
        <Tree key={tree.id} tree={tree} />
      ))}
    </>
  );
};
