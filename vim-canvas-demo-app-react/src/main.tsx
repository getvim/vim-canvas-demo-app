import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppWrapper } from "./AppWrapper.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <AppWrapper>
    <App />
  </AppWrapper>
);
