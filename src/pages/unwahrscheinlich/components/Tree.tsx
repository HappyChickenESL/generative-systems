import { useMemo } from "react";
import { CylinderGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const Tree = ({ x = 0, y = 0, z = 0, size = 1 }) => {
  const radius = 1;
  const length = 5;

  const mergedBranches = useMemo(() => {
    const geometries = [];

    const g = new CylinderGeometry(
      radius / 2,
      (radius / 2) * 0.7,
      length / 2,
      8,
    );

    // move it up so it grows from base
    g.translate(0, 0.5, 0);

    // random position
    g.translate(
      Math.random() * 2 - 1,
      Math.random() * 2,
      Math.random() * 2 - 1,
    );

    // random rotation
    g.rotateZ(Math.random() * Math.PI);

    geometries.push(g);

    return mergeGeometries(geometries);
  }, []);

  return (
    <mesh scale={size} position={[x, y, z]}>
      <cylinderGeometry
        args={[radius, radius * 0.7, length, 8]}
      ></cylinderGeometry>
      <mesh geometry={mergedBranches}></mesh>
      <meshStandardMaterial color="brown" />
    </mesh>
  );
};
