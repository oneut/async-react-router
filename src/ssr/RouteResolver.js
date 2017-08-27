import HistoryManager from "../lib/HistoryManager";
import React from "react";
import RouteMatcher from "../lib/RouteMatcher";
import * as Utils from "../lib/Utils";
import createMemoryHistory from "history/createMemoryHistory";

export default class RouteResolver {
    constructor(route) {
        HistoryManager.initialHistory(createMemoryHistory());

        RouteMatcher.init();

        this.addRoute(route);
    }

    static make(route) {
        return new RouteResolver(route);
    }

    /**
     * Compile component.
     */

    async resolve(pathname, callback) {
        const renderer = RouteMatcher.fetchRenderer(Utils.normalizePathname(pathname)).getRenderer();
        await renderer.fireGetInitialProps();
        renderer.fireInitialPropsStoreHook();

        const data = renderer.getInitialProps();
        callback(React.createElement(renderer.getComponent(), renderer.getComponentProps()), data);
    }

    /**
     * Add routes.
     */

    addRoutes(routes, parentPath) {
        React.Children.toArray(routes).forEach((route) => this.addRoute(route, parentPath));
    }

    /**
     * Add route.
     */

    addRoute(route, parentPath) {
        const {path, component, children, name} = route.props;
        const normalizedPath                    = Utils.cleanPath(Utils.createRoute(path, parentPath));
        RouteMatcher.addRoute(normalizedPath, component, name);
        if (children) this.addRoutes(children, parentPath);
    }
}
