class Request {
  constructor(connector) {
    this.connector = connector;
  }

  to(to) {
    this.connector.historyManager.push(this.normarizeTo(to));
  }

  name(name, parameters = {}) {
    const pathname = this.connector.routeMatcher.compileByName(
      name,
      parameters
    );
    this.connector.historyManager.push(pathname);
  }

  isActive(pathname) {
    const location = this.connector.historyManager.getLocation();
    return location.pathname === pathname;
  }

  normarizeTo(to) {
    if (to[0] === "#") {
      return to.substr(1);
    }

    return to;
  }
}

export default Request;
