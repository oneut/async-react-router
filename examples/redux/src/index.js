import React from "react";
import { render } from "react-dom";
import { Route, Router } from "async-react-router";
import IndexPage from "./pages/IndexPage";
import ItemPage from "./pages/ItemPage";
import NewsPage from "./pages/NewsPage";
import UserPage from "./pages/UserPage";

render(
    (
        <Router>
            <Route path="/" component={IndexPage} name="IndexPage"/>
            <Route path="/news/:page?" component={NewsPage} name="NewsPage"/>
            <Route path="/item/:itemId" component={ItemPage} name="ItemPage"/>
            <Route path="/user/:userId" component={UserPage} name="UserPage"/>
        </Router>
    ),
    document.getElementById('app')
);
