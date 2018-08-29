import React from "react";
import Connector from "../lib/Connector";
import RootComponent from "../lib/RootComponent";
import { map, skipWhile, switchMap } from "rxjs/operators";
import { of } from "rxjs";

export default class Router {
  constructor(historyManager, routeMatcher) {
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;
    this.initialProps = {};

    this.routeMatcher.init();
  }

  route(path, component, name) {
    this.routeMatcher.addRoute(path, component, name, false);
  }

  asyncRoute(path, component, name) {
    this.routeMatcher.addRoute(path, component, name, true);
  }

  setInitialProps(initialProps) {
    this.initialProps = initialProps;
  }

  run(callback) {
    const location = this.historyManager.getLocation();

    of(location.pathname)
      .pipe(
        switchMap((pathname) => this.routeMatcher.createRenderer(pathname)),
        skipWhile((renderer) => renderer === null),
        map((renderer) => renderer.setInitialProps(this.initialProps))
      )
      .subscribe((renderer) => {
        const connector = new Connector(this.historyManager, this.routeMatcher);
        connector.componentResolver.setComponentFromRenderer(renderer);
        callback((props) => {
          return React.createElement(RootComponent, {
            connector: connector,
            ...props
          });
        });
      });
  }
}
