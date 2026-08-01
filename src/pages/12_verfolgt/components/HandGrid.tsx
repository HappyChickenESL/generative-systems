import { useEffect, useRef } from "react";
import { useHandStore } from "../hand.store";

export const HandGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const leftHand = useHandStore((s) => s.leftHand);
  const rightHand = useHandStore((s) => s.rightHand);

  // if (thumb) {
  //   console.log(thumb);
  // }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lt = leftHand.thumbTip;
    const rt = rightHand.thumbTip;
    const li = leftHand.indexTip;
    const ri = rightHand.indexTip;

    if (!lt || !rt || !li || !ri) return;

    drawPolygonGrid(ctx, lt, rt, ri, li);
  }, [leftHand, rightHand]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: 640,
        height: 480,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        border: "2px solid red",
      }}
    />
  );
};

function drawPolygonGrid(
  ctx: CanvasRenderingContext2D,
  lt: { x: number; y: number },
  rt: { x: number; y: number },
  ri: { x: number; y: number },
  li: { x: number; y: number },
  divisions = 10,
) {
  ctx.save();

  ctx.strokeStyle = "lime";
  ctx.lineWidth = 1;

  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions;

    // vertical lines
    const top = lerpPoint(lt, rt, t);
    const bottom = lerpPoint(li, ri, t);

    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();

    // horizontal lines
    const left = lerpPoint(lt, li, t);
    const right = lerpPoint(rt, ri, t);

    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }

  ctx.restore();
}

function lerpPoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}
