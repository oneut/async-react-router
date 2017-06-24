export default class Renderer {
    constructor(pathname, component, params, prevRenderer) {
        this.pathname     = pathname;
        this.component    = component;
        this.params       = params;
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

    fireInitialPropsWillGet() {
        if (this.isFunction(this.component.initialPropsWillGet)) {
            const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
            this.component.initialPropsWillGet(this.getProps(), prevProps);
        }
    }

    async fireGetInitialProps() {
        if (!(this.isFunction(this.component.getInitialProps))) return {};
        const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
        return await this.component.getInitialProps(this.getProps(), prevProps) || {};
    }

    fireInitialPropsDidGet() {
        if (this.isFunction(this.component.initialPropsDidGet)) {
            const prevProps = !!this.prevRenderer ? this.prevRenderer.getProps() : {};
            this.component.initialPropsDidGet(this.getProps(), prevProps);
        }
    }

    isFunction(func) {
        if (!!func && typeof func === 'function') return true;
        return false;
    }
}