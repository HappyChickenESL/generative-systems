import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { useCallback, useEffect, useState } from "react";
import {
  ImageDitherCanvas,
  type SelectedPreviews,
} from "./components/ImageDitherCanvas";
import { loadImage } from "./spiegelbild.dithering";
import { Input } from "../../shared/components/Input";
import { FileUpload } from "../../shared/components/FileUpload";
import { Checkbox } from "../../shared/components/Checkbox";

const Spiegelbild = () => {
  const [sampleStep, setSampleStep] = useState(6);
  const [brightThreshold, setBrightThreshold] = useState(150);
  const [finalThreshold, setFinalThreshold] = useState(128);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [darkPreviewSrc, setDarkPreviewSrc] = useState<string | null>(null);
  const [brightPreviewSrc, setBrightPreviewSrc] = useState<string | null>(null);

  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = new Image();

    image.onload = () => setSourceImage(image);
    image.src = "/dithering/image.png";
  }, []);

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
      <div className="w-60 flex flex-col space-y-2 m-4">
        <Input
          label={"Pixels Per Image: " + sampleStep}
          className="range"
          id="sample-step-slider"
          type="range"
          min={4}
          max={40}
          step={1}
          value={sampleStep}
          onChange={(event) => setSampleStep(Number(event.target.value))}
        />
        <Input
          label={"First Image Dithering Threshold: " + brightThreshold}
          className="range"
          id="bright-threshold-slider"
          type="range"
          min={0}
          max={255}
          step={1}
          value={brightThreshold}
          onChange={(event) => setBrightThreshold(Number(event.target.value))}
        />
        <Input
          label={"Final Image Dithering Threshold: " + finalThreshold}
          className="range"
          id="final-threshold-slider"
          type="range"
          min={0}
          max={255}
          step={1}
          value={finalThreshold}
          onChange={(event) => setFinalThreshold(Number(event.target.value))}
        />
        <Checkbox
          label="Enable rotation"
          id="rotation-toggle"
          type="checkbox"
          checked={rotationEnabled}
          onChange={(event) => setRotationEnabled(event.target.checked)}
        />

        <FileUpload
          id="image-select"
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={onFileChange}
        />

        {darkPreviewSrc && brightPreviewSrc && (
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1">
              <span>Bright Image Preview</span>
              {brightPreviewSrc ? (
                <img
                  src={brightPreviewSrc}
                  alt="Low-threshold variant preview"
                />
              ) : null}
            </div>

            <div className="flex flex-col space-y-1">
              <span>Dark Image Preview</span>
              {darkPreviewSrc ? (
                <img
                  src={darkPreviewSrc}
                  alt="High-threshold variant preview"
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex border-4 rounded-xl p-1">
        <ImageDitherCanvas
          image={sourceImage}
          sampleStep={sampleStep}
          brightThreshold={brightThreshold}
          finalThreshold={finalThreshold}
          rotationEnabled={rotationEnabled}
          onSelectedPreviewsChange={onSelectedPreviewsChange}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      <div className="w-60 flex flex-col space-y-4 px-2">
        <div className="flex flex-col space-y-2 text-xs">
          <div className="flex gap-2">
            <label htmlFor="rotation-toggle">Enable rotation</label>
          </div>

          <div className="flex flex-col">
            <label htmlFor="image-select">Select image</label>
          </div>
        </div>
      </div>

      <div className="flex-1 border-4 p-2 overflow-auto h-full">
        <ImageDitherCanvas
          image={sourceImage}
          sampleStep={sampleStep}
          brightThreshold={brightThreshold}
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
