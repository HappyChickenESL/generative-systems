import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { useCallback, useState } from "react";
import { ImageDitherCanvas } from "./components/ImageDitherCanvas";
import { loadImage } from "./spiegelbild.dithering";

const Spiegelbild = () => {
  const [sampleStep, setSampleStep] = useState(10);
  const [regenerateSeed, setRegenerateSeed] = useState(0);
  const [darkMinBrightness, setDarkMinBrightness] = useState(30);
  const [darkMaxBrightness, setDarkMaxBrightness] = useState(100);
  const [brightMinBrightness, setBrightMinBrightness] = useState(156);
  const [brightMaxBrightness, setBrightMaxBrightness] = useState(226);
  const [darkPreviewSrc, setDarkPreviewSrc] = useState<string | null>(null);
  const [brightPreviewSrc, setBrightPreviewSrc] = useState<string | null>(null);

  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const image = await loadImage(file);
      setSourceImage(image);
    } catch (error) {
      setSourceImage(null);
      setDarkPreviewSrc(null);
      setBrightPreviewSrc(null);
    }
  };

  const onSelectedPreviewsChange = useCallback(
    (previews: { dark: string | null; bright: string | null }) => {
      setDarkPreviewSrc((previous) =>
        previous === previews.dark ? previous : previews.dark,
      );
      setBrightPreviewSrc((previous) =>
        previous === previews.bright ? previous : previews.bright,
      );
    },
    [],
  );

  return (
    <div className="h-full flex">
      <div className="w-60 flex flex-col space-y-4 px-2">
        <div className="flex flex-col space-y-2 text-xs">
          <div className="flex flex-col">
            <label htmlFor="sample-step-slider">
              Sample step: {sampleStep}
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
            <label htmlFor="dark-min-slider">
              Dark min brightness: {darkMinBrightness}
            </label>
            <input
              id="dark-min-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={darkMinBrightness}
              onChange={(event) =>
                setDarkMinBrightness(Number(event.target.value))
              }
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dark-max-slider">
              Dark max brightness: {darkMaxBrightness}
            </label>
            <input
              id="dark-max-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={darkMaxBrightness}
              onChange={(event) =>
                setDarkMaxBrightness(Number(event.target.value))
              }
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="bright-min-slider">
              Bright min brightness: {brightMinBrightness}
            </label>
            <input
              id="bright-min-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={brightMinBrightness}
              onChange={(event) =>
                setBrightMinBrightness(Number(event.target.value))
              }
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="bright-max-slider">
              Bright max brightness: {brightMaxBrightness}
            </label>
            <input
              id="bright-max-slider"
              type="range"
              min={0}
              max={255}
              step={1}
              value={brightMaxBrightness}
              onChange={(event) =>
                setBrightMaxBrightness(Number(event.target.value))
              }
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="image-upload">Upload image (PNG, JPG, JPEG)</label>
            <input
              id="image-upload"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={onFileChange}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1">
              <span>Dark selection</span>
              {darkPreviewSrc ? (
                <img src={darkPreviewSrc} alt="Dark selection preview" />
              ) : null}
            </div>

            <div className="flex flex-col space-y-1">
              <span>Bright selection</span>
              {brightPreviewSrc ? (
                <img src={brightPreviewSrc} alt="Bright selection preview" />
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setRegenerateSeed((previous) => previous + 1)}
            >
              Regenerate candidates
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 border-4 p-2 overflow-auto h-full">
        <ImageDitherCanvas
          image={sourceImage}
          sampleStep={sampleStep}
          regenerateSeed={regenerateSeed}
          darkMinBrightness={darkMinBrightness}
          darkMaxBrightness={darkMaxBrightness}
          brightMinBrightness={brightMinBrightness}
          brightMaxBrightness={brightMaxBrightness}
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
