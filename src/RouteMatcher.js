import Regexp from "path-to-regexp";

export default class RouteMatcher {
    constructor(path = '', pathname = '') {
        this.path       = path;
        this.pathname   = pathname;
        this.routeMatch = null;
        this.keys       = [];
    }

    match() {
        if (this.routeMatch) {
            return this;
        }

        this.routeMatch = Regexp(this.path, this.keys).exec(this.pathname);
        return this;
    }

    static make(path, pathname) {
        return new RouteMatcher(path, pathname).match();
    }

    success() {
        return Boolean(this.routeMatch);
    }

    fails() {
        return !(this.success());
    }

    getParams() {
        let params = {};

        if (this.fails()) {
            return {};
        }

        for (let i = 1, len = this.routeMatch.length; i < len; ++i) {
            const key = this.keys[i - 1];
            const val = 'string' === typeof this.routeMatch[i] ? decodeURIComponent(this.routeMatch[i]) : this.routeMatch[i];
            if (key) params[key.name] = val;
        }

        return params;
    }
}
