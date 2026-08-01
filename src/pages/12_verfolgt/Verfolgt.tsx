import { useEffect, useRef, useState } from "react";
import ml5 from "ml5";
import { useWebcamStore } from "./webcam.store";
import { rootRoute } from "../../main";
import { createRoute } from "@tanstack/react-router";
import { useHandStore } from "./hand.store";
import { HandGrid } from "./components/HandGrid";

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  return Math.hypot(a.x - b.x, a.y - b.y);
};

const PINCH_START = 20;
const PINCH_END = 50;

const Verfolgt = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [shaderIndex, setShaderIndex] = useState(0);

  const startCamera = useWebcamStore((s) => s.startCamera);
  const stopCamera = useWebcamStore((s) => s.stopCamera);

  const setLeftHand = useHandStore((s) => s.setLeftHand);
  const setRightHand = useHandStore((s) => s.setRightHand);
  const clearHands = useHandStore((s) => s.clearHands);

  // const leftHand = useHandStore().leftHand;
  // const rightHand = useHandStore().rightHand;

  const rightPinchRef = useRef(false);
  const leftPinchRef = useRef(false);

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
      if (results.length === 0) {
        clearHands();
        return;
      }

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
          const fingerDistance = distance(thumbTip, indexTip);

          const newPinch = fingerDistance < PINCH_START;

          // only trigger when pinch starts
          if (!leftPinchRef.current && newPinch) {
            setShaderIndex((prev) => prev - 1);
          }

          // update previous state
          leftPinchRef.current = newPinch;

          setLeftHand(fingerData[0], fingerData[1], newPinch);
        }

        if (hand.handedness === "Right") {
          const fingerDistance = distance(thumbTip, indexTip);

          const newPinch = fingerDistance < PINCH_START;

          // only trigger when pinch starts
          if (!rightPinchRef.current && newPinch) {
            setShaderIndex((prev) => prev + 1);
          }

          // update previous state
          rightPinchRef.current = newPinch;

          setRightHand(fingerData[0], fingerData[1], newPinch);
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
      <HandGrid shaderIndex={shaderIndex} />
    </div>
  );
};

export const verfolgtRoute = createRoute({
  component: Verfolgt,
  path: "/verfolgt",
  getParentRoute: () => rootRoute,
});
