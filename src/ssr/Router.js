import RouterBase from "../lib/Router";
import React from "react";
import { createBrowserHistory } from "history";

class Router extends RouterBase {
  componentWillMount() {
    const location = this.props.historyManager.getLocation();
    this.props.routeMatcher
      .fetchRenderer(location.pathname)
      .then((routeMatcher) => {
        const renderer = routeMatcher.getRenderer();
        if (renderer) {
          renderer.setInitialProps(this.props.firstRenderedInitialProps);
          this.setComponent(
            React.createElement(renderer.getComponent(), {
              ...renderer.getComponentProps(),
              ...this.props
            })
          );
        }
      });
  }
}

export function createRouter(historyManager, routeMatcher) {
  return (props) => {
    const history = createBrowserHistory();
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
