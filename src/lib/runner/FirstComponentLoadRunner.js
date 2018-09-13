import React from "react";
import RootComponent from "../RootComponent";

export default class FirstComponentLoadRunner {
  constructor(connector, firstComponent) {
    this.connector = connector;
    this.firstComponent = firstComponent;
  }

  run(callback) {
    const location = this.connector.historyManager.getLocation();
    this.connector.request(location.pathname);

    this.connector.componentResolver.setComponent(this.firstComponent);

    callback((props) => {
      return React.createElement(RootComponent, {
        connector: this.connector,
        ...props
      });
    });
  }
}
