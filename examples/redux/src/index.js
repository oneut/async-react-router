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
            <Route path="/" component={IndexPage}/>
            <Route path="/news/:page?" component={NewsPage}/>
            <Route path="/item/:itemId" component={ItemPage}/>
            <Route path="/user/:userId" component={UserPage}/>
        </Router>
    ),
    document.getElementById('app')
);
