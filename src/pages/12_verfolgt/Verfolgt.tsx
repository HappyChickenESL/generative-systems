import { useEffect, useRef } from "react";
import ml5 from "ml5";
import { useWebcamStore } from "./webcam.store";
import { rootRoute } from "../../main";
import { createRoute } from "@tanstack/react-router";
import { useHandStore } from "./hand.store";
import { HandGrid } from "./components/HandGrid";

const Verfolgt = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useWebcamStore((s) => s.startCamera);
  const stopCamera = useWebcamStore((s) => s.stopCamera);

  const setLeftHand = useHandStore((s) => s.setLeftHand);
  const setRightHand = useHandStore((s) => s.setRightHand);

  useEffect(() => {
    if (videoRef.current) {
      startCamera(videoRef.current);
    }

    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (!videoRef.current) return;
    asyncMethod();
  }, []);

  const asyncMethod = async () => {
    const model = await ml5.handPose({
      maxHands: 2,
    });

    await model.ready;

    model.detectStart(videoRef.current, (results: any[]) => {
      results.forEach((hand) => {
        const thumbTip = hand.keypoints[4];
        const indexTip = hand.keypoints[8];

        const fingerData = [
          {
            x: thumbTip.x,
            y: thumbTip.y,
            z: thumbTip.z ?? 0,
          },
          {
            x: indexTip.x,
            y: indexTip.y,
            z: indexTip.z ?? 0,
          },
        ];

        if (hand.handedness === "Left") {
          setLeftHand(fingerData[0], fingerData[1]);
        }

        if (hand.handedness === "Right") {
          setRightHand(fingerData[0], fingerData[1]);
        }
      });
    });
  };

  return (
    <div className="relative">
      <video
        width={640}
        height={480}
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
      <HandGrid />
    </div>
  );
};

export const verfolgtRoute = createRoute({
  component: Verfolgt,
  path: "/verfolgt",
  getParentRoute: () => rootRoute,
});
