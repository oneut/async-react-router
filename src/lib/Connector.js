import { Subject } from "rxjs";
import { map, mergeMap, skipWhile, switchMap } from "rxjs/operators";
import React from "react";
import ComponentResolver from "./ComponentResolver";

export default class Connector {
  constructor(historyManager, routeMatcher, componentResolver = null) {
    this.stream = null;
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;
    this.componentResolver = componentResolver;
    this.onStateChange = () => {};
  }

  newInitializedInstance(history) {
    const connector = new Connector(
      this.historyManager,
      this.routeMatcher,
      new ComponentResolver()
    );
    connector.init(history);
    return connector;
  }

  init(history) {
    this.initHistory(history);
    this.initRouteMatcher();
    this.initStream();
    return this;
  }

  initHistory(history) {
    this.historyManager.setHistory(history);
    this.historyManager.setHistoryCallback(this.request.bind(this));
    this.historyManager.listen();
  }

  initRouteMatcher() {
    this.routeMatcher.init();
  }

  initStream() {
    this.stream = new Subject();
    this.stream
      .pipe(
        switchMap((request) =>
          this.routeMatcher.createRenderer(request.pathname, request.callback)
        ),
        skipWhile((renderer) => renderer === null),
        map((renderer) => renderer.fireInitialPropsWillGet()),
        mergeMap((renderer) => renderer.fireGetInitialProps()),
        map((renderer) =>
          renderer.fireInitialPropsDidGet().fireRequestCallback()
        )
      )
      .subscribe((renderer) => {
        this.componentResolver.setComponentFromRenderer(renderer);
        this.onStateChange();
      });
  }

  subscribe(onStateChange) {
    this.onStateChange = onStateChange;
  }

  request(pathname, callback) {
    this.stream.next({
      pathname: pathname,
      callback: callback
    });
  }
}
