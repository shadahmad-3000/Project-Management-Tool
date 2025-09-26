import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import "./styles/global.css";
import "./styles/responsive.lg.css";
import "./styles/responsive.md.css";
import "./styles/responsive.sm.css";
import "./styles/responsive.xl.css";
import "./styles/responsive.xs.css";
import "./styles/utilities.css";
import "antd/dist/reset.css";
import store from "./store/store";
import "@ant-design/v5-patch-for-react-19";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
