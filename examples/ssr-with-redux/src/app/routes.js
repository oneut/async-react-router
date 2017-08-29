import React from "react";
import IndexPage from "./pages/IndexPage";
import ItemPage from "./pages/ItemPage";
import NewsPage from "./pages/NewsPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Route } from "async-react-router";

export default (
    <Route path="/" component={IndexPage} name="IndexPage">
        <Route path="/news/:page?" component={NewsPage} name="NewsPage"/>
        <Route path="/item/:itemId" component={ItemPage} name="ItemPage"/>
        <Route path="/user/:userId" component={UserPage} name="UserPage"/>
        <Route path="(.*)" component={NotFoundPage}/>
    </Route>
);
