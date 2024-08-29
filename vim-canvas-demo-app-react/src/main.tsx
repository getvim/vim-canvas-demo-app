import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppWrapper } from "./AppWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <AppWrapper>
    <App />
  </AppWrapper>
);
