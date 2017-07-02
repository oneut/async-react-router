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
        return {
            ...this.getProps(),
            ...this.data
        }
    }

    fireInitialPropsWillGet() {
        if (this.isFunction(this.component.initialPropsWillGet)) {
            const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
            this.component.initialPropsWillGet(this.getProps(), prevProps);
        }
    }

    async fireGetInitialProps() {
        await this.fetchInitialProps();
        return this.data;
    }

    async fetchInitialProps() {
        if (!(this.isFunction(this.component.getInitialProps))) return {};
        const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
        this.data       = await this.component.getInitialProps(this.getProps(), prevProps) || {};
    }

    fireInitialPropsDidGet() {
        if (this.isFunction(this.component.initialPropsDidGet)) {
            const prevComponentProps = !!this.prevRenderer ? this.prevRenderer.getComponentProps() : {};
            this.component.initialPropsDidGet(this.getComponentProps(), prevComponentProps);
        }
    }

    isFunction(func) {
        if (!!func && typeof func === 'function') return true;
        return false;
    }
}