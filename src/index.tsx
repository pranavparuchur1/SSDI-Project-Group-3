import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";
import App from "./App";
import "./index.css";
import 'rsuite/dist/rsuite-no-reset.min.css';
import { CustomProvider } from 'rsuite';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CustomProvider theme={localStorage.getItem("darkmode") === "true" ? "dark" : "light"}>
        <App />
        </CustomProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
