import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./app/globals.css";

document.title = "Muhammed Fahim M | Data Science & Full-Stack Developer";

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
