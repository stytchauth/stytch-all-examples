import { Outlet } from "react-router";
import { CodeSnippetsProvider } from "./contexts/CodeSnippetsProvider";

function App() {
  return (
    <CodeSnippetsProvider>
      <Outlet />
    </CodeSnippetsProvider>
  );
}

export default App;
