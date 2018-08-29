import React from "react";
import Connector from "./Connector";
import RootComponent from "./RootComponent";

export default class Router {
  constructor(historyManager, routeMatcher) {
    this.firstComponent = null;
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;

    this.routeMatcher.init();
  }

  route(path, component, name) {
    this.routeMatcher.addRoute(path, component, name, false);
  }

  asyncRoute(path, component, name) {
    this.routeMatcher.addRoute(path, component, name, true);
  }

  setFirstComponent(component) {
    this.firstComponent = component;
  }

  run(callback) {
    const connector = new Connector(this.historyManager, this.routeMatcher);

    // Set first rendered component
    if (!!this.firstComponent) {
      connector.componentResolver.setComponent(this.firstComponent);
    }

    // Request current route component.
    const location = this.historyManager.getLocation();

    connector.request(location.pathname);

    // Create root component.
    callback((props) => {
      return React.createElement(RootComponent, {
        connector: connector,
        ...props
      });
    });
  }
}
