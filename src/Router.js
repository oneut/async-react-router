import History from "./History";
import React from "react";
import RouteMatcher from "./RouteMatcher";
import * as Utils from "./Utils";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/fromPromise";

export default class Router extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            component: null
        };

        this.stream = null;

        // Settings History.
        this.initHistory();

        // Settings RxJS Stream.
        this.initStream();

        // Settings Routes.
        this.addRoutes(props.children);
    }

    initHistory() {
        History.initialHistory(this.props.history);
        History.setRequestCallback(this.request.bind(this));
        History.listen();
    }

    initStream() {
        this.stream = new Subject();
        this.stream
            .switchMap((pathname) => this.renderer(pathname))
            .subscribe((component) => this.setComponent(component));
    }

    async renderer(pathname) {
        const renderer = RouteMatcher.getRenderer(Utils.normalizePathname(pathname));
        renderer.fireInitialPropsWillGet();
        const data = await renderer.fireGetInitialProps();
        renderer.fireInitialPropsDidGet();
        return React.createElement(renderer.getComponent(), Object.assign(data, renderer.getProps()));
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
        const {path, component, children, name} = route.props;
        const normalizedPath                    = Utils.cleanPath(Utils.createRoute(path, parent));
        RouteMatcher.addRoute(normalizedPath, component, name);
        if (children) this.addRoutes(children, {path: normalizedPath});
    }

    componentWillMount() {
        const location = History.getLocation();
        this.stream.next(location.pathname);
    }

    async request(pathname) {
        await this.stream.next(pathname);
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
