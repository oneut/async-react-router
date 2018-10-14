export default class HistoryManager {
  constructor() {
    this.history = null;
    this.historyCallback = null;
    this.silent = false;
  }

  setHistory(history) {
    this.history = history;
  }

  setHistoryCallback(historyCallback) {
    this.historyCallback = historyCallback;
  }

  changeSilent() {
    this.silent = true;
  }

  changeUnsilent() {
    this.silent = false;
  }

  listen() {
    this.history.listen(this.listenCallback.bind(this));
  }

  listenCallback(location) {
    if (!this.silent) this.historyCallback(location.pathname, () => {});
  }

  push(pathname, callback) {
    this.changeSilent();
    this.historyCallback(pathname, callback);
    this.history.push(pathname);
    this.changeUnsilent();
  }

  createHref(pathname) {
    return this.history.createHref({ pathname });
  }

  getLocation() {
    return this.history.location;
  }
}
