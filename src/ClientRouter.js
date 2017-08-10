import HistoryManager from "./HistoryManager";
import RouteMatcher from "./RouteMatcher";
import * as Utils from "./Utils";
import Router from "./Router";
import React from "react";

export default class ClientRouter extends Router {
    getHistory() {
        return !!this.props.history ? this.props.history : require("history").createBrowserHistory();
    }

    componentWillMount() {
        const location = HistoryManager.getLocation();
        const renderer = RouteMatcher.fetchRenderer(Utils.normalizePathname(location.pathname)).getRenderer();
        if (renderer) {
            renderer.fireGetFirstRenderedInitialProps();
            renderer.fireInitialPropsStoreHook();
            this.setComponent(React.createElement(renderer.getComponent(), {...renderer.getComponentProps(), ...this.props}));
        }
    }
}
