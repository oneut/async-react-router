import HistoryManager from "../lib/HistoryManager";
import React from "react";
import RouteMatcher from "../lib/RouteMatcher";
import RouteNormalizer from "../lib/RouteNormalizer";
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
        const renderer = RouteMatcher.fetchRenderer(pathname).getRenderer();
        await renderer.fireGetInitialProps();
        renderer.fireInitialPropsStoreHook();

        const data = renderer.getInitialProps();
        callback(React.createElement(renderer.getComponent(), renderer.getComponentProps()), data);
    }

    /**
     * Add route.
     */
    addRoute(route) {
        const normalizedRoutes = RouteNormalizer.make().addRoute(route).get();
        normalizedRoutes.map((route) => {
            RouteMatcher.addRoute(route.normalizedPath, route.component, route.name);
        });
    }
}
