import { useEffect, useRef } from "react";

export type SelectedPreviews = {
  dark: string | null;
  bright: string | null;
};

type ImageDitherCanvasProps = {
  sampleStep: number;
  brightThreshold: number;
  finalThreshold: number;
  rotationEnabled: boolean;
  image: HTMLImageElement | null;
  onSelectedPreviewsChange?: (previews: SelectedPreviews) => void;
};

export const ImageDitherCanvas = ({
  sampleStep,
  brightThreshold,
  finalThreshold,
  rotationEnabled,
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

    const brightVariant = thresholdImageToDataUrl(brightThreshold);

    const darkVariantCanvas = document.createElement("canvas");
    darkVariantCanvas.width = previewWidth;
    darkVariantCanvas.height = previewHeight;

    const darkVariantContext = darkVariantCanvas.getContext("2d")!;

    darkVariantContext.drawImage(brightVariant.canvas, 0, 0);
    const darkVariantImageData = darkVariantContext.getImageData(
      0,
      0,
      previewWidth,
      previewHeight,
    );

    for (
      let pixelOffset = 0;
      pixelOffset < darkVariantImageData.data.length;
      pixelOffset += 4
    ) {
      darkVariantImageData.data[pixelOffset] =
        255 - darkVariantImageData.data[pixelOffset];
      darkVariantImageData.data[pixelOffset + 1] =
        255 - darkVariantImageData.data[pixelOffset + 1];
      darkVariantImageData.data[pixelOffset + 2] =
        255 - darkVariantImageData.data[pixelOffset + 2];
      darkVariantImageData.data[pixelOffset + 3] = 255;
    }

    darkVariantContext.putImageData(darkVariantImageData, 0, 0);

    const darkVariant = {
      canvas: darkVariantCanvas,
      dataUrl: darkVariantCanvas.toDataURL(),
    };

    onSelectedPreviewsChange?.({
      dark: darkVariant!.dataUrl,
      bright: brightVariant!.dataUrl,
    });

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;

    const step = Math.max(1, Math.floor(sampleStep));
    const baseThreshold = Math.max(0, Math.min(255, finalThreshold));

    // max rotation, can be changed
    const maxRotationRadians = (180 * Math.PI) / 180;

    for (let y = 0; y < sourceCanvas.height; y += step) {
      for (let x = 0; x < sourceCanvas.width; x += step) {
        const pixelOffset = (y * sourceCanvas.width + x) * 4;
        const red = sourceImageData.data[pixelOffset];
        const green = sourceImageData.data[pixelOffset + 1];
        const blue = sourceImageData.data[pixelOffset + 2];
        const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;

        const variantCanvas =
          grayscale >= baseThreshold
            ? brightVariant.canvas
            : darkVariant.canvas;

        const rotation = rotationEnabled
          ? (Math.random() * 2 - 1) * maxRotationRadians
          : 0;

        context.save();
        context.translate(x + step / 2, y + step / 2);
        context.rotate(rotation);
        context.drawImage(variantCanvas, -step / 2, -step / 2, step, step);
        context.restore();
      }
    }
  }, [
    image,
    sampleStep,
    brightThreshold,
    finalThreshold,
    rotationEnabled,
    onSelectedPreviewsChange,
  ]);

  return (
    <canvas ref={canvasRef} className="block w-full h-[85vh] object-contain" />
  );
};
