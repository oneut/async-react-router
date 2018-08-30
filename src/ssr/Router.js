import React from "react";
import RootComponent from "../lib/RootComponent";
import { map, skipWhile, switchMap } from "rxjs/operators";
import { of } from "rxjs";

export default class Router {
  constructor(connector) {
    this.connector = connector;
    this.initialProps = {};
  }

  route(path, component, name) {
    this.connector.routeMatcher.addRoute(path, component, name, false);
  }

  asyncRoute(path, component, name) {
    this.connector.routeMatcher.addRoute(path, component, name, true);
  }

  setInitialProps(initialProps) {
    this.initialProps = initialProps;
  }

  run(callback) {
    const location = this.connector.historyManager.getLocation();

    of(location.pathname)
      .pipe(
        switchMap((pathname) =>
          this.connector.routeMatcher.createRenderer(pathname)
        ),
        skipWhile((renderer) => renderer === null),
        map((renderer) => renderer.setInitialProps(this.initialProps))
      )
      .subscribe((renderer) => {
        this.connector.componentResolver.setComponentFromRenderer(renderer);
        callback((props) => {
          return React.createElement(RootComponent, {
            connector: this.connector,
            ...props
          });
        });
      });
  }
}
