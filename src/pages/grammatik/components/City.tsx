import { interpretLSystem } from "../Grammatik";
import { Roads } from "./Roads";

const segments = interpretLSystem(generateLSystem(), 2, 25);

export default function City() {
  return <Roads segments={segments} />;
}

export function generateLSystem(iterations = 5) {
  // let current = "A";

  // const rules = {
  //   A: "F[+A]F[-A]FA",
  //   F: "FF",
  // };

  // for (let i = 0; i < iterations; i++) {
  //   let next = "";

  //   // for (let char of current) {
  //     // next += rules[char] || char; // keep character if no rule
  //   }

  //   current = next;
  // }

  // return current;
  console.log(iterations);
  return "A";
}
