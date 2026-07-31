import { type ColorRepresentation } from "three";
import { Letter } from "./Letter";
import {
  UPPERCASE_LETTERS,
  type Point3,
  type UppercaseLetter,
} from "../klartext.model";
import type { ObfuscationOptions } from "../klartext.obfuscation.ts";
import seedrandom from "seedrandom";

interface WordProps {
  text: string;
  position: Point3;
  scale?: number;
  color?: ColorRepresentation;
  spacing?: number;
  lineWidth?: number;
  obfuscationAmount?: number;
}

const SUPPORTED_LETTERS: Set<string> = new Set(UPPERCASE_LETTERS);

// crazy returntype lol
// typescript ist zu geil
const isWordCharacter = (value: string): value is UppercaseLetter => {
  return value !== "#" && SUPPORTED_LETTERS.has(value);
};

export const Word = ({
  text,
  position,
  scale = 1,
  color,
  spacing = 1.5,
  lineWidth,
  obfuscationAmount,
}: WordProps) => {
  const characters = text.split("").filter(isWordCharacter);

  const rng = seedrandom(Date.now().toString());

  const obfuscation: ObfuscationOptions = {
    amount: obfuscationAmount ?? 0,
    seed: String(rng()),
  };

  return (
    <group position={position}>
      {characters.map((character, index) => (
        <Letter
          key={`${character}-${index}`}
          character={character}
          position={[index * spacing, 0, 0]}
          scale={scale}
          color={color}
          lineWidth={lineWidth}
          obfuscation={obfuscation}
        />
      ))}
    </group>
  );
};
