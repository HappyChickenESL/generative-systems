import { useMemo, type JSX } from "react";
import { ShapeMorph } from "./ShapeMorth";
import { useThree } from "@react-three/fiber";

export const HookWrapper = ({
  scale,
  delay,
  maxEdges,
}: {
  scale: number;
  delay: number;
  maxEdges: number;
}) => {
  const { viewport } = useThree();

  const shapes = useMemo(() => {
    const result: JSX.Element[] = [];

    const maxCountX = Math.ceil(viewport.width * (1 / scale) * 0.4);
    const maxCountY = Math.ceil(viewport.height * (1 / scale) * 0.4);

    for (let i = 0; i < maxCountX; i++) {
      for (let j = 0; j < maxCountY; j++) {
        result.push(
          <ShapeMorph
            key={`${i}-${j}`}
            x={i * 2.5 * scale}
            y={-j * 2.5 * scale}
            scale={scale}
            maxEdges={Math.floor(maxEdges)}
            delay={Math.ceil(delay)}
          />,
        );
      }
    }

    return result;
  }, [viewport.width, viewport.height, scale, maxEdges, delay]);

  const topLeft = {
    x: -viewport.width / 2,
    y: viewport.height / 2,
  };

  return <mesh position={[topLeft.x, topLeft.y, 0]}>{...shapes}</mesh>;
};
