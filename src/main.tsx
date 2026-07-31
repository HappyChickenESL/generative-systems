import { StrictMode, Suspense, lazy, type ComponentType } from "react";
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

type RouteWithComponent = {
  options?: {
    component?: ComponentType;
  };
};

const lazyComponentFromRouteExport = <T extends Record<string, unknown>>(
  importer: () => Promise<T>,
  exportName: keyof T,
) =>
  lazy(async () => {
    const module = await importer();
    const route = module[exportName] as RouteWithComponent | undefined;
    const component = route?.options?.component;

    if (!component) {
      throw new Error(`Route export '${String(exportName)}' has no component.`);
    }

    return { default: component };
  });

const withSuspense = (Component: ComponentType) => () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

const FarbfleckPage = lazyComponentFromRouteExport(
  () => import("./pages/1_farbfleck/Farbfleck"),
  "farbfleckRoute",
);
const UnwahrscheinlichPage = lazyComponentFromRouteExport(
  () => import("./pages/2_unwahrscheinlich/Unwahrscheinlich"),
  "unwahrscheinlichRoute",
);
const LoopsPage = lazyComponentFromRouteExport(
  () => import("./pages/3_loops/Loops"),
  "loopsRoute",
);
const FokusPage = lazyComponentFromRouteExport(
  () => import("./pages/4_fokus/Fokus"),
  "fokusRoute",
);
const InteraktionPage = lazyComponentFromRouteExport(
  () => import("./pages/5_interaktion/Interaktion"),
  "interaktionRoute",
);
const GrammatikPage = lazyComponentFromRouteExport(
  () => import("./pages/6_grammatik/Grammatik"),
  "grammatikRoute",
);
const WachstumPage = lazyComponentFromRouteExport(
  () => import("./pages/7_wachstum/Wachstum"),
  "wachstumRoute",
);
const UnterbrechungPage = lazyComponentFromRouteExport(
  () => import("./pages/8_unterbrechung/Unterbrechung"),
  "unterbrechungRoute",
);
const TilesPage = lazyComponentFromRouteExport(
  () => import("./pages/9_tiles/Tiles"),
  "tilesRoute",
);
const DisconnectPage = lazyComponentFromRouteExport(
  () => import("./pages/10_disconnect/Disconnect"),
  "disconnectRoute",
);
const KlartextPage = lazyComponentFromRouteExport(
  () => import("./pages/11_klartext/Klartext"),
  "klartextRoute",
);
const VerfolgtPage = lazyComponentFromRouteExport(
  () => import("./pages/12_verfolgt/Verfolgt"),
  "verfolgtRoute",
);
const SpiegelbildPage = lazyComponentFromRouteExport(
  () => import("./pages/13_spiegelbild/Spiegelbild"),
  "spiegelbildRoute",
);

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-col h-full">
        <div className="p-2 flex gap-8 h-10">
          <Link to="/" className="[&.active]:font-bold">
            Home
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

const farbfleckRoute = createRoute({
  component: withSuspense(FarbfleckPage),
  getParentRoute: () => rootRoute,
  path: "/farbfleck",
});

const unwahrscheinlichRoute = createRoute({
  component: withSuspense(UnwahrscheinlichPage),
  getParentRoute: () => rootRoute,
  path: "/unwahrscheinlich",
});

const loopsRoute = createRoute({
  component: withSuspense(LoopsPage),
  getParentRoute: () => rootRoute,
  path: "/loops",
});

const fokusRoute = createRoute({
  component: withSuspense(FokusPage),
  getParentRoute: () => rootRoute,
  path: "/fokus",
});

const interaktionRoute = createRoute({
  component: withSuspense(InteraktionPage),
  getParentRoute: () => rootRoute,
  path: "/interaktion",
});

const grammatikRoute = createRoute({
  component: withSuspense(GrammatikPage),
  getParentRoute: () => rootRoute,
  path: "/grammatik",
});

const wachstumRoute = createRoute({
  component: withSuspense(WachstumPage),
  getParentRoute: () => rootRoute,
  path: "/wachstum",
});

const unterbrechungRoute = createRoute({
  component: withSuspense(UnterbrechungPage),
  getParentRoute: () => rootRoute,
  path: "/unterbrechung",
});

const tilesRoute = createRoute({
  component: withSuspense(TilesPage),
  getParentRoute: () => rootRoute,
  path: "/tiles",
});

const disconnectRoute = createRoute({
  component: withSuspense(DisconnectPage),
  getParentRoute: () => rootRoute,
  path: "/disconnect",
});

const klartextRoute = createRoute({
  component: withSuspense(KlartextPage),
  getParentRoute: () => rootRoute,
  path: "/klartext",
});

const verfolgtRoute = createRoute({
  component: withSuspense(VerfolgtPage),
  getParentRoute: () => rootRoute,
  path: "/verfolgt",
});

const spiegelbildRoute = createRoute({
  component: withSuspense(SpiegelbildPage),
  getParentRoute: () => rootRoute,
  path: "/spiegelbild",
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

const routeTree = rootRoute.addChildren([homeRoute, ...pageRoutes]);

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
