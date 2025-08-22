import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={location.pathname}>
        <Outlet />
      </div>
    </AnimatePresence>
  );
}

export default App;
