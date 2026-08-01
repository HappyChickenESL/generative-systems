import { create } from "zustand";

interface ModalStore {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  visible: false,

  setVisible: (visible) => set({ visible }),
}));
