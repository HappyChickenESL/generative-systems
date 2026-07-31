import { useEffect, useRef } from "react";
import { applyDithering } from "../spiegelbild.dithering";

type SelectedPreviews = {
  dark: string | null;
  bright: string | null;
};

type ImageDitherCanvasProps = {
  sampleStep: number;
  regenerateSeed: number;
  darkMinBrightness: number;
  darkMaxBrightness: number;
  brightMinBrightness: number;
  brightMaxBrightness: number;
  image: HTMLImageElement | null;
  onSelectedPreviewsChange?: (previews: SelectedPreviews) => void;
};

export const ImageDitherCanvas = ({
  sampleStep,
  regenerateSeed,
  darkMinBrightness,
  darkMaxBrightness,
  brightMinBrightness,
  brightMaxBrightness,
  image,
  onSelectedPreviewsChange,
}: ImageDitherCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) {
      onSelectedPreviewsChange?.({ dark: null, bright: null });
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const baseThreshold = 128;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const ditherMask = applyDithering(imageData, {
      threshold: baseThreshold,
      sampleStep,
    });
    const stampResolution = Math.max(32, ditherMask.sampleStep * 6);
    const tileRenderSize = Math.max(1, ditherMask.sampleStep * 2);

    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = image.naturalWidth;
    sourceCanvas.height = image.naturalHeight;
    const sourceContext = sourceCanvas.getContext("2d");

    if (!sourceContext) {
      return;
    }

    sourceContext.drawImage(image, 0, 0);

    const normalizedDarkMin = Math.max(
      0,
      Math.min(255, Math.min(darkMinBrightness, darkMaxBrightness)),
    );
    const normalizedDarkMax = Math.max(
      0,
      Math.min(255, Math.max(darkMinBrightness, darkMaxBrightness)),
    );
    const normalizedBrightMin = Math.max(
      0,
      Math.min(255, Math.min(brightMinBrightness, brightMaxBrightness)),
    );
    const normalizedBrightMax = Math.max(
      0,
      Math.min(255, Math.max(brightMinBrightness, brightMaxBrightness)),
    );
    const sectionWidth = Math.max(1, Math.floor(sourceCanvas.width * 0.2));
    const sectionHeight = Math.max(1, Math.floor(sourceCanvas.height * 0.2));
    const maxStartX = Math.max(0, sourceCanvas.width - sectionWidth);
    const maxStartY = Math.max(0, sourceCanvas.height - sectionHeight);
    const scanAttempts = 1000;

    type SectionCandidate = {
      x: number;
      y: number;
      brightness: number;
    };

    type StampTone = "dark" | "bright";

    const getMaskSectionBrightness = (
      startX: number,
      startY: number,
      width: number,
      height: number,
    ) => {
      const maskStartX = Math.max(
        0,
        Math.floor(startX / ditherMask.sampleStep),
      );
      const maskStartY = Math.max(
        0,
        Math.floor(startY / ditherMask.sampleStep),
      );
      const maskEndX = Math.min(
        ditherMask.sampledWidth,
        Math.ceil((startX + width) / ditherMask.sampleStep),
      );
      const maskEndY = Math.min(
        ditherMask.sampledHeight,
        Math.ceil((startY + height) / ditherMask.sampleStep),
      );

      let darkCount = 0;
      let totalCount = 0;

      for (let maskY = maskStartY; maskY < maskEndY; maskY += 1) {
        for (let maskX = maskStartX; maskX < maskEndX; maskX += 1) {
          const maskIndex = maskY * ditherMask.sampledWidth + maskX;

          darkCount += ditherMask.data[maskIndex];
          totalCount += 1;
        }
      }

      if (totalCount === 0) {
        return 255;
      }

      const lightCount = totalCount - darkCount;

      return (lightCount / totalCount) * 255;
    };

    let darkCandidate: SectionCandidate | null = null;
    let brightCandidate: SectionCandidate | null = null;

    for (let attempt = 0; attempt < scanAttempts; attempt += 1) {
      const x = Math.floor(Math.random() * (maxStartX + 1));
      const y = Math.floor(Math.random() * (maxStartY + 1));

      const brightness = getMaskSectionBrightness(
        x,
        y,
        sectionWidth,
        sectionHeight,
      );

      if (
        brightness >= normalizedDarkMin &&
        brightness <= normalizedDarkMax &&
        !darkCandidate
      ) {
        console.log(normalizedBrightMax);
        console.log(normalizedBrightMin);
        console.log(normalizedDarkMax);
        console.log(normalizedDarkMin);
        darkCandidate = { x, y, brightness };
      }

      if (
        brightness >= normalizedBrightMin &&
        brightness <= normalizedBrightMax &&
        !brightCandidate
      ) {
        brightCandidate = { x, y, brightness };
      }
    }

    const fallbackBrightness = getMaskSectionBrightness(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
    );
    const fallbackX = Math.floor(maxStartX / 2);
    const fallbackY = Math.floor(maxStartY / 2);
    const fallbackCandidate = {
      x: fallbackX,
      y: fallbackY,
      brightness: fallbackBrightness,
    };

    const resolvedDarkCandidate = darkCandidate ?? fallbackCandidate;
    const resolvedBrightCandidate = brightCandidate ?? fallbackCandidate;

    const buildStampCanvas = (candidate: SectionCandidate, tone: StampTone) => {
      const stampCanvas = document.createElement("canvas");
      stampCanvas.width = stampResolution;
      stampCanvas.height = stampResolution;

      const stampContext = stampCanvas.getContext("2d");

      if (!stampContext) {
        return null;
      }

      stampContext.imageSmoothingEnabled = true;
      stampContext.drawImage(
        sourceCanvas,
        candidate.x,
        candidate.y,
        sectionWidth,
        sectionHeight,
        0,
        0,
        stampResolution,
        stampResolution,
      );

      const stampImageData = stampContext.getImageData(
        0,
        0,
        stampResolution,
        stampResolution,
      );
      const stampPixels = stampImageData.data;
      const toneBias = tone === "dark" ? -20 : 15;
      const toneThreshold =
        tone === "dark"
          ? Math.max(0, baseThreshold - 20)
          : Math.min(255, baseThreshold + 25);

      for (
        let pixelOffset = 0;
        pixelOffset < stampPixels.length;
        pixelOffset += 4
      ) {
        const red = stampPixels[pixelOffset];
        const green = stampPixels[pixelOffset + 1];
        const blue = stampPixels[pixelOffset + 2];
        const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;
        const biasedGrayscale = Math.max(
          0,
          Math.min(255, grayscale + toneBias),
        );
        const bwValue = biasedGrayscale < toneThreshold ? 0 : 255;

        stampPixels[pixelOffset] = bwValue;
        stampPixels[pixelOffset + 1] = bwValue;
        stampPixels[pixelOffset + 2] = bwValue;
        stampPixels[pixelOffset + 3] = 255;
      }

      stampContext.putImageData(stampImageData, 0, 0);

      return stampCanvas;
    };

    const darkStampCanvas = buildStampCanvas(resolvedDarkCandidate, "dark");
    const brightStampCanvas = buildStampCanvas(
      resolvedBrightCandidate,
      "bright",
    );

    if (!darkStampCanvas || !brightStampCanvas) {
      onSelectedPreviewsChange?.({ dark: null, bright: null });
      return;
    }

    onSelectedPreviewsChange?.({
      dark: darkStampCanvas.toDataURL(),
      bright: brightStampCanvas.toDataURL(),
    });

    canvas.width = ditherMask.sampledWidth * tileRenderSize;
    canvas.height = ditherMask.sampledHeight * tileRenderSize;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;

    for (let y = 0; y < ditherMask.sampledHeight; y += 1) {
      for (let x = 0; x < ditherMask.sampledWidth; x += 1) {
        const index = y * ditherMask.sampledWidth + x;
        const shouldUseDarkStamp = ditherMask.data[index] === 1;

        const tileX = x * tileRenderSize;
        const tileY = y * tileRenderSize;

        context.drawImage(
          shouldUseDarkStamp ? darkStampCanvas : brightStampCanvas,
          tileX,
          tileY,
          tileRenderSize,
          tileRenderSize,
        );
      }
    }
  }, [
    image,
    sampleStep,
    regenerateSeed,
    darkMinBrightness,
    darkMaxBrightness,
    brightMinBrightness,
    brightMaxBrightness,
    onSelectedPreviewsChange,
  ]);

  return (
    <div className="flex flex-col space-y-3 h-[85vh]">
      <canvas
        ref={canvasRef}
        className="block max-w-full h-[85vh] object-contain"
      />
    </div>
  );
};
