export default class Renderer {
  constructor(pathname, component, params, requestCallback, prevRenderer) {
    this.data = {};
    this.component = component;
    this.params = params;
    this.requestCallback = requestCallback;
    this.pathname = pathname;
    this.prevRenderer = prevRenderer;
  }

  getPathname() {
    return this.pathname;
  }

  getComponent() {
    return this.component;
  }

  getParams() {
    return this.params;
  }

  getProps() {
    return {
      pathname: this.pathname,
      params: this.params
    };
  }

  getComponentProps() {
    return Object.assign(this.data, this.getProps());
  }

  getPrevProps() {
    return !!this.prevRenderer ? this.prevRenderer.getProps() : {};
  }

  getPrevComponentProps() {
    if (!!this.prevRenderer) {
      return this.prevRenderer.getComponentProps();
    }

    return {};
  }

  fireInitialPropsWillGet() {
    if (this.isFunction(this.component.initialPropsWillGet)) {
      this.component.initialPropsWillGet(this.getProps(), this.getPrevProps());
    }

    return this;
  }

  fireGetInitialProps() {
    if (!this.isFunction(this.component.getInitialProps)) {
      this.data = {};
      return Promise.resolve(this);
    }

    return Promise.resolve(
      this.component.getInitialProps(this.getProps(), this.getPrevProps())
    ).then((params) => {
      if (!!params) {
        this.data = params;
        return this;
      }
      this.data = {};
      return this;
    });
  }

  getInitialProps() {
    return this.data;
  }

  fireInitialPropsDidGet() {
    if (this.isFunction(this.component.initialPropsDidGet)) {
      this.component.initialPropsDidGet(
        this.getComponentProps(),
        this.getPrevComponentProps()
      );
    }

    return this;
  }

  fireRequestCallback() {
    this.requestCallback();
    return this;
  }

  isFunction(func) {
    return !!func && typeof func === "function";
  }

  setInitialProps(data) {
    if (!data) {
      this.data = {};
      return this;
    }

    this.data = data;
    return this;
  }
}
