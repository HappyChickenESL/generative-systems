import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";

const Disconnect = () => {
  return "";
};

export const disconnectRoute = createRoute({
  component: Disconnect,
  path: "/disconnect",
  getParentRoute: () => rootRoute,
});
