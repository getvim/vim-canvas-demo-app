import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProviders } from "./providers/AppContextProviders.tsx";
import { AppSettingsContextProviders } from "./providers/AppSettingsContextProviders.tsx";
import { App } from "./App.tsx";
import { AppSettings } from "./AppSettings.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
        <Route
          path="/settings"
          element={
            <AppSettingsContextProviders>
              <AppSettings />
            </AppSettingsContextProviders>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
