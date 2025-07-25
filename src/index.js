import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <Toaster />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
