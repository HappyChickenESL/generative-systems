import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { farbfleckRoute } from "./pages/1_farbfleck/Farbfleck";
import { testRoute } from "./Test";
import { unwahrscheinlichRoute } from "./pages/2_unwahrscheinlich/Unwahrscheinlich";
import { bodyProblemRoute } from "./pages/drei/twoBodyProblem/AufgabeDrei";
import { threeBodyProblemRoute } from "./pages/drei/threeBodyProblem/ThreeBodyProblem";
import { loopsRoute } from "./pages/3_loops/Loops";
import { grammatikRoute } from "./pages/grammatik/Grammatik";
import { interaktionRoute } from "./pages/5_interaktion/Interaktion";
import { fokusRoute } from "./pages/4_fokus/Fokus";
import { wachstumRoute } from "./pages/7_wachstum/Wachstum";
import { unterbrechungRoute } from "./pages/8_unterbrechung/Unterbrechung";
import { tilesRoute } from "./pages/9_tiles/Tiles";
import { disconnectRoute } from "./pages/10_disconnect/Disconnect";
import { klartextRoute } from "./pages/11_klartext/Klartext";
import { verfolgtRoute } from "./pages/12_verfolgt/Verfolgt";
import { spiegelbildRoute } from "./pages/13_spiegelbild/Verfolgt";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-col h-full">
        <div className="p-2 flex gap-8 h-10">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/farbfleck" className="[&.active]:font-bold">
            Farbfleck (WIP)
          </Link>
          <Link to="/unwahrscheinlich" className="[&.active]:font-bold">
            Unwahrscheinlich (WIP)
          </Link>
          <Link to="/bodyProblem/3" className="[&.active]:font-bold">
            3 Body (WIP)
          </Link>
        </div>
        <div className="flex-1 m-2">
          <Outlet />
        </div>
      </div>
    </>
  ),
});

const homeRoute = createRoute({
  component: () => (
    <>
      {pageRoutes.map((route, index) => (
        <div key={index} className="m-4">
          <Link to={route.path} className="[&.active]:font-bold">
            {route.path}
          </Link>
        </div>
      ))}
    </>
  ),
  getParentRoute: () => rootRoute,
  path: "/",
});

const pageRoutes = [
  farbfleckRoute,
  unwahrscheinlichRoute,
  loopsRoute,
  fokusRoute,
  interaktionRoute,
  grammatikRoute,
  wachstumRoute,
  unterbrechungRoute,
  tilesRoute,
  disconnectRoute,
  klartextRoute,
  verfolgtRoute,
  spiegelbildRoute,
];

const routeTree = rootRoute.addChildren([
  homeRoute,
  testRoute,
  bodyProblemRoute,
  threeBodyProblemRoute,
  ...pageRoutes,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
