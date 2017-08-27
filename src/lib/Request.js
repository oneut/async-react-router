import HistoryManager from "./HistoryManager";

class Request {
    constructor() {
        this.historyManager = null;
    }

    setHistoryManager(historyManager) {
        this.historyManager = historyManager;
    }

    to(to) {
        this.historyManager.push(this.normarizeTo(to));
    }

    name(name, parameters = {}) {
        this.historyManager.pushName(name, parameters);
    }

    isActive(pathname) {
        const location = this.historyManager.getLocation();
        return (location.pathname === pathname);
    }

    normarizeTo(to) {
        if (to[0] === '#') {
            return to.substr(1);
        }

        return to;
    }
}

const request = new Request();
request.setHistoryManager(HistoryManager);

export default request;
