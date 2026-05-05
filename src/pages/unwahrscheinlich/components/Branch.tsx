export const Branch = ({ x = 0, y = 0, z = 0, size = 1 }) => {
  const radius = 0.1;
  const length = 3;

  return (
    <group scale={size} position={[x, y, z]}>
      <cylinderGeometry
        args={[radius, radius * 0.7, length, 8]}
      ></cylinderGeometry>
      {/* <boxGeometry args={[size, size]}></boxGeometry> */}
      {/* <shapeGeometry args={[shape]} /> */}
      <meshStandardMaterial color="brown" />
    </group>
  );
};
