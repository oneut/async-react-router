import LinkEvent from "./LinkEvent";
import History from "./History";
import React from "react";
import RouteMatcher from './RouteMatcher';

export default class Router extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            component: null
        };

        this.silent = false;
        this.routes = {};
        this.initHistoryEvent();
        // Settings Routes.
        this.addRoutes(props.children);
    }

    initHistoryEvent() {
        LinkEvent.on(async (pathname) => {
            this.silent    = true;
            const location = {
                pathname: pathname
            };
            this.setNextComponent(location).then(() => {
                History.push(location.pathname);
                this.silent = false;
            });
        });

        // History Listener.
        History.listen((locaton) => {
            if (!(this.silent)) this.setNextComponent(locaton);
        });
    }

    renderer(location, props = {}) {
        for (const route in this.routes) {
            if (!(this.routes.hasOwnProperty(route))) continue;

            const render       = this.routes[route];
            const routeMatcher = RouteMatcher.make(route, location.pathname);
            if (routeMatcher.success()) {
                if (typeof render !== 'function') {
                    return render;
                }

                return render(routeMatcher.getParams(), props);
            }
        }

        return null;
    }

    /**
     * Add routes.
     */

    addRoutes(routes, parent) {
        React.Children.toArray(routes).forEach((route) => this.addRoute(route, parent));
    }

    /**
     * Add route.
     */

    addRoute(route, parent) {
        const {path, component, children} = route.props;

        const render = async (params, renderProps) => {
            const finalProps = {...this.props, ...renderProps, params};
            let data         = {};
            if (component.getInitialProps) {
                data = await component.getInitialProps() || {};
            }

            return React.createElement(component, Object.assign(data, finalProps));
        };

        const normalizedRoute = this.normalizeRoute(path, parent);
        if (children) this.addRoutes(children, {normalizedRoute});

        this.routes[this.cleanPath(normalizedRoute)] = render;
    }

    /**
     * Normalize route based on the parent.
     */

    normalizeRoute(path, parent) {
        if (path[0] === '/' && path.length === 1) return path;  // "/" signifies an absolute route
        if (typeof parent === 'undefined') return path;  // no need for a join
        return `${parent.normalizedRoute}/${path}`; // join
    }

    componentWillMount() {
        this.dispatch(History.location);
    }

    async setNextComponent(location) {
        await this.dispatch(location);
    }

    dispatch(location) {
        const component = this.renderer(location, {children: null});
        if (this.isPromise(component)) {
            return component.then((component) => {
                this.setState({
                    component: component
                });
            });
        }

        this.setState({
            component: component
        });
    }

    isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    /**
     * Clean path by stripping subsequent "//"'s. Without this
     * the user must be careful when to use "/" or not, which leads
     * to bad UX.
     */

    cleanPath(path) {
        return path.replace(/\/\//g, '/');
    }

    /**
     * Render the matching route.
     */

    render() {
        return this.state.component;
    }
}
