import { Toaster } from "@stytch-all-examples/internal/components/ui/sonner";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
