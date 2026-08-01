import Matter, { Engine } from "matter-js";
import { minMaxRand } from "../../../shared/utils";

export interface Cloth {
  particles: Matter.Body[];
  constraints: Matter.Constraint[];
}

export const createCloth = (engine: Engine): Cloth => {
  const particles: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  const cols = Math.floor(minMaxRand(20, 30));
  const rows = Math.floor(minMaxRand(20, 25));

  const spacing = 25;

  const startX = 500;
  const startY = 100;

  const particleIndex = (x: number, y: number) => y * cols + x;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // organic fabric deformation
      const waveX = Math.sin(y * 0.8) * 5;
      const waveY = Math.cos(x * 0.5) * 5;

      const randomX = (Math.random() - 0.5) * 12;
      const randomY = (Math.random() - 0.5) * 12;

      const particle = Matter.Bodies.circle(
        startX + x * spacing + waveX + randomX,
        startY + y * spacing + waveY + randomY,
        3 + Math.random() * 3,
        {
          friction: 0.8,
          frictionAir: 0.01 + Math.random() * 0.03,
        },
      );

      particles.push(particle);

      // horizontal threads
      if (x > 0) {
        if (Math.random() > 0.08) {
          constraints.push(
            Matter.Constraint.create({
              bodyA: particle,
              bodyB: particles[particleIndex(x - 1, y)],
              length: spacing + (Math.random() - 0.5) * 8,
              stiffness: 0.4 + Math.random() * 0.5,
            }),
          );
        }
      }

      // vertical threads
      if (y > 0) {
        if (Math.random() > 0.08) {
          constraints.push(
            Matter.Constraint.create({
              bodyA: particle,
              bodyB: particles[particleIndex(x, y - 1)],
              length: spacing + (Math.random() - 0.5) * 8,
              stiffness: 0.4 + Math.random() * 0.5,
            }),
          );
        }
      }
    }
  }

  // irregular pinned top edge
  for (let x = 0; x < cols; x++) {
    if (Math.random() > 0.15) {
      Matter.Body.setStatic(particles[x], true);
    }
  }

  Matter.Composite.add(engine.world, [...particles, ...constraints]);

  return {
    particles,
    constraints,
  };
};

export const tearCloth = (
  engine: Matter.Engine,
  cloth: Cloth,
  position: Matter.Vector,
  radius: number = 40,
) => {
  const remainingConstraints: Matter.Constraint[] = [];

  for (const constraint of cloth.constraints) {
    if (!constraint.bodyA || !constraint.bodyB) continue;

    const a = constraint.bodyA.position;
    const b = constraint.bodyB.position;

    // midpoint of the connection
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;

    const dx = midX - position.x;
    const dy = midY - position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      // remove this thread
      Matter.Composite.remove(engine.world, constraint);
    } else {
      remainingConstraints.push(constraint);
    }
  }

  // update stored constraints
  cloth.constraints.length = 0;
  cloth.constraints.push(...remainingConstraints);
};

export const destroyCloth = (engine: Matter.Engine, cloth: Cloth) => {
  Matter.Composite.remove(engine.world, [
    ...cloth.particles,
    ...cloth.constraints,
  ]);
};
