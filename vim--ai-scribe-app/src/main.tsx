import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProviders } from "./providers/AppContextProviders.tsx";
import { App } from "./App.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <AppContextProviders>
            <App />
          </AppContextProviders>
        }
      />
    </Routes>
  </BrowserRouter>
);
