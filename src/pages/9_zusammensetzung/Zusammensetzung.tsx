import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";

const Zusammensetzung = () => {
  return "";
};

export const zusammensetzungRoute = createRoute({
  component: Zusammensetzung,
  path: "/zusammensetzung",
  getParentRoute: () => rootRoute,
});
