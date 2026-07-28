import { useMemo, memo } from "react";

const SeedComponent = ({ size, color }: { size: number; color: string }) => {
  const circle = useMemo(() => <circleGeometry args={[size, 32]} />, [size]);

  return (
    <>
      {circle}
      <meshBasicMaterial color={color} />
    </>
  );
};

export const Seed = memo(SeedComponent);
