import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const G = 1;

export const Body = ({
  mass,
  position,
  velocity,
  color,
  otherPos,
  otherMass,
}: {
  mass: number;
  position: Vector3;
  velocity: Vector3;
  color: string;
  otherPos: Vector3;
  otherMass: number;
}) => {
  const mesh = useRef(null);
  const vel = useRef(new Vector3(...velocity));
  const pos = useRef(new Vector3(...position));

  useFrame((_, delta) => {
    // update position
    pos.current.add(vel.current.clone().multiplyScalar(delta));
    (mesh.current! as { position: any }).position.copy(pos.current);

    // direction from this body to the other
    const dir = new Vector3().subVectors(otherPos, pos.current);
    const distanceSq = dir.lengthSq();

    // avoid division by zero
    if (distanceSq < 0.01) return;

    const forceMag = (G * otherMass) / distanceSq;

    dir.normalize().multiplyScalar(forceMag);

    // update velocity
    vel.current.add(dir.multiplyScalar(delta));
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[mass * 0.2, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
