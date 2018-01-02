export default class Renderer {
    constructor(pathname, component, params, prevRenderer) {
        this.data         = {};
        this.component    = component;
        this.params       = params;
        this.pathname     = pathname;
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
        return !!this.prevRenderer ? this.prevRenderer.getComponentProps() : {};
    }

    fireInitialPropsWillGet() {
        if (this.isFunction(this.component.initialPropsWillGet)) {
            this.component.initialPropsWillGet(this.getProps(), this.getPrevProps());
        }
    }

    async fireGetInitialProps() {
        if (!(this.isFunction(this.component.getInitialProps))) {
            this.data = {};
            return;
        }

        this.data = await this.component.getInitialProps(this.getProps(), this.getPrevProps()) || {};
    }

    getInitialProps() {
        return this.data;
    }

    fireInitialPropsStoreHook() {
        if (this.isFunction(this.component.initialPropsStoreHook)) {
            this.component.initialPropsStoreHook(this.getComponentProps(), this.getPrevComponentProps());
        }
    }

    fireInitialPropsDidGet() {
        if (this.isFunction(this.component.initialPropsDidGet)) {
            this.component.initialPropsDidGet(this.getComponentProps(), this.getPrevComponentProps());
        }
    }

    isFunction(func) {
        if (!!func && typeof func === 'function') return true;
        return false;
    }

    setInitialProps(data) {
        if (!data) {
            this.data = {};
            return;
        }

        this.data = data;
        return this;
    }
}
