import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";

const Spiegelbild = () => {
  return "";
};

export const spiegelbildRoute = createRoute({
  component: Spiegelbild,
  path: "/spiegelbild",
  getParentRoute: () => rootRoute,
});
