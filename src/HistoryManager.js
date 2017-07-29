import RouteMatcher from "./RouteMatcher";

class HistoryManager {
    constructor() {
        this.history         = null;
        this.routeMatcher    = null;
        this.requestCallback = null;
        this.silent          = false;
    }

    initialHistory(history) {
        this.history = history;
    }

    initialRouteMatcher(routeMatcher) {
        this.routeMatcher = routeMatcher;
    }

    setRequestCallback(requestCallback) {
        this.requestCallback = requestCallback;
    }

    listen() {
        this.history.listen((locaton) => {
            if (!(this.silent)) this.requestCallback(locaton.pathname);
        });
    }

    push(pathname) {
        this.silent   = true;
        this.requestCallback(pathname);
        this.history.push(pathname);
        this.silent = false;
    }

    pushByName(name, parameters) {
        this.push(this.routeMatcher.compileByName(name, parameters));
    }

    createHref(pathname) {
        return this.history.createHref({pathname});
    }

    createHrefByName(name, parameters) {
        const pathname = this.routeMatcher.compileByName(name, parameters);
        return this.createHref(pathname);
    }

    getLocation() {
        return this.history.location;
    }
}

const historyManager = new HistoryManager();
historyManager.initialRouteMatcher(RouteMatcher);

export default historyManager;
