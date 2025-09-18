import { StytchB2BProvider } from "@stytch/react/b2b";
import { createStytchB2BHeadlessClient } from "@stytch/react/b2b/headless";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import { Authenticate } from "./pages/Authenticate";
import { Login } from "./pages/Login";
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

const stytch = createStytchB2BHeadlessClient(
  import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || ""
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StytchB2BProvider stytch={stytch}>
      <RouterProvider router={router} />
    </StytchB2BProvider>
  </StrictMode>
);
