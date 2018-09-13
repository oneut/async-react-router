import InitialPropsRunner from "./runner/InitialPropsRunner";
import FirstComponentLoadRunner from "./runner/FirstComponentLoadRunner";
import LoadRunner from "./runner/LoadRunner";

export default class Router {
  constructor(connector) {
    this.connector = connector;
    this.initialProps = null;
    this.firstComponent = null;
  }

  route(path, component, name) {
    this.connector.routeMatcher.addRoute(path, component, name, false);
  }

  asyncRoute(path, component, name) {
    this.connector.routeMatcher.addRoute(path, component, name, true);
  }

  setFirstComponent(component) {
    this.firstComponent = component;
  }

  setInitialProps(initialProps) {
    this.initialProps = initialProps;
  }

  run(callback) {
    const runner = this.getRunner();
    runner.run(callback);
  }

  getRunner() {
    if (!!this.initialProps) {
      return new InitialPropsRunner(this.connector, this.initialProps);
    }

    if (!!this.firstComponent) {
      return new FirstComponentLoadRunner(this.connector, this.firstComponent);
    }

    return new LoadRunner(this.connector);
  }
}
