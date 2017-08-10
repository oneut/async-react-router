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

    fireInitialPropsWillGet() {
        if (this.isFunction(this.component.initialPropsWillGet)) {
            const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
            this.component.initialPropsWillGet(this.getProps(), prevProps);
        }
    }

    async fireGetInitialProps() {
        if (!(this.isFunction(this.component.getInitialProps))) {
            this.data = {};
            return;
        }

        const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
        this.data       = await this.component.getInitialProps(this.getProps(), prevProps) || {};
    }

    getInitialProps() {
        return this.data;
    }

    fireInitialPropsStoreHook() {
        if (this.isFunction(this.component.initialPropsStoreHook)) {
            const prevComponentProps = !!this.prevRenderer ? this.prevRenderer.getComponentProps() : {};
            this.component.initialPropsStoreHook(this.getComponentProps(), prevComponentProps);
        }
    }

    fireInitialPropsDidGet() {
        if (this.isFunction(this.component.initialPropsDidGet)) {
            const prevComponentProps = !!this.prevRenderer ? this.prevRenderer.getComponentProps() : {};
            this.component.initialPropsDidGet(this.getComponentProps(), prevComponentProps);
        }
    }

    fireGetFirstRenderedInitialProps() {
        if (!(this.isFunction(this.component.getFirstRenderedInitialProps))) {
            this.data = {};
            return;
        }

        this.data = this.component.getFirstRenderedInitialProps(this.getProps()) || {};
    }

    isFunction(func) {
        if (!!func && typeof func === 'function') return true;
        return false;
    }
}
