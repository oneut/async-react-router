export default class HistoryManager {
  constructor() {
    this.history = null;
    this.routeMatcher = null;
    this.requestCallback = null;
    this.silent = false;
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

  pushByName(name, parameters) {
    this.push(this.routeMatcher.compileByName(name, parameters));
  }

  createHref(pathname) {
    return this.history.createHref({ pathname });
  }

  createHrefByName(name, parameters) {
    const pathname = this.routeMatcher.compileByName(name, parameters);
    return this.createHref(pathname);
  }

  getLocation() {
    return this.history.location;
  }
}
