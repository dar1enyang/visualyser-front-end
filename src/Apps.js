import React from "react";
import MainRouter from "./router/MainRouter";
import { BrowserRouter } from "react-router-dom";

const Apps = () => (
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);

export default Apps;
