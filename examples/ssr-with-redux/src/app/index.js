import React from "react";
import { render } from "react-dom";
import { Router } from "async-react-router/ssr";
import routes from "./routes";
import 'bootstrap/dist/css/bootstrap.css';
import "font-awesome/css/font-awesome.min.css";
import "nprogress/nprogress.css";

function App() {
    return (
        <Router>
            {routes}
        </Router>
    );
}

render(
    (<App/>),
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept();
}
