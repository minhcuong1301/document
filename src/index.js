import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import VN from "antd/locale/vi_VN";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "app-redux/store";
import "assets/css/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={VN}>
        {/* <Routes> */}
        {/* <Route path="/vehicle-procedure" element={<VehicleProcedure />} />
          <Route path="/leaveprocess" element={<VehicleProcedure />} />
          <Route
            path="/general-purchase-procedure"
            element={<VehicleProcedure />}
          />
          <Route path="/vehicle-procedure" element={<VehicleProcedure />} />
          <Route path="/vehicle-procedure" element={<VehicleProcedure />} />
          <Route path="/vehicle-procedure" element={<VehicleProcedure />} /> */}
        {/* </Routes> */}
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
