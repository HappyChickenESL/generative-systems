export const UPPERCASE_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
] as const;

export type UppercaseLetter = (typeof UPPERCASE_LETTERS)[number];

// Vector3 has a lot of unneccessary overhead => worse performance
// todo: add globally
export type Point3 = [number, number, number];
