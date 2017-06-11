import History from "./History";
import RouteMatcher from "./RouteMatcher";

class Request {
    constructor() {
        this.history = null;
    }

    setHistory(history) {
        this.history = history;
    }

    to(to) {
        this.history.push(to);
    }

    action(componentName, parameters = {}) {
        this.history.push(RouteMatcher.compile(componentName, parameters));
    }

    isActive(pathname) {
        const requestLocation = this.history.getRequestLocation();
        return (requestLocation.pathname === pathname);
    }
}

const request = new Request();
request.setHistory(History);

export default request;
