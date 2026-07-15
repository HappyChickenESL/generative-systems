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
  // const possibleLocations: Vector3[] = [];
  const circles: GearShapeType[] = [];

  for (let i = 0; i < 100; i++) {
    const r = minMaxRand(0.1, 1);
    const tH = minMaxRand(r * 0.1, r * 0.15);
    const t = minMaxRand(6, 40);

    let position;

    if (circles.length === 0) {
      position = new Vector3(0, 0, 0);
    } else {
      const possiblePos = getPossiblePositions(circles, r + tH);
      const rand = Math.floor(minMaxRand(0, possiblePos.length - 1));
      position = possiblePos[rand];
    }

    const gearShape: GearShapeType = {
      center: position,
      radius: r,
      teeth: t,
      toothHeight: tH,
    };
    circles.push(gearShape);
    shapes.push(
      <mesh position={position}>{<GearShape {...gearShape}></GearShape>}</mesh>,
    );
  }

  console.log(getPossiblePositions(circles, 5));

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1">
        <Canvas>
          <OrthographicCamera makeDefault zoom={120} position={[0, 0, 10]} />
          {...shapes}
        </Canvas>
      </div>
    </div>
  );
};

const getPossiblePositions = (circles: GearShapeType[], newRadius: number) => {
  const samples = 16;
  const result = [];

  for (const c of circles) {
    const R = c.radius + newRadius;

    for (let i = 0; i < samples; i++) {
      const theta = (i / samples) * Math.PI * 2;

      const x = c.center.x + Math.cos(theta) * R;
      const y = c.center.y + Math.sin(theta) * R;

      const p = new Vector3(x, y, 0);

      let touchesAtLeastOne = false;
      let overlapsAny = false;

      for (const other of circles) {
        const dist = p.distanceTo(other.center);
        const minDist = other.radius + newRadius;

        if (dist < minDist - 1e-6) {
          overlapsAny = true;
          break;
        }

        // "touches at least one"
        if (Math.abs(dist - minDist) < 1e-2) {
          touchesAtLeastOne = true;
        }
      }

      if (!overlapsAny && touchesAtLeastOne) {
        result.push(p);
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
