import History from "./History";
import RouteMatcher from "./RouteMatcher";

class URL {
    constructor() {
        this.history = null;
    }

    setHistory(history) {
        this.history = history;
    }

    to(pathname) {
        return this.history.history.createHref({pathname});
    }

    action(componentName, parameters) {
        const pathname = RouteMatcher.compile(componentName, parameters);
        return this.history.history.createHref({pathname});
    }
}

const url = new URL();
url.setHistory(History);

export default url;
