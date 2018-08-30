import React from "react";
import RootComponent from "./RootComponent";

export default class Router {
  constructor(connector) {
    this.connector = connector;
  }

  route(path, component, name) {
    this.connector.routeMatcher.addRoute(path, component, name, false);
  }

  asyncRoute(path, component, name) {
    this.connector.routeMatcher.addRoute(path, component, name, true);
  }

  setFirstComponent(component) {
    this.connector.componentResolver.setComponent(component);
  }

  run(callback) {
    // Request current route component.
    const location = this.connector.historyManager.getLocation();
    this.connector.request(location.pathname);

    // Create root component.
    callback((props) => {
      return React.createElement(RootComponent, {
        connector: this.connector,
        ...props
      });
    });
  }
}
