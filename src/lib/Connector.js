import { Subject } from "rxjs";
import { map, mergeMap, skipWhile, switchMap } from "rxjs/operators";
import React from "react";
import ComponentResolver from "./ComponentResolver";

export default class Connector {
  constructor(historyManager, routeMatcher) {
    this.stream = null;
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;
    this.onStateChange = () => {};

    // Settings HistoryManager.
    this.initHistory();

    // Settings RxJS Stream.
    this.initStream();

    this.componentResolver = new ComponentResolver();
  }

  initHistory() {
    this.historyManager.setRequestCallback(this.request.bind(this));
    this.historyManager.listen();
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
