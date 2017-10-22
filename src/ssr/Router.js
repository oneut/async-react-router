import HistoryManager from "../lib/HistoryManager";
import RouteMatcher from "../lib/RouteMatcher";
import RouterBase from "../lib/Router";
import React from "react";

export default class Router extends RouterBase {
    getHistory() {
        return !!this.props.history ? this.props.history : require("history").createBrowserHistory();
    }

    componentWillMount() {
        const location = HistoryManager.getLocation();
        const renderer = RouteMatcher.fetchRenderer(location.pathname).getRenderer();
        if (renderer) {
            renderer.setInitialProps(this.props.firstRenderedInitialProps);
            renderer.fireInitialPropsStoreHook();
            this.setComponent(React.createElement(renderer.getComponent(), {...renderer.getComponentProps(), ...this.props}));
        }
    }
}
