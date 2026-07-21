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
import { shapesRoute } from "./pages/3_loops/Shapes";
import { grammatikRoute } from "./pages/grammatik/Grammatik";
import { interaktionRoute } from "./pages/5_interaktion/Interaktion";
import { fokusRoute } from "./pages/4_fokus/Fokus";

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
          <Link to="/shapes" className="[&.active]:font-bold">
            Shapes
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
  component: () => <>Home</>,
  getParentRoute: () => rootRoute,
  path: "/",
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  farbfleckRoute,
  unwahrscheinlichRoute,
  testRoute,
  bodyProblemRoute,
  threeBodyProblemRoute,
  shapesRoute,
  fokusRoute,
  grammatikRoute,
  interaktionRoute,
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
