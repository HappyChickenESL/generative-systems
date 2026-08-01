import Matter, { Engine, Render } from "matter-js";
import { tearCloth, type Cloth } from "./cloth";

export interface Arrow {
  body: Matter.Body;
}

export const createArrow = (
  engine: Engine,
  render: Render,
  cloth: Cloth,
  x: number = 100,
  y: number = 100,
  angle: number,
  power: number,
): Arrow => {
  const body = Matter.Bodies.rectangle(x, y, 90, 6, {
    restitution: 0,
    frictionAir: 0.01,
    density: 0.002,
    angle: angle,
    chamfer: {
      radius: 3,
    },
    render: {
      visible: false,
    },
  });

  Matter.Body.setVelocity(body, {
    x: Math.cos(angle) * power,
    y: Math.sin(angle) * power,
  });

  Matter.Composite.add(engine.world, body);

  const collisionListener = () => {
    tearCloth(engine, cloth, body.position, 50);

    const velocity = body.velocity;

    const speed = Math.hypot(velocity.x, velocity.y);

    if (speed > 3) {
      Matter.Body.setAngle(body, Math.atan2(velocity.y, velocity.x));
    }
  };

  Matter.Events.on(render, "afterRender", () => {
    const ctx = render.context;

    ctx.save();

    ctx.translate(body.position.x, body.position.y);

    ctx.rotate(body.angle);

    // Shaft
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-45, 0);
    ctx.lineTo(35, 0);
    ctx.stroke();

    // Arrow head
    ctx.fillStyle = "silver";

    ctx.beginPath();

    ctx.moveTo(45, 0); // tip
    ctx.lineTo(30, -8);
    ctx.lineTo(30, 8);

    ctx.closePath();
    ctx.fill();

    // Feathers
    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.moveTo(-35, 0);
    ctx.lineTo(-45, -10);
    ctx.lineTo(-20, -3);
    ctx.closePath();

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(-35, 0);
    ctx.lineTo(-45, 10);
    ctx.lineTo(-20, 3);
    ctx.closePath();

    ctx.fill();

    ctx.restore();
  });

  Matter.Events.on(engine, "afterUpdate", collisionListener);

  return {
    body,
  };
};
