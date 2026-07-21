import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import City from "./components/City";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { JSX } from "react";
import { Road } from "./components/Roads";
import { Building } from "./components/Building";

const Grammatik = () => {
  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1">
        <Canvas camera={{ position: [30, 0, 30], fov: 50 }}>
          <OrbitControls></OrbitControls>
          <City></City>
          <ambientLight />
        </Canvas>
      </div>
    </div>
  );
};

function createTurtle(): { pos: Vector3; dir: Vector3; stack: any } {
  return {
    pos: new Vector3(0, 0, 0),
    dir: new Vector3(1, 0, 0), // forward direction
    stack: [],
  };
}

function rotateY(dir: Vector3, right: boolean) {
  const key = `${dir.x},${dir.z}`;

  switch (key) {
    case "1,0":
      dir.set(0, dir.y, right ? 1 : -1);
      break;
    case "0,1":
      dir.set(right ? -1 : 1, dir.y, 0);
      break;
    case "-1,0":
      dir.set(0, dir.y, right ? -1 : 1);
      break;
    case "0,-1":
      dir.set(right ? 1 : -1, dir.y, 0);
      break;
  }
}

export type SegmentType = {
  start: Vector3;
  end: Vector3;
  left?: boolean;
};

export function interpretLSystem(str: string) {
  const turtle = createTurtle();
  const segments: JSX.Element[] = [];

  console.log(str);

  for (let i = 0; i < str.length; i++) {
    const c = str[i];

    switch (c) {
      // move forward
      case "F": {
        const start = new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z);
        turtle.pos.add(turtle.dir);
        const end = new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z);

        const road = (
          <Road key={"road" + i} segment={{ start: start, end: end }}></Road>
        );

        segments.push(road);

        // segments.push({
        //   start: start,
        //   end: end,
        // });
        break;
      }

      case "L": {
        const start = new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z);
        turtle.pos.add(turtle.dir);
        const end = new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z);

        const road = (
          <Road key={"road" + i} segment={{ start: start, end: end }}></Road>
        );

        segments.push(road);
        segments.push(
          <Building
            key={i}
            segment={{ start: start, end: end, left: true }}
          ></Building>,
        );
        break;
      }

      case "R": {
        const start = new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z);
        turtle.pos.add(turtle.dir);
        const end = new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z);

        const road = (
          <Road key={"road" + i} segment={{ start: start, end: end }}></Road>
        );

        segments.push(road);
        segments.push(
          <Building key={i} segment={{ start: start, end: end }}></Building>,
        );
        break;
      }

      // turn right
      case "+": {
        rotateY(turtle.dir, true);
        break;
      }

      // turn left
      case "-": {
        rotateY(turtle.dir, false);
        break;
      }

      // about to branch => save state
      case "[": {
        turtle.stack.push({
          pos: new Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z),
          dir: new Vector3(turtle.dir.x, turtle.dir.y, turtle.dir.z),
        });
        break;
      }

      // done with branch => restore state
      case "]": {
        const state = turtle.stack.pop();
        if (state) {
          turtle.pos = new Vector3(state.pos.x, state.pos.y, state.pos.z);
          turtle.dir = new Vector3(state.dir.x, state.dir.y, state.dir.z);
        }
        break;
      }
    }
  }

  return segments;
}

export const grammatikRoute = createRoute({
  component: Grammatik,
  path: "/grammatik",
  getParentRoute: () => rootRoute,
});
