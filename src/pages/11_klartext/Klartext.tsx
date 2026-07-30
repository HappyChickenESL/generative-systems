import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";

const Klartext = () => {
  return "";
};

export const klartextRoute = createRoute({
  component: Klartext,
  path: "/klartext",
  getParentRoute: () => rootRoute,
});
