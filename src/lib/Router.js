import React from "react";
import RouteNormalizer from "./RouteNormalizer";
import { Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { createHashHistory } from "history";

export default class Router extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      component: null
    };

    this.stream = null;

    // Settings HistoryManager.
    this.initHistory(props.historyManager);

    // Settings RxJS Stream.
    this.initStream();

    this.initRouteMatcher(props.routeMatcher, props.children);
  }

  initHistory(historyManager) {
    historyManager.initialHistory(this.props.history);
    historyManager.setRequestCallback(this.request.bind(this));
    historyManager.listen();
  }

  initStream() {
    this.stream = new Subject();
    this.stream
      .pipe(switchMap((pathname) => this.renderer(pathname)))
      .subscribe((component) => this.setComponent(component));
  }

  renderer(pathname) {
    return this.props.routeMatcher
      .fetchRenderer(pathname)
      .then((resolvedFetchRenderer) => {
        const renderer = resolvedFetchRenderer.getRenderer();

        if (!!renderer) {
          renderer.fireInitialPropsWillGet();
          return renderer.fireGetInitialProps().then(() => {
            return renderer;
          });
        }

        return null;
      })
      .then((renderer) => {
        if (!renderer) {
          return null;
        }

        renderer.fireInitialPropsDidGet();
        return React.createElement(renderer.getComponent(), {
          ...renderer.getComponentProps(),
          ...this.props
        });
      });
  }

  initRouteMatcher(routeMatcher, routes) {
    routeMatcher.init();

    // Settings Routes.
    const normalizedRoutes = RouteNormalizer.make()
      .addRoutes(routes)
      .get();
    normalizedRoutes.map((route) => {
      routeMatcher.addRoute(
        route.normalizedPath,
        route.component,
        route.name,
        !!route.isAsync
      );
    });
  }

  componentWillMount() {
    const location = this.props.historyManager.getLocation();
    this.stream.next(location.pathname);
  }

  request(pathname) {
    this.stream.next(pathname);
  }

  setComponent(component) {
    this.setState({
      component: component
    });
  }

  /**
   * Render the matching route.
   */

  render() {
    return this.state.component;
  }
}

export function createRouter(historyManager, routeMatcher) {
  return (props) => {
    const history = createHashHistory();
    return (
      <Router
        history={history}
        historyManager={historyManager}
        routeMatcher={routeMatcher}
        {...props}
      />
    );
  };
}
