import pathToRegexp from "path-to-regexp";
import Renderer from "./Renderer";

class RouteMatcher {
    constructor() {
        this.routes     = {};
        this.nameRoutes = {};
        this.renderer   = null;
    }

    addRoute(path, component, name) {
        this.routes[path] = component;
        if (!!name) {
            this.nameRoutes[name] = path;
        }
    }

    getRenderer(pathname) {
        this.renderer = null;
        for (const route in this.routes) {
            let keys = [];
            if (!(this.routes.hasOwnProperty(route))) continue;
            const routeMatch = pathToRegexp(route, keys).exec(pathname);
            if (!routeMatch) {
                continue;
            }

            let params = {};
            for (let i = 1, len = routeMatch.length; i < len; ++i) {
                const key = keys[i - 1];
                if (key) params[key.name] = 'string' === typeof routeMatch[i] ? decodeURIComponent(routeMatch[i]) : routeMatch[i];
            }

            this.renderer = new Renderer(pathname, this.routes[route], params, this.renderer);
            break;
        }

        return this.renderer;
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
