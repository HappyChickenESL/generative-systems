import Matter, { Engine } from "matter-js";
import { tearCloth, type Cloth } from "./cloth";

export interface Arrow {
  body: Matter.Body;
}

export const createArrow = (
  engine: Engine,
  cloth: Cloth,
  x: number = 100,
  y: number = 100,
  angle: number,
  power: number,
): Arrow => {
  const body = Matter.Bodies.rectangle(x, y, 80, 8, {
    restitution: 0,
    frictionAir: 0.01,
    density: 0.002,
    render: {
      fillStyle: "#8B4513",
    },
  });

  Matter.Body.setVelocity(body, {
    x: Math.cos(angle) * power,
    y: Math.sin(angle) * power,
  });

  Matter.Composite.add(engine.world, body);

  const collisionListener = () => {
    tearCloth(engine, cloth, body.position, 50);
  };

  Matter.Events.on(engine, "afterUpdate", collisionListener);

  return {
    body,
  };
};
