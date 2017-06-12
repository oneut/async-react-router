import pathToRegexp from "path-to-regexp";

class RouteMatcher {
    constructor() {
        this.routes     = {};
        this.nameRoutes = {};
        this.pathname   = '';
        this.routeMatch = null;
        this.render     = null;
        this.isMatch    = false;
        this.keys       = [];
    }

    addRoute(path, component, name) {
        this.routes[path] = component;
        if (!!name) {
            this.nameRoutes[name] = path;
        }
    }

    change(pathname) {
        this.pathname   = pathname;
        this.routeMatch = null;
        this.component  = null;
        this.isMatch    = false;
        for (const route in this.routes) {
            this.keys = [];
            if (!(this.routes.hasOwnProperty(route))) continue;
            const routeMatch = pathToRegexp(route, this.keys).exec(this.pathname);
            if (!routeMatch) {
                continue;
            }
            this.routeMatch = routeMatch;
            this.component  = this.routes[route];
            this.isMatch    = true;
            return this;
        }
        return this;
    }

    renderer(renderer) {
        if (!this.isMatch) {
            return null;
        }

        return renderer(this.pathname, this.getParams(), this.component);
    }

    getParams() {
        if (!this.isMatch) return {};

        let params = {};
        for (let i = 1, len = this.routeMatch.length; i < len; ++i) {
            const key = this.keys[i - 1];
            const val = 'string' === typeof this.routeMatch[i] ? decodeURIComponent(this.routeMatch[i]) : this.routeMatch[i];
            if (key) params[key.name] = val;
        }

        return params;
    }

    compile(name, parameters = {}) {
        if (!this.nameRoutes[name]) {
            throw `Route Name "${name}" did not match Path.`;
        }

        const toPath = pathToRegexp.compile(this.nameRoutes[name]);
        return toPath(parameters);
    }
}

const routeMatcher = new RouteMatcher();

export default routeMatcher;
