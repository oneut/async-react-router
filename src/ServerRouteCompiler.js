import HistoryManager from "./HistoryManager";
import React from "react";
import RouteMatcher from "./RouteMatcher";
import * as Utils from "./Utils";
import createMemoryHistory from "history/createMemoryHistory";

export default class ServerRouteCompiler {
    constructor(route, url) {
        this.url = url;

        HistoryManager.initialHistory(createMemoryHistory());

        RouteMatcher.init();

        this.addRoute(route, url);
    }

    static make(route, url) {
        return new ServerRouteCompiler(route, url);
    }

    /**
     * Compile component.
     */

    async compile(callback) {
        const renderer = RouteMatcher.fetchRenderer(Utils.normalizePathname(this.url)).getRenderer();
        await renderer.fireGetInitialProps();
        renderer.fireInitialPropsStoreHook();

        const data = renderer.getInitialProps();
        callback(React.createElement(renderer.getComponent(), renderer.getComponentProps()), data);
    }

    /**
     * Add routes.
     */

    addRoutes(routes, parent) {
        React.Children.toArray(routes).forEach((route) => this.addRoute(route, parent));
    }

    /**
     * Add route.
     */

    addRoute(route, parent) {
        const {path, component, children, name} = route.props;
        const normalizedPath                    = Utils.cleanPath(Utils.createRoute(path, parent.path));
        RouteMatcher.addRoute(normalizedPath, component, name);
        if (children) this.addRoutes(children, {path: normalizedPath});
    }
}
