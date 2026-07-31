import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { useCallback, useState } from "react";
import {
  ImageDitherCanvas,
  type SelectedPreviews,
} from "./components/ImageDitherCanvas";
import { loadImage } from "./spiegelbild.dithering";

const Spiegelbild = () => {
  const [sampleStep, setSampleStep] = useState(20);
  const [lowThreshold, setLowThreshold] = useState(96);
  const [highThreshold, setHighThreshold] = useState(160);
  const [finalThreshold, setFinalThreshold] = useState(128);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [darkPreviewSrc, setDarkPreviewSrc] = useState<string | null>(null);
  const [brightPreviewSrc, setBrightPreviewSrc] = useState<string | null>(null);

  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const image = await loadImage(file);
    setSourceImage(image);
  };

  const onSelectedPreviewsChange = useCallback((previews: SelectedPreviews) => {
    setDarkPreviewSrc((previous) =>
      previous === previews.dark ? previous : previews.dark,
    );
    setBrightPreviewSrc((previous) =>
      previous === previews.bright ? previous : previews.bright,
    );
  }, []);

  return (
    <div className="h-full flex">
      <div className="w-60 flex flex-col space-y-4 px-2">
        <div className="flex flex-col space-y-2 text-xs">
          <div className="flex flex-col">
            <label htmlFor="sample-step-slider">
              pixels per image: {sampleStep}
            </label>
            <input
              id="sample-step-slider"
              type="range"
              min={4}
              max={32}
              step={1}
              value={sampleStep}
              onChange={(event) => setSampleStep(Number(event.target.value))}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="low-threshold-slider">
              Dithering threshold bright variant: {lowThreshold}
            </label>
            <input
              id="low-threshold-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={lowThreshold}
              onChange={(event) => setLowThreshold(Number(event.target.value))}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="high-threshold-slider">
              Dithering threshold dark variant: {highThreshold}
            </label>
            <input
              id="high-threshold-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={highThreshold}
              onChange={(event) => setHighThreshold(Number(event.target.value))}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="final-threshold-slider">
              Dithering threshold final variant: {finalThreshold}
            </label>
            <input
              id="final-threshold-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={finalThreshold}
              onChange={(event) =>
                setFinalThreshold(Number(event.target.value))
              }
            />
          </div>

          <div className="flex gap-2">
            <input
              id="rotation-toggle"
              type="checkbox"
              checked={rotationEnabled}
              onChange={(event) => setRotationEnabled(event.target.checked)}
            />
            <label htmlFor="rotation-toggle">Enable rotation</label>
          </div>

          <div className="flex flex-col">
            <label htmlFor="image-upload">Upload image</label>
            <input
              id="image-upload"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={onFileChange}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1">
              <span>Dark Image Preview</span>
              {darkPreviewSrc ? (
                <img
                  src={darkPreviewSrc}
                  alt="High-threshold variant preview"
                />
              ) : null}
            </div>

            <div className="flex flex-col space-y-1">
              <span>Bright Image Preview</span>
              {brightPreviewSrc ? (
                <img
                  src={brightPreviewSrc}
                  alt="Low-threshold variant preview"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 border-4 p-2 overflow-auto h-full">
        <ImageDitherCanvas
          image={sourceImage}
          sampleStep={sampleStep}
          lowThreshold={lowThreshold}
          highThreshold={highThreshold}
          finalThreshold={finalThreshold}
          rotationEnabled={rotationEnabled}
          onSelectedPreviewsChange={onSelectedPreviewsChange}
        />
      </div>
    </div>
  );
};

export const spiegelbildRoute = createRoute({
  component: Spiegelbild,
  path: "/spiegelbild",
  getParentRoute: () => rootRoute,
});
