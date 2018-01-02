import pathToRegexp from "path-to-regexp";
import Renderer from "./Renderer";

class RouteMatcher {
    constructor() {
        this.init();
    }

    init() {
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

    getRenderer() {
        return this.renderer;
    }

    fetchRenderer(pathname) {
        const normalizedPathname = this.normalizePathname(pathname);
        for (let i = 0; this.routes.length > i; i++) {
            let keys         = [];
            let route        = this.routes[i];
            const routeMatch = pathToRegexp(route.path, keys).exec(normalizedPathname);
            if (!routeMatch) continue;

            let params = {};
            for (let i = 1, len = routeMatch.length; i < len; ++i) {
                const key = keys[i - 1];
                params[key.name] = isNaN(routeMatch[i]) ? decodeURIComponent(routeMatch[i]) : Number(routeMatch[i]);
            }

            this.renderer = new Renderer(normalizedPathname, route.component, params, this.renderer);
            return this;
        }

        this.renderer = null;
        return this;
    }

    compileByName(name, parameters = {}) {
        if (!this.nameRoutes[name]) {
            throw Error(`Route Name "${name}" did not match Path.`);
        }

        const toPath = pathToRegexp.compile(this.nameRoutes[name]);
        return toPath(parameters);
    }

    normalizePathname(pathname) {
        return pathname.split('?')[0].split("#")[0];
    }
}

const routeMatcher = new RouteMatcher();

export default routeMatcher;
