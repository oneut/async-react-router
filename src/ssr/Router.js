import HistoryManager from "../lib/HistoryManager";
import RouteMatcher from "../lib/RouteMatcher";
import * as Utils from "../lib/Utils";
import Router from "../lib/Router";
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
