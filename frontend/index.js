import React from "react";
import ReactDOM from "react-dom/client"; // Utilise react-dom/client au lieu de react-dom
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
