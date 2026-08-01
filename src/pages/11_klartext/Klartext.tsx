import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Word } from "./components/Word";
import { useState } from "react";
import { formatHex } from "culori";
import { minMaxRand } from "../../shared/utils";
import { Input } from "../../shared/components/Input";

const randomColor = () =>
  formatHex({
    mode: "oklch",
    l: 0.6 + Math.random() * 0.25,
    c: 0.08 + Math.random() * 0.2,
    h: Math.random() * 360,
  });

const wordScale = 1;
const letterSpacing = 1.5;
const lineHeight = 3;

const Klartext = () => {
  const [obfuscationAmount, setObfuscationAmount] = useState(
    minMaxRand(0.1, 0.7),
  );
  const [obfuscationText, setObfuscationText] = useState("merz leck eier");
  const [color, setColor] = useState(() => randomColor());

  const words = obfuscationText
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const firstLineY = ((words.length - 1) * lineHeight) / 2;

  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-10 m-4">
        <Input
          label="Obfuscation Text"
          id="obfuscation-text"
          type="text"
          value={obfuscationText}
          onChange={(event) => setObfuscationText(event.target.value)}
        />
        <Input
          label="Obfuscation Level"
          id="obfuscation-slider"
          type="range"
          className="range"
          min={0}
          max={1}
          step={0.05}
          value={obfuscationAmount}
          onChange={(event) => setObfuscationAmount(Number(event.target.value))}
        />
        {/* <Button type="button" onClick={generate}>
          Regenerate
        </Button> */}
      </div>
      <div className="flex-1 border-4 rounded-xl p-1">
        <Canvas>
          <OrthographicCamera makeDefault zoom={90} position={[0, 0, 10]} />
          {words.map((text, index) => {
            const centeredX =
              -((text.length - 1) * letterSpacing * wordScale) / 2;
            const y = firstLineY - index * lineHeight;

            return (
              <Word
                key={`${text}-${index}`}
                obfuscationAmount={obfuscationAmount}
                position={[centeredX, y, 0]}
                scale={wordScale}
                spacing={letterSpacing}
                text={text}
                color={color}
              ></Word>
            );
          })}
        </Canvas>
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      <div className="w-60 flex flex-col space-y-6 p-2">
        <div className="flex flex-col space-y-2">
          <label htmlFor="obfuscation-slider">
            Amount: {obfuscationAmount.toFixed(2)}
          </label>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="color-picker">Color</label>
          <input
            id="color-picker"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 border-4"></div>
    </div>
  );
};

export const klartextRoute = createRoute({
  component: Klartext,
  path: "/klartext",
  getParentRoute: () => rootRoute,
});
