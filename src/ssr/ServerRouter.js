import React from "react";
import { mergeMap, skipWhile, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import ComponentResolver from "../lib/ComponentResolver";

export default class ServerRouter {
  constructor(routeMatcher) {
    this.history = null;
    this.routeMatcher = routeMatcher;
    this.routeMatcher.init();
  }

  route(path, component, name) {
    this.routeMatcher.addRoute(path, component, name, false);
  }

  asyncRoute(path, component, name) {
    this.routeMatcher.addRoute(path, component, name, true);
  }

  runUsingPathname(pathname, callback) {
    of(pathname)
      .pipe(
        switchMap((pathname) => this.routeMatcher.createRenderer(pathname)),
        skipWhile((renderer) => renderer === null),
        mergeMap((renderer) => renderer.fireGetInitialProps())
      )
      .subscribe((renderer) => {
        const componentResolver = new ComponentResolver();
        componentResolver.setComponentFromRenderer(renderer);
        callback((props) => {
          return React.createElement(componentResolver.getComponent(), {
            ...props
          });
        }, renderer.getInitialProps());
      });
  }
}
