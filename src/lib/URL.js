export default class URL {
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
