import HistoryManager from "./HistoryManager"
import React from "react";
import RouteMatcher from "./RouteMatcher";
import * as Utils from "./Utils";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/fromPromise";

export default class Router extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            component: null
        };

        this.stream = null;

        // Settings HistoryManager.
        this.initHistory();

        // Settings RxJS Stream.
        this.initStream();

        RouteMatcher.init();

        // Settings Routes.
        this.addRoutes(props.children);
    }

    initHistory() {
        HistoryManager.initialHistory(this.getHistory());
        HistoryManager.setRequestCallback(this.request.bind(this));
        HistoryManager.listen();
    }

    getHistory() {
        if (!!this.props.history) {
            return this.props.history;
        } else {
            return require("history").createHashHistory();
        }
    }

    initStream() {
        this.stream = new Subject();
        this.stream
            .switchMap((pathname) => this.renderer(pathname))
            .subscribe((component) => this.setComponent(component));
    }

    async renderer(pathname) {
        const renderer = RouteMatcher.fetchRenderer(Utils.normalizePathname(pathname)).getRenderer();
        if (renderer) {
            renderer.fireInitialPropsWillGet();
            await renderer.fireGetInitialProps();
            renderer.fireInitialPropsStoreHook();
            renderer.fireInitialPropsDidGet();
            return React.createElement(renderer.getComponent(), {...renderer.getComponentProps(), ...this.props});
        }

        return null;
    }

    /**
     * Add routes.
     */

    addRoutes(routes, parentPath) {
        React.Children.toArray(routes).forEach((route) => this.addRoute(route, parentPath));
    }

    /**
     * Add route.
     */

    addRoute(route, parentPath) {
        const {path, component, children, name} = route.props;
        const normalizedPath                    = Utils.cleanPath(Utils.createRoute(path, parentPath));
        RouteMatcher.addRoute(normalizedPath, component, name);
        if (children) this.addRoutes(children, normalizedPath);
    }

    componentWillMount() {
        const location = HistoryManager.getLocation();
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
