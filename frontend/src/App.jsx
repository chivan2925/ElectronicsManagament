import AppRoutes from "./routes/AppRoutes";
import { RouteChangeTracker } from "./monitoring";

function App() {
  return (
    <>
      <RouteChangeTracker />
      <AppRoutes />
    </>
  );
}

export default App;
