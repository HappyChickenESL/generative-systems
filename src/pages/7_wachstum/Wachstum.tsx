import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Seed } from "./components/Seed";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { useEffect, useState, type JSX } from "react";
import { random } from "culori";
import { Button } from "../../shared/components/Button";

type ColorMode = "random" | "angle" | "radius" | "spiral";

const modes: ColorMode[] = ["random", "angle", "radius", "spiral"];

type SeedData = {
  x: number;
  y: number;
  radius: number;
  angle: number;
  size: number;
};

const Wachstum = () => {
  const [zoom, setZoom] = useState(10);
  const [colorMode, setColorMode] = useState<ColorMode>("angle");
  const [seeds, setSeeds] = useState<JSX.Element[]>([]);

  // Phyllotaxis: Golden angle (137.5°) in radians
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996 rad ≈ 137.5°
  const scaleFactor = 0.75; // Scale the radius
  const count = 1_000; // Number of seeds

  const updateZoom = (direction: number) => {
    setZoom(direction > 0 ? zoom - 1 : zoom + 1);
  };

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

  const [seedData, setSeedData] = useState<SeedData[]>([]);

  useEffect(() => {
    const data: SeedData[] = [];
    for (let i = 0; i < count; i++) {
      const radius = scaleFactor * Math.sqrt(i);
      const angle = i * goldenAngle;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const size = 0.1 + (i / count) * 0.5;
      data.push({ x, y, radius, angle, size });
    }
    setSeedData(data);
  }, [scaleFactor, count]);

  useEffect(() => {
    const newSeeds = seedData.map((data, i) => (
      <mesh key={i} position={[data.x, data.y, 0]}>
        <Seed size={data.size} color={getColor(i, data.radius, data.angle)} />
      </mesh>
    ));
    setSeeds(newSeeds);
  }, [colorMode, seedData]);

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-10 m-4">
        <div>Select color variant</div>
        {modes.map((mode) => (
          <Button
            key={mode}
            onClick={() => setColorMode(mode)}
            className={`${
              colorMode === mode
                ? "bg-black! border-white border text-white font-bold"
                : ""
            }`}
          >
            {mode === "random" && "Random"}
            {mode === "angle" && "Winkel"}
            {mode === "radius" && "Radius"}
            {mode === "spiral" && "Spiralen"}
          </Button>
        ))}
      </div>
      <div className="flex-1 border-4 rounded-xl p-1">
        <Canvas onWheel={(e) => updateZoom(e.deltaY)}>
          <OrthographicCamera makeDefault zoom={zoom} position={[0, 0, 10]} />
          {...seeds}
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
