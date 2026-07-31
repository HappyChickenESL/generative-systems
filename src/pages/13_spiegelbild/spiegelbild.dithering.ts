export type DitheringOptions = {
  threshold?: number;
  sampleStep?: number;
};

export type DitherMask = {
  sampleStep: number;
  sampledWidth: number;
  sampledHeight: number;
  data: Uint8Array;
};

const clampToByte = (value: number) => Math.max(0, Math.min(255, value));

const getGrayscaleValue = (r: number, g: number, b: number) =>
  0.299 * r + 0.587 * g + 0.114 * b;

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    return Promise.reject(
      new Error("Unsupported file type. Please use PNG, JPG, or JPEG."),
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image data."));
        return;
      }

      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
};

export const applyDithering = (
  imageData: ImageData,
  options: DitheringOptions = {},
) => {
  const threshold = options.threshold ?? 128;
  const sampleStep = Math.max(1, Math.floor(options.sampleStep ?? 4));
  const { width, height, data } = imageData;
  const sampledWidth = Math.ceil(width / sampleStep);
  const sampledHeight = Math.ceil(height / sampleStep);
  const grayscale = new Float32Array(sampledWidth * sampledHeight);

  for (let y = 0; y < sampledHeight; y += 1) {
    for (let x = 0; x < sampledWidth; x += 1) {
      const sourceX = Math.min(width - 1, x * sampleStep);
      const sourceY = Math.min(height - 1, y * sampleStep);
      const sourceOffset = (sourceY * width + sourceX) * 4;
      const index = y * sampledWidth + x;

      grayscale[index] = getGrayscaleValue(
        data[sourceOffset],
        data[sourceOffset + 1],
        data[sourceOffset + 2],
      );
    }
  }

  for (let y = 0; y < sampledHeight; y += 1) {
    for (let x = 0; x < sampledWidth; x += 1) {
      const index = y * sampledWidth + x;
      const oldValue = grayscale[index];
      const newValue = oldValue < threshold ? 0 : 255;
      const error = oldValue - newValue;

      grayscale[index] = newValue;

      if (x + 1 < sampledWidth) {
        grayscale[index + 1] += (error * 7) / 16;
      }

      if (y + 1 < sampledHeight) {
        if (x > 0) {
          grayscale[index + sampledWidth - 1] += (error * 3) / 16;
        }

        grayscale[index + sampledWidth] += (error * 5) / 16;

        if (x + 1 < sampledWidth) {
          grayscale[index + sampledWidth + 1] += error / 16;
        }
      }
    }
  }

  const mask = new Uint8Array(sampledWidth * sampledHeight);

  for (let y = 0; y < sampledHeight; y += 1) {
    for (let x = 0; x < sampledWidth; x += 1) {
      const index = y * sampledWidth + x;
      const value = clampToByte(grayscale[index]);

      mask[index] = value === 0 ? 1 : 0;
    }
  }

  return {
    sampleStep,
    sampledWidth,
    sampledHeight,
    data: mask,
  } satisfies DitherMask;
};
