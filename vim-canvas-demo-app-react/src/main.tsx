import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppWrapper } from "./AppWrapper.tsx";
import "./globals.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSettingsWrapper } from "./AppSettingsWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <AppWrapper>
            <App />
          </AppWrapper>
        }
      />
      <Route path="/settings" element={<AppSettingsWrapper />} />
    </Routes>
  </BrowserRouter>
);
