import { of } from "rxjs";
import { map, mergeMap, skipWhile, switchMap } from "rxjs/operators";
import React from "react";
import RootComponent from "../RootComponent";

export default class LoadRunner {
  constructor(connector) {
    this.connector = connector;
  }

  run(callback) {
    const location = this.connector.historyManager.getLocation();

    of(location.pathname)
      .pipe(
        switchMap((pathname) =>
          this.connector.routeMatcher.createRenderer(pathname)
        ),
        skipWhile((renderer) => renderer === null),
        map((renderer) => renderer.fireInitialPropsWillGet()),
        mergeMap((renderer) => renderer.fireGetInitialProps()),
        map((renderer) => renderer.fireInitialPropsDidGet())
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
