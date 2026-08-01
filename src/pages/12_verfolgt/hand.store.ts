import { create } from "zustand";

interface FingerPosition {
  x: number;
  y: number;
  z: number;
}

interface HandPosition {
  thumbTip: FingerPosition | null;
  indexTip: FingerPosition | null;
}

interface HandStore {
  leftHand: HandPosition;
  rightHand: HandPosition;

  setLeftHand: (thumbTip: FingerPosition, indexTip: FingerPosition) => void;

  setRightHand: (thumbTip: FingerPosition, indexTip: FingerPosition) => void;

  clearHands: () => void;
}

const emptyHand: HandPosition = {
  thumbTip: null,
  indexTip: null,
};

export const useHandStore = create<HandStore>((set) => ({
  leftHand: emptyHand,
  rightHand: emptyHand,

  setLeftHand: (thumbTip, indexTip) =>
    set({
      leftHand: {
        thumbTip,
        indexTip,
      },
    }),

  setRightHand: (thumbTip, indexTip) =>
    set({
      rightHand: {
        thumbTip,
        indexTip,
      },
    }),

  clearHands: () =>
    set({
      leftHand: emptyHand,
      rightHand: emptyHand,
    }),
}));
