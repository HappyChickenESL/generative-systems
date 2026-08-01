import Matter, { Engine } from "matter-js";

export interface Cloth {
  particles: Matter.Body[];
  constraints: Matter.Constraint[];
}

export const createCloth = (engine: Engine): Cloth => {
  const particles: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  const cols = 20;
  const rows = 10;
  const spacing = 25;

  const startX = 1000;
  const startY = 100;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const particle = Matter.Bodies.circle(
        startX + x * spacing,
        startY + y * spacing,
        4,
        {
          friction: 0.8,
          frictionAir: 0.02,
        },
      );

      particles.push(particle);

      // Horizontal connection
      if (x > 0) {
        constraints.push(
          Matter.Constraint.create({
            bodyA: particle,
            bodyB: particles[particles.length - 2],
            length: spacing,
            stiffness: 0.8,
          }),
        );
      }

      // Vertical connection
      if (y > 0) {
        constraints.push(
          Matter.Constraint.create({
            bodyA: particle,
            bodyB: particles[(y - 1) * cols + x],
            length: spacing,
            stiffness: 0.8,
          }),
        );
      }
    }
  }

  // Pin the top row
  for (let x = 0; x < cols; x++) {
    Matter.Body.setStatic(particles[x], true);
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
