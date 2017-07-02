import pathToRegexp from "path-to-regexp";
import Renderer from "./Renderer";

class RouteMatcher {
    constructor() {
        this.routes     = [];
        this.nameRoutes = {};
        this.renderer   = null;
    }

    addRoute(path, component, name) {
        this.routes.push({path, component});
        if (!!name) {
            this.nameRoutes[name] = path;
        }
    }

    getRenderer(pathname) {
        this.renderer = this.createRenderer(pathname);
        return this.renderer;
    }

    createRenderer(pathname) {
        for (let i = 0; this.routes.length > i; i++) {
            let keys         = [];
            let route        = this.routes[i];
            const routeMatch = pathToRegexp(route.path, keys).exec(pathname);
            if (!routeMatch) continue;

            let params = {};
            for (let i = 1, len = routeMatch.length; i < len; ++i) {
                const key = keys[i - 1];
                if (key) params[key.name] = 'string' === typeof routeMatch[i] ? decodeURIComponent(routeMatch[i]) : routeMatch[i];
            }

            return new Renderer(pathname, route.component, params, this.renderer);
        }

        return null;
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
