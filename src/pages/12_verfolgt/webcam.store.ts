import { create } from "zustand";

interface WebcamStore {
  video: HTMLVideoElement | null;
  stream: MediaStream | null;
  isRunning: boolean;
  error: string | null;

  startCamera: (video: HTMLVideoElement) => Promise<void>;
  stopCamera: () => void;
}

export const useWebcamStore = create<WebcamStore>((set, get) => ({
  video: null,
  stream: null,
  isRunning: false,
  error: null,

  startCamera: async (video: HTMLVideoElement) => {
    // Prevent starting twice
    if (get().isRunning) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      video.srcObject = stream;

      // Wait until metadata is loaded
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      set({
        video,
        stream,
        isRunning: true,
        error: null,
      });
    } catch (err) {
      console.error(err);

      set({
        error: err instanceof Error ? err.message : "Could not access webcam.",
      });
    }
  },

  stopCamera: () => {
    const { stream } = get();

    stream?.getTracks().forEach((track) => track.stop());

    set({
      video: null,
      stream: null,
      isRunning: false,
      error: null,
    });
  },
}));
