import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import {
  Bodies,
  Composite,
  Engine,
  Events,
  Render,
  Runner,
  World,
} from "matter-js";
import { useEffect, useRef } from "react";
import { createCloth } from "./components/cloth";
import { createArrow } from "./components/arrow";

const Disconnect = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());

  const engine = engineRef.current;

  const cloth = createCloth(engine);

  const bowRef = useRef({
    x: 0,
    y: 0,
    angle: 0,
    pullX: 0,
    pullY: 0,
  });

  useEffect(() => {
    if (!sceneRef.current) return;

    // Renderer
    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: 1500,
        height: 800,
        wireframes: false,
        background: "#222",
      },
    });

    const ground = Bodies.rectangle(750, 750, 1500, 50, {
      isStatic: true,
      render: {
        fillStyle: "green",
      },
    });

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      const bow = bowRef.current;

      ctx.save();

      ctx.translate(bow.x, bow.y);
      ctx.rotate(bow.angle);

      // Bow
      ctx.strokeStyle = "saddlebrown";
      ctx.lineWidth = 6;

      ctx.beginPath();
      ctx.arc(0, 0, 40, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // String
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -40);

      ctx.lineTo(bow.pullX, bow.pullY);
      ctx.lineTo(0, 40);
      ctx.stroke();

      ctx.restore();
    });

    // Add objects
    Composite.add(engine.world, [ground]);

    const runner = Runner.create();

    // Run engine
    Runner.run(runner, engine);

    // Run renderer
    Render.run(render);

    // Cleanup when component unmounts
    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  function shootArrow(e: React.MouseEvent) {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const startX = dragStart.current.x;
    const startY = dragStart.current.y;

    const dx = currentX - startX;
    const dy = currentY - startY;

    const pullDistance = Math.hypot(dx, dy);

    const power = Math.min(30, pullDistance / 10);

    console.log("Power:", power);

    createArrow(engine, cloth, startX, startY, bowRef.current.angle, power);
  }

  const isDragging = useRef(false);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const bow = bowRef.current;

    if (isDragging.current) {
      const dx = x - dragStart.current.x;
      const dy = y - dragStart.current.y;

      bow.pullX = dx * Math.cos(-bow.angle) - dy * Math.sin(-bow.angle);
      bow.pullY = dx * Math.sin(-bow.angle) + dy * Math.cos(-bow.angle);
      bow.angle = Math.atan2(dy, dx) + Math.PI;
    } else {
      bow.x = x;
      bow.y = y;
      bow.pullX = 0;
      bow.pullY = 0;
      bow.angle = 0;
    }
  }

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  return (
    <div>
      <div
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          const rect = sceneRef.current!.getBoundingClientRect();

          isDragging.current = true;

          dragStart.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };

          bowRef.current.x = dragStart.current.x;
          bowRef.current.y = dragStart.current.y;
        }}
        onMouseUp={() => {
          isDragging.current = false;
        }}
        onClick={shootArrow}
        ref={sceneRef}
      ></div>
    </div>
  );
};

export const disconnectRoute = createRoute({
  component: Disconnect,
  path: "/disconnect",
  getParentRoute: () => rootRoute,
});
