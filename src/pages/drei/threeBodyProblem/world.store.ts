import { Vector3 } from "three";
import { create } from "zustand";

export type BodyState = {
  mass: number;
  position: Vector3;
  velocity: Vector3;
  color: string;
};

interface WorldState {
  bodies: Record<string, BodyState>;

  addBody: (id: string, body: BodyState) => void;
  removeBody: (id: string) => void;
}

export const useWorld = create<WorldState>((set) => ({
  bodies: {
    earth: {
      mass: 100,
      position: new Vector3(0, 0, 0),
      velocity: new Vector3(0, 0, 0),
      color: "blue",
    },
    moon: {
      mass: 5,
      position: new Vector3(5, 0, 0),
      velocity: new Vector3(0, 2.2, 0),
      color: "gray",
    },
    jupiter: {
      mass: 20,
      position: new Vector3(-5, -5, 0),
      velocity: new Vector3(2, -0.5, 0),
      color: "orange",
    },
  },

  addBody: (id: string, body: BodyState) =>
    set((state) => ({
      bodies: {
        ...state.bodies,
        [id]: body,
      },
    })),

  removeBody: (id: string) =>
    set((state) => {
      const copy = { ...state.bodies };
      delete copy[id];
      return { bodies: copy };
    }),
}));
