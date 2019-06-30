import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Upload from "./Upload";
import Menu from "./core/Menu";

// import Test from "./user/test.tsx";

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/upload" component={Upload} />
    </Switch>
  </div>
);

export default MainRouter;
