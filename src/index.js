import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./apis/store";
import { LanguageProvider } from "./language";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "light");
}
root.render(
  <Suspense fallback="Loading..">
    <LanguageProvider>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </LanguageProvider>
  </Suspense>
);
