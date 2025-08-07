import { Page } from "@stytch-all-examples/internal";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Page>
      <Outlet />
    </Page>
  );
}

export default App;
