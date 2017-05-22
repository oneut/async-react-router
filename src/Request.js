import History from "./History";

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

    isActive(pathname) {
        const requestLocation = this.history.getRequestLocation();
        return (requestLocation.pathname === pathname);
    }
}

const request = new Request();
request.setHistory(History);

export default request;
