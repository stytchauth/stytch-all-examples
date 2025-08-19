import { StytchB2BProvider } from "@stytch/react/b2b";
import { createStytchB2BUIClient } from "@stytch/react/b2b/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const stytch = createStytchB2BUIClient(
  import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || ""
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StytchB2BProvider stytch={stytch}>
      <RouterProvider router={router} />
    </StytchB2BProvider>
  </StrictMode>
);
