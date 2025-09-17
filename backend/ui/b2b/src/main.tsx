import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "./pages/Login.tsx";
import { Organizations } from "./pages/Organizations";
import { ViewSession } from "./pages/ViewSession";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // This makes it the default route for "/"
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "view-session",
        element: <ViewSession />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
