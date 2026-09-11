import { createBrowserRouter } from "react-router";
import { Home, ProjectActivity, ProjectLayout, ProjectOverview, RootLayout, RouteError } from "./App.jsx";

const projects = {
  alpha: { name: "Alpha", owner: "Ada", activity: ["loader ready", "nested route mounted"] },
  beta: { name: "Beta", owner: "Lin", activity: ["search state preserved", "URL is source of truth"] },
};

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    }, { once: true });
  });
}

async function projectLoader({ params, request }) {
  await wait(450, request.signal);
  const project = projects[params.projectId];
  if (!project) {
    throw new Response("Project not found", { status: 404, statusText: "Not Found" });
  }
  return project;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: Home },
      {
        path: "projects/:projectId",
        loader: projectLoader,
        Component: ProjectLayout,
        children: [
          { index: true, Component: ProjectOverview },
          { path: "activity", loader: projectLoader, Component: ProjectActivity },
        ],
      },
    ],
  },
]);
