export default class HistoryManager {
  constructor() {
    this.history = null;
    this.requestCallback = null;
    this.silent = false;
  }

  setHistory(history) {
    this.history = history;
  }

  setRequestCallback(requestCallback) {
    this.requestCallback = requestCallback;
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
    if (!this.silent) this.requestCallback(location.pathname);
  }

  push(pathname) {
    this.changeSilent();
    this.requestCallback(pathname);
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
