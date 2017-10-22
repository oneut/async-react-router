import React from "react";

export default class RouteNormalizer {
    constructor() {
        this.routes = [];
    }

    static make() {
        return new RouteNormalizer();
    }

    /**
     * Add routes.
     */

    addRoutes(routes, parentPath) {
        React.Children.toArray(routes).forEach((route) => this.addRoute(route, parentPath));
        return this;
    }

    /**
     * Add route.
     */
    addRoute(route, parentPath) {
        const {path, component, children, name} = route.props;
        const normalizedPath                    = this.cleanPath(this.createRoute(path, parentPath));
        this.routes.push({
            normalizedPath: normalizedPath,
            component: component,
            name: name
        });
        if (children) this.addRoutes(children, normalizedPath);
        return this;
    }

    /**
     * Clean path.
     */
    cleanPath(path) {
        return path.replace(/\/\//g, '/');
    }

    /**
     * Normalize route based on the parent.
     */
    createRoute(path, parentPath) {
        if (path[0] === '/' && path.length === 1) return path;
        if (typeof parentPath === 'undefined') return path;
        if (parentPath[0] === '/' && parentPath.length === 1) return path;
        return `${parentPath}/${path}`;
    }

    get() {
        return this.routes;
    }
}
