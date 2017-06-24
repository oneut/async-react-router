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
        this.history.push(this.normarizeTo(to));
    }

    name(name, parameters = {}) {
        this.history.push(RouteMatcher.compile(name, parameters));
    }

    isActive(pathname) {
        const requestLocation = this.history.getRequestLocation();
        return (requestLocation.pathname === pathname);
    }

    normarizeTo(to) {
        if (to[0] === '#') {
            return to.substr(1);
        }

        return to;
    }
}

const request = new Request();
request.setHistory(History);

export default request;
