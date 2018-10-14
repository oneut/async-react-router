class Request {
  constructor(connector) {
    this.connector = connector;
  }

  to(to, callback = () => {}) {
    this.connector.historyManager.push(this.normarizeTo(to), callback);
  }

  name(name, parameters = {}, callback = () => {}) {
    const pathname = this.connector.routeMatcher.compileByName(
      name,
      parameters
    );
    this.connector.historyManager.push(pathname, callback);
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
