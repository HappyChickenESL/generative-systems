import { minMaxRand } from "../../../shared/utils";
import { interpretLSystem } from "../Grammatik";
import { Roads } from "./Roads";

type RuleSymbol = "A" | "F";

export default function City() {
  const segments = interpretLSystem(generateLSystem());
  // return <Roads segments={segments} />;
  return <>{...segments}</>;
}

export function generateLSystem(iterations = 5) {
  let current = "A";

  const rules: Record<RuleSymbol, () => string> = {
    A: () => {
      return "F[+A]F[-A]FA";
    },
    F: () => {
      const rand = minMaxRand(0, 1);
      if (rand < 0.15) {
        return "R";
      }
      if (rand < 0.3) {
        return "L";
      }
      return "FF";
    },
  };

  for (let i = 0; i < iterations; i++) {
    let next = "";

    for (let char of current) {
      next += char === "A" || char === "F" ? rules[char]() : char;
    }

    current = next;
  }

  return current;
}
