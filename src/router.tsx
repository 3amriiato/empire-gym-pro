import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Strip trailing slash from BASE_URL so TanStack Router can match routes correctly
    basepath: import.meta.env.BASE_URL.slice(0, -1) || "/",
  });

  return router;
};
