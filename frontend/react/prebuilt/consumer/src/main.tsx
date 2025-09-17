import { StytchProvider } from "@stytch/react";
import { createStytchUIClient } from "@stytch/react/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import { Authenticate } from "./pages/Authenticate";
import { Login } from "./pages/Login";
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
        path: "authenticate",
        element: <Authenticate />,
      },
      {
        path: "view-session",
        element: <ViewSession />,
      },
    ],
  },
]);

const stytch = createStytchUIClient(
  import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || ""
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StytchProvider stytch={stytch}>
      <RouterProvider router={router} />
    </StytchProvider>
  </StrictMode>
);
