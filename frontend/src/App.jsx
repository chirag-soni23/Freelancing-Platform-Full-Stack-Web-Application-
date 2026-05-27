import React from "react";
import AppRoutes from "./routes";
import { Toaster } from "./components/ui/toaster";
import { useGlobalNotification } from "./hoc/useGlobalNotification";

const App = () => {
  useGlobalNotification()
  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
};

export default App;
