import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

const Interaktion = () => {
  return (
    <div className="h-full flex">
      <div className="w-40 flex flex-col space-y-2"></div>
      <div className="flex-1 border-4">
        <Canvas>
          <OrthographicCamera makeDefault zoom={120} position={[0, 0, 10]} />
          {/* {...shapes} */}
        </Canvas>
      </div>
    </div>
  );
};

export const interaktionRoute = createRoute({
  component: Interaktion,
  path: "/interaktion",
  getParentRoute: () => rootRoute,
});
