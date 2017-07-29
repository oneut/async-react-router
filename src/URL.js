import HistoryManager from "./HistoryManager";

class URL {
    constructor() {
        this.historyManager = null;
    }

    setHistoryManager(historyManager) {
        this.historyManager = historyManager;
    }

    to(pathname) {
        return this.historyManager.createHref(pathname);
    }

    name(name, parameters = {}) {
        return this.historyManager.createHrefByName(name, parameters);
    }
}

const url = new URL();
url.setHistoryManager(HistoryManager);

export default url;
