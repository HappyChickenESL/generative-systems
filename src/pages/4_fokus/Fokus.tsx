import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { GearShape, type GearShapeType } from "./components/GearShape";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import type { JSX } from "react";
import { Vector3 } from "three";
import { minMaxRand } from "../../shared/utils";

const Fokus = () => {
  const shapes: JSX.Element[] = [];
  const circles: GearShapeType[] = [];

  for (let i = 0; i < 200; i++) {
    const r = minMaxRand(0.1, 1);
    let tH = minMaxRand(r * 0.1, r * 0.15);

    let t = Math.floor(minMaxRand(8, 40));

    let position;
    let direction = true;

    if (circles.length === 0) {
      position = new Vector3(0, 0, 0);
    } else {
      const possiblePos = getPossiblePositions(circles, r + tH);
      position = possiblePos[5].pos;
      direction = possiblePos[5].direction;
    }

    const gearShape: GearShapeType = {
      center: position,
      radius: r,
      teeth: t,
      toothHeight: r * 0.1,
      direction: direction,
    };
    circles.push(gearShape);
    shapes.push(
      <mesh position={position}>{<GearShape {...gearShape}></GearShape>}</mesh>,
    );
  }

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1 border-4">
        <Canvas>
          <OrthographicCamera makeDefault zoom={120} position={[0, 0, 10]} />
          {...shapes}
        </Canvas>
      </div>
    </div>
  );
};

const getPossiblePositions = (circles: GearShapeType[], newRadius: number) => {
  const samples = 32;
  const result = [];

  for (const c of circles) {
    const R = c.radius + newRadius;

    for (let i = 0; i < samples; i++) {
      const theta = (i / samples) * Math.PI * 2;

      const x = c.center.x + Math.cos(theta) * R;
      const y = c.center.y + Math.sin(theta) * R;

      const p = new Vector3(x, y, 0);

      let touchCount = 0;
      let overlapsAny = false;
      let direction = true;

      for (const other of circles) {
        const dist = p.distanceTo(other.center);
        const minDist = other.radius + newRadius;

        if (dist < minDist - 1e-6) {
          overlapsAny = true;
          break;
        }

        // "touches at least one"
        if (Math.abs(dist - minDist) < 1e-2) {
          direction = !other.direction;
          touchCount++;
        }
      }

      if (!overlapsAny && touchCount === 1) {
        result.push({ pos: p, direction: direction });
        // console.log(touchCount);
      }
    }
  }

  return result;
};

export const fokusRoute = createRoute({
  component: Fokus,
  path: "/fokus",
  getParentRoute: () => rootRoute,
});
