import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";

const Verfolgt = () => {
  return "";
};

export const verfolgtRoute = createRoute({
  component: Verfolgt,
  path: "/verfolgt",
  getParentRoute: () => rootRoute,
});
