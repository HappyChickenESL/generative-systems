import type { Point3 } from "./klartext.model";

export const Point3Utils = {
  add: (a: Point3, b: Point3): Point3 => [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
  ],

  sub: (a: Point3, b: Point3): Point3 => [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ],

  mul: (v: Point3, scalar: number): Point3 => [
    v[0] * scalar,
    v[1] * scalar,
    v[2] * scalar,
  ],

  length: (v: Point3) => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),

  normalize: (v: Point3): Point3 => {
    const len = Point3Utils.length(v);

    if (len < 1e-6) {
      return [1, 0, 0];
    }

    return [v[0] / len, v[1] / len, v[2] / len];
  },

  rotateAroundZ: (v: Point3, radians: number): Point3 => {
    const cosA = Math.cos(radians);
    const sinA = Math.sin(radians);

    return [v[0] * cosA - v[1] * sinA, v[0] * sinA + v[1] * cosA, v[2]];
  },

  midpoint: (start: Point3, end: Point3): Point3 => [
    (start[0] + end[0]) * 0.5,
    (start[1] + end[1]) * 0.5,
    (start[2] + end[2]) * 0.5,
  ],
};
