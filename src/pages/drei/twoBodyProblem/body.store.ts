import { Vector3 } from "three";
import { type Vector3 as Vector3Type } from "three";
import { create } from "zustand";

export interface BodyProps {
  mass: number;
  position: Vector3Type;
  velocity: Vector3Type;
  color: string;
  setPosition: (pos: Vector3Type) => void;
  setVelocity: (velocity: Vector3Type) => void;
}

export const useBodyOne = create<BodyProps>((set) => ({
  mass: 5,
  position: new Vector3(-2, 0, 0),
  velocity: new Vector3(0, 0.5, 0),
  color: "orange",
  setPosition: (newPos) => set(() => ({ position: newPos })),
  setVelocity: (newVelocity) => set(() => ({ velocity: newVelocity })),
}));

export const useBodyTwo = create<BodyProps>((set) => ({
  mass: 5,
  position: new Vector3(2, 0, 0),
  velocity: new Vector3(0, -0.5, 0),
  color: "skyblue",
  setPosition: (newPos) => set(() => ({ position: newPos })),
  setVelocity: (newVelocity) => set(() => ({ velocity: newVelocity })),
}));
