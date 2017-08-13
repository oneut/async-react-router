import React from "react";
import Test from "ava";
import Route from "../src/Route";
import Router from "../src/Router";
import Request from "../src/Request";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import Sinon from "sinon";

Test.serial('match single route', async (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    // Ready Sinon Spy
    const spy = Sinon.spy(Router.prototype, 'renderer');

    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const firstMountedActual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
        </Router>
    );
    t.is(firstMountedActual.html(), null);

    // renderer from componentWillMount
    const component = await spy.getCall(0).returnValue;
    const actual    = mount(component);
    const expected  = mount(<IndexPage/>);
    t.is(actual.html(), expected.html());

    // renderer args Test
    t.is(spy.getCall(0).args[0], '/');

    // Restore Sinon Spy
    Router.prototype.renderer.restore();
});

Test.serial('match nest route', async (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/nest');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    class NestPage extends React.Component {
        render() {
            return (<div>Nest Page</div>);
        }
    }

    // Ready Sinon Spy
    const spy = Sinon.spy(Router.prototype, 'renderer');

    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const firstMountedActual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}>
                <Route path="/nest" component={NestPage}/>
            </Route>
        </Router>
    );
    t.is(firstMountedActual.html(), null);

    // renderer from componentWillMount
    const component = await spy.getCall(0).returnValue;
    const actual    = mount(component);
    const expected  = mount(<NestPage/>);
    t.is(actual.html(), expected.html());

    // renderer args Test
    t.is(spy.getCall(0).args[0], '/nest');

    // Restore Sinon Spy
    Router.prototype.renderer.restore();
});

Test.serial("default history", async (t) => {
    const router = new Router({});
    const history = router.getHistory();
    t.is(history.location.pathname, "/");
});

Test.serial('first rendering', async (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/');

    // Page Settings
    class IndexPage extends React.Component {
        static initialPropsWillGet(props) {
            t.is(props.pathname, '/');
        }

        static async getInitialProps(props) {
            t.is(props.pathname, '/');
            return {
                message: 'world'
            };
        }

        static getFirstRenderedInitialProps() {
            t.fail();
        }

        static initialPropsStoreHook(componentProps) {
            t.is(componentProps.message, 'world');
        }

        static initialPropsDidGet(componentProps) {
            t.is(componentProps.pathname, '/');
        }

        render() {
            return (<div>Hello, {this.props.message}</div>);
        }
    }

    // Ready Sinon Spy
    const spy = Sinon.spy(Router.prototype, 'renderer');

    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const firstMountedActual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
        </Router>
    );
    t.is(firstMountedActual.html(), null);

    // renderer from componentWillMount
    const component = await spy.getCall(0).returnValue;
    const actual    = mount(component);
    const expected = mount(<IndexPage message="world"/>);
    t.is(actual.html(), expected.html());

    // renderer args Test
    t.is(spy.getCall(0).args[0], '/');

    t.plan(7);

    // Restore Sinon Spy
    Router.prototype.renderer.restore();
});

Test.serial('next rendering from Request `to`', async (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/');

    // Page Settings
    class IndexPage extends React.Component {
        static async getInitialProps(props, prevProps) {
            return {
                message: 'world'
            };
        }

        render() {
            return (<div>Hello, {this.props.name}</div>);
        }
    }

    class UserPage extends React.Component {
        static initialPropsWillGet(props, prevProps) {
            t.is(props.pathname, '/user');
            t.is(prevProps.pathname, '/');
        }

        static async getInitialProps(props, prevProps) {
            t.is(props.pathname, '/user');
            t.is(prevProps.pathname, '/');
            return {
                userName: 'oneut'
            };
        }

        static getFirstRenderedInitialProps() {
            t.fail();
        }

        static initialPropsStoreHook(componentProps, prevComponentProps) {
            t.is(componentProps.userName, 'oneut');
            t.is(prevComponentProps.message, 'world');
        }

        static initialPropsDidGet(componentProps, prevComponentProps) {
            t.is(componentProps.userName, 'oneut');
            t.is(prevComponentProps.message, 'world');
        }

        render() {
            return (<div>Hello, {this.props.userName}</div>);
        }
    }

    const spy = Sinon.spy(Router.prototype, 'renderer');

    // The Router use RxJS to control async/await.
    // Test up to call renderer.
    mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
            <Route path="/user" component={UserPage}/>
        </Router>
    );

    Request.to('/user');

    // renderer Test
    const component = await spy.getCall(1).returnValue;
    const actual    = mount(component);

    const expected = mount(<UserPage userName="oneut"/>);
    t.is(actual.html(), expected.html());

    // renderer args Test
    t.is(spy.getCall(1).args[0], '/user');

    t.plan(10);

    // Restore Sinon Spy
    Router.prototype.renderer.restore();
});

Test.serial('Router props', async (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Index</h1>
                    <ul>{this.props.items.map((item, index) => (<li key={index}>{item}</li>))}</ul>
                </div>
            );
        }
    }

    const spy = Sinon.spy(Router.prototype, 'renderer');

    // The Router use RxJS to control async/await.
    // So, First Rendering is null.
    const firstMoutedActual = mount(
        <Router history={history} items={['foo', 'bar', 'baz']}>
            <Route path="/" component={IndexPage}/>
        </Router>
    );
    t.is(firstMoutedActual.html(), null);

    // renderer from componentWillMount
    const component = await spy.getCall(0).returnValue;
    const actual    = mount(component);
    const expected = mount(<IndexPage items={['foo', 'bar', 'baz']}/>);
    t.is(actual.html(), expected.html());

    // renderer args Test
    t.is(spy.getCall(0).args[0], '/');
});

