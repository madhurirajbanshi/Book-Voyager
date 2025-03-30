import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./Store/index.js";
createRoot(document.getElementById("root")).render(
  <Router>
    <Provider store={Store}>
      <App />
    </Provider>
  </Router>
);
