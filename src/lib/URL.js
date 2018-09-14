export default class URL {
  constructor(connector) {
    this.connector = connector;
  }

  to(pathname) {
    return this.connector.historyManager.createHref(pathname);
  }

  name(name, parameters = {}) {
    const pathname = this.connector.routeMatcher.compileByName(
      name,
      parameters
    );
    return this.connector.historyManager.createHref(pathname);
  }
}
