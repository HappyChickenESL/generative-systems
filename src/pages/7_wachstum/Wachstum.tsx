import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Seed } from "./components/Seed";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { useState, type JSX } from "react";
import { random } from "culori";

type ColorMode = "random" | "angle" | "radius" | "spiral";

const Wachstum = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("angle");
  const shapes: JSX.Element[] = [];

  // Phyllotaxis: Golden angle (137.5°) in radians
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996 rad ≈ 137.5°
  const scaleFactor = 1; // Scale the radius
  const count = 2000; // Number of seeds

  // Fibonacci numbers for spiral detection
  const fibonacciNumbers = new Set<number>();
  let a = 1,
    b = 1;
  while (a < count) {
    fibonacciNumbers.add(a);
    [a, b] = [b, a + b];
  }

  const getColor = (i: number, radius: number, angle: number): string => {
    switch (colorMode) {
      case "random":
        const rand = random("rgb");
        return `rgb(${Math.round(rand.r * 255)}, ${Math.round(rand.g * 255)}, ${Math.round(rand.b * 255)})`;

      case "angle":
        const hueAngle = ((angle * 180) / Math.PI) % 360;
        return `hsl(${hueAngle}, 70%, 50%)`;

      case "radius":
        const maxRadius = scaleFactor * Math.sqrt(count);
        const hueRadius = (radius / maxRadius) * 360;
        return `hsl(${hueRadius}, 70%, 50%)`;

      case "spiral":
        const spiralIndex = i % 5;
        const hueSpiralBranch = (spiralIndex / 5) * 360;
        return `hsl(${hueSpiralBranch}, 70%, 50%)`;
    }
  };

  for (let i = 0; i < count; i++) {
    // Fibonacci-based radius: sqrt(n) gives nice spacing
    const radius = scaleFactor * Math.sqrt(i);

    // Angle based on golden angle
    const angle = i * goldenAngle;

    // Polar to Cartesian coordinates
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    // Size based on index (smaller seeds further out or vice versa)
    const size = 0.1 + (i / count) * 0.3;

    const color = getColor(i, radius, angle);

    shapes.push(
      <mesh key={i} position={[x, y, 0]}>
        <Seed size={size} color={color} />
      </mesh>,
    );
  }

  const modes: ColorMode[] = ["random", "angle", "radius", "spiral"];

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2 p-4">
        <h2 className="font-bold">Phyllotaxis</h2>
        <p className="text-sm">
          Fibonacci-Spirale basierend auf dem Goldenen Winkel
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold">Färbung:</p>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setColorMode(mode)}
              className={`w-full px-2 py-1 text-xs rounded ${
                colorMode === mode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {mode === "random" && "Random"}
              {mode === "angle" && "Winkel"}
              {mode === "radius" && "Radius"}
              {mode === "spiral" && "Spiralen"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 border-4">
        <Canvas>
          <OrthographicCamera makeDefault zoom={10} position={[0, 0, 10]} />
          {...shapes}
        </Canvas>
      </div>
    </div>
  );
};

export const wachstumRoute = createRoute({
  component: Wachstum,
  path: "/wachstum",
  getParentRoute: () => rootRoute,
});
