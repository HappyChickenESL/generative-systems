import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useWorld } from "./world.store";

const G = 0.2;

export function Planet({ id }: { id: string }) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    const world = useWorld.getState();

    const self = world.bodies[id];

    let acc = new THREE.Vector3();

    for (const key in world.bodies) {
      if (key === id) continue;

      const other = world.bodies[key];

      const dir = new THREE.Vector3().subVectors(other.position, self.position);

      const distSq = dir.lengthSq() + 0.01;

      const force = (G * other.mass) / distSq;

      acc.add(dir.normalize().multiplyScalar(force));
    }

    // integrate
    self.velocity.add(acc.multiplyScalar(delta));
    self.position.add(self.velocity.clone().multiplyScalar(delta));

    mesh.current.position.copy(self.position);
  });

  const world = useWorld.getState();
  const body = world.bodies[id];

  return (
    <mesh ref={mesh} position={body.position}>
      <sphereGeometry args={[body.mass * 0.02, 32, 32]} />
      <meshStandardMaterial color={body.color} />
    </mesh>
  );
}
