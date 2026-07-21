export const Splash3 = ({ x = 0, y = 0, z = 0, size = 1 }) => {
  console.log(x, y);
  return (
    <mesh scale={1} position={[x, y, z]}>
      <boxGeometry args={[size, size]}></boxGeometry>
      {/* <shapeGeometry args={[shape]} /> */}
      <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
    </mesh>
  );
};
