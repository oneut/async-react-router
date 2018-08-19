import React from "react";
import RouteNormalizer from "../lib/RouteNormalizer";
import createMemoryHistory from "history/createMemoryHistory";

export default class RouteResolver {
  constructor(historyManager, routeMatcher, route) {
    this.historyManager = historyManager;
    this.historyManager.initialHistory(createMemoryHistory());

    this.routeMatcher = routeMatcher;

    this.addRoute(route);
  }

  make(route) {
    return new RouteResolver(this.historyManager, this.routeMatcher, route);
  }

  /**
   * Compile component.
   */
  resolve(pathname, callback) {
    return this.routeMatcher
      .fetchRenderer(pathname)
      .then((resolvedFetchRenderer) => {
        const renderer = resolvedFetchRenderer.getRenderer();
        return renderer.fireGetInitialProps().then(() => {
          return renderer;
        });
      })
      .then((renderer) => {
        const data = renderer.getInitialProps();
        callback(
          React.createElement(
            renderer.getComponent(),
            renderer.getComponentProps()
          ),
          data
        );
      });
  }

  /**
   * Add route.
   */
  addRoute(route) {
    const normalizedRoutes = RouteNormalizer.make()
      .addRoute(route)
      .get();
    normalizedRoutes.map((route) => {
      this.routeMatcher.addRoute(
        route.normalizedPath,
        route.component,
        route.name
      );
    });
  }
}
