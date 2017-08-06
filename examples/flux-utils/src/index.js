import React from "react";
import { render } from "react-dom";
import { Route, Router } from "async-react-router";
import IndexPage from "./pages/IndexPage";
import ItemPage from "./pages/ItemPage";
import NewsPage from "./pages/NewsPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import 'bootstrap/dist/css/bootstrap.css';
import "font-awesome/css/font-awesome.min.css";
import "nprogress/nprogress.css";

function App() {
    return (
        <Router>
            <Route path="/" component={IndexPage} name="IndexPage">
                <Route path="/item/:itemId" component={ItemPage} name="ItemPage"/>
                <Route path="/news/:page?" component={NewsPage} name="NewsPage"/>
                <Route path="/user/:userId" component={UserPage} name="UserPage"/>
                <Route path="*" component={NotFoundPage}/>
            </Route>
        </Router>
    );
}

render(
    (<App/>),
    document.getElementById('app')
);
