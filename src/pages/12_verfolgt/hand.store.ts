import { create } from "zustand";

interface FingerPosition {
  x: number;
  y: number;
  z: number;
}

interface HandPosition {
  thumbTip: FingerPosition | null;
  indexTip: FingerPosition | null;
  isPinching: boolean;
}

interface HandStore {
  leftHand: HandPosition;
  rightHand: HandPosition;

  setLeftHand: (
    thumbTip: FingerPosition,
    indexTip: FingerPosition,
    isPinching: boolean,
  ) => void;

  setRightHand: (
    thumbTip: FingerPosition,
    indexTip: FingerPosition,
    isPinching: boolean,
  ) => void;

  clearHands: () => void;
}

const emptyHand: HandPosition = {
  thumbTip: null,
  indexTip: null,
  isPinching: false,
};

export const useHandStore = create<HandStore>((set) => ({
  leftHand: emptyHand,
  rightHand: emptyHand,

  setLeftHand: (thumbTip, indexTip, isPinching) =>
    set({
      leftHand: {
        thumbTip,
        indexTip,
        isPinching,
      },
    }),

  setRightHand: (thumbTip, indexTip, isPinching) =>
    set({
      rightHand: {
        thumbTip,
        indexTip,
        isPinching,
      },
    }),

  clearHands: () =>
    set({
      leftHand: emptyHand,
      rightHand: emptyHand,
    }),
}));
