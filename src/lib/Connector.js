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
    // Settings HistoryManager.
    this.initHistory(history);

    // Settings RxJS Stream.
    this.initRouteMatcher();

    // Initial RouteMatcher
    this.initStream();

    return this;
  }

  initHistory(history) {
    this.historyManager.setHistory(history);
    this.historyManager.setRequestCallback(this.request.bind(this));
    this.historyManager.listen();
  }

  initRouteMatcher() {
    this.routeMatcher.init();
  }

  initStream() {
    this.stream = new Subject();
    this.stream
      .pipe(
        switchMap((pathname) => this.routeMatcher.createRenderer(pathname)),
        skipWhile((renderer) => renderer === null),
        map((renderer) => renderer.fireInitialPropsWillGet()),
        mergeMap((renderer) => renderer.fireGetInitialProps()),
        map((renderer) => renderer.fireInitialPropsDidGet())
      )
      .subscribe((renderer) => {
        this.componentResolver.setComponentFromRenderer(renderer);
        this.onStateChange();
      });
  }

  subscribe(onStateChange) {
    this.onStateChange = onStateChange;
  }

  request(pathname) {
    this.stream.next(pathname);
  }
}
