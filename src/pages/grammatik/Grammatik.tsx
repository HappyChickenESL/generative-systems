import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import City from "./components/City";
import { OrbitControls } from "@react-three/drei";

const Grammatik = () => {
  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <OrbitControls></OrbitControls>
          <City></City>
        </Canvas>
      </div>
    </div>
  );
};

export const grammatikRoute = createRoute({
  component: Grammatik,
  path: "/grammatik",
  getParentRoute: () => rootRoute,
});

function createTurtle(): { pos: number[]; dir: number[]; stack: any } {
  return {
    pos: [0, 0, 0],
    dir: [0, 0, -1], // forward direction
    stack: [],
  };
}

function add(a: number[], b: number[]) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: number[], s: number) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function rotateY([x, y, z]: number[], angleDeg: number) {
  const a = angleDeg * (Math.PI / 180);
  console.log(a, z);

  if (angleDeg < 0) {
    return [x + 1, y, x - 1];
  } else {
    return [x - 1, y, x + 1];
  }
}

export function interpretLSystem(str: string, step = 1, angle = 90) {
  const turtle = createTurtle();
  const segments = [];

  console.log(str);

  for (let i = 0; i < str.length; i++) {
    const c = str[i];

    switch (c) {
      // 🚧 Move forward + draw road
      case "F": {
        const start = [...turtle.pos];

        const move = scale(turtle.dir, step);
        turtle.pos = add(turtle.pos, move);

        const end = [...turtle.pos];

        segments.push({ start, end });
        break;
      }

      // ↪ turn right
      case "+": {
        turtle.dir = rotateY(turtle.dir, angle);
        break;
      }

      // ↩ turn left
      case "-": {
        turtle.dir = rotateY(turtle.dir, -angle);
        break;
      }

      // 📦 save state (branch)
      case "[": {
        turtle.stack.push({
          pos: [...turtle.pos],
          dir: [...turtle.dir],
        });
        break;
      }

      // 📤 restore state
      case "]": {
        const state = turtle.stack.pop();
        if (state) {
          turtle.pos = state.pos;
          turtle.dir = state.dir;
        }
        break;
      }
    }
  }

  return segments;
}
