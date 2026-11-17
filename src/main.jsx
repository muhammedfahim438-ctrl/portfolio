import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { BRAND } from "@/data/brandDefaults";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./app/globals.css";

document.title = BRAND.metaTitle;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
