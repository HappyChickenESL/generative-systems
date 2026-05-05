import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { farbfleckRoute } from "./pages/farbfleck/Farbfleck";
import { testRoute } from "./Test";
import { unwahrscheinlichRoute } from "./pages/unwahrscheinlich/Unwahrscheinlich";
import { bodyProblemRoute } from "./pages/drei/twoBodyProblem/AufgabeDrei";
import { threeBodyProblemRoute } from "./pages/drei/threeBodyProblem/ThreeBodyProblem";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const homeRoute = createRoute({
  component: () => <>hi</>,
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
