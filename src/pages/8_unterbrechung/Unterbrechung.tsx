import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";

const Unterbrechung = () => {
  return "hi";
};

export const unterbrechungRoute = createRoute({
  component: Unterbrechung,
  path: "/unterbrechung",
  getParentRoute: () => rootRoute,
});
