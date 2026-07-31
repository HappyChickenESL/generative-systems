import { useEffect, useRef } from "react";

export type SelectedPreviews = {
  dark: string | null;
  bright: string | null;
};

type ImageDitherCanvasProps = {
  sampleStep: number;
  lowThreshold: number;
  highThreshold: number;
  finalThreshold: number;
  image: HTMLImageElement | null;
  onSelectedPreviewsChange?: (previews: SelectedPreviews) => void;
};

export const ImageDitherCanvas = ({
  sampleStep,
  lowThreshold,
  highThreshold,
  finalThreshold,
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
    const context = canvas.getContext("2d")!;

    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = image.naturalWidth;
    sourceCanvas.height = image.naturalHeight;

    const sourceContext = sourceCanvas.getContext("2d")!;

    sourceContext.drawImage(image, 0, 0);
    const sourceImageData = sourceContext.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
    );
    const previewScale = 0.1;
    const previewWidth = Math.max(
      1,
      Math.floor(image.naturalWidth * previewScale),
    );
    const previewHeight = Math.max(
      1,
      Math.floor(image.naturalHeight * previewScale),
    );

    const previewSourceCanvas = document.createElement("canvas");
    previewSourceCanvas.width = previewWidth;
    previewSourceCanvas.height = previewHeight;

    const previewSourceContext = previewSourceCanvas.getContext("2d")!;

    previewSourceContext.imageSmoothingEnabled = true;
    previewSourceContext.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      previewWidth,
      previewHeight,
    );

    const previewSourceImageData = previewSourceContext.getImageData(
      0,
      0,
      previewWidth,
      previewHeight,
    );

    const thresholdImageToDataUrl = (threshold: number) => {
      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = previewWidth;
      previewCanvas.height = previewHeight;

      const previewContext = previewCanvas.getContext("2d")!;

      const output = previewContext.createImageData(
        previewSourceImageData.width,
        previewSourceImageData.height,
      );

      for (
        let pixelOffset = 0;
        pixelOffset < previewSourceImageData.data.length;
        pixelOffset += 4
      ) {
        const red = previewSourceImageData.data[pixelOffset];
        const green = previewSourceImageData.data[pixelOffset + 1];
        const blue = previewSourceImageData.data[pixelOffset + 2];
        const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;
        const bwValue = grayscale < threshold ? 0 : 255;

        output.data[pixelOffset] = bwValue;
        output.data[pixelOffset + 1] = bwValue;
        output.data[pixelOffset + 2] = bwValue;
        output.data[pixelOffset + 3] = 255;
      }

      previewContext.putImageData(output, 0, 0);

      return {
        canvas: previewCanvas,
        dataUrl: previewCanvas.toDataURL(),
      };
    };

    const highVariant = thresholdImageToDataUrl(highThreshold);
    const lowVariant = thresholdImageToDataUrl(lowThreshold);

    onSelectedPreviewsChange?.({
      dark: highVariant!.dataUrl,
      bright: lowVariant!.dataUrl,
    });

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;

    const step = Math.max(1, Math.floor(sampleStep));
    const baseThreshold = Math.max(0, Math.min(255, finalThreshold));

    for (let y = 0; y < sourceCanvas.height; y += step) {
      for (let x = 0; x < sourceCanvas.width; x += step) {
        const pixelOffset = (y * sourceCanvas.width + x) * 4;
        const red = sourceImageData.data[pixelOffset];
        const green = sourceImageData.data[pixelOffset + 1];
        const blue = sourceImageData.data[pixelOffset + 2];
        const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;

        const variantCanvas =
          grayscale >= baseThreshold ? lowVariant.canvas : highVariant.canvas;

        context.drawImage(variantCanvas, x, y, step, step);
      }
    }
  }, [
    image,
    sampleStep,
    lowThreshold,
    highThreshold,
    finalThreshold,
    onSelectedPreviewsChange,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-auto h-auto max-w-none max-h-[85vh]"
    />
  );
};
