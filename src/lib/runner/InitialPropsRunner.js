import { of } from "rxjs";
import { map, skipWhile, switchMap } from "rxjs/operators";
import React from "react";
import RootComponent from "../RootComponent";

export default class InitialPropsRunner {
  constructor(connector, initialProps) {
    this.connector = connector;
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
