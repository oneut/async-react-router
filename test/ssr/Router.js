import Test from "ava";
import React from "react";
import { mount } from 'enzyme';
import Router from "../../src/ssr/Router";
import Route from "../../src/lib/Route";
import createMemoryHistory from "history/createMemoryHistory";
import browserEnv from 'browser-env';

browserEnv();

Test.serial('Index route', (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/');

    // Page Settings
    class IndexPage extends React.Component {
        static initialPropsWillGet() {
            t.fail();
        }

        static async getInitialProps() {
            t.fail();
        }

        static getFirstRenderedInitialProps() {
            return {
                message: 'first rendering data'
            };
        }

        static initialPropsStoreHook(componentProps) {
            t.is(componentProps.message, 'first rendering data');
        }

        static initialPropsDidGet() {
            t.fail();
        }

        render() {
            return (
                <div>
                    <h1>Index</h1>
                    {this.props.message}
                </div>
            );
        }
    }

    const actual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
        </Router>
    );

    const expected = mount(
        <IndexPage message="first rendering data"/>
    );

    t.is(actual.html(), expected.html());

    t.plan(2);
});

Test.serial('Router props', (t) => {
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

    const actual = mount(
        <Router history={history} items={['foo', 'bar', 'baz']}>
            <Route path="/" component={IndexPage}/>
        </Router>
    );

    const expected = mount(
        <IndexPage items={['foo', 'bar', 'baz']}/>
    );

    t.is(actual.html(), expected.html());
});

Test.serial('No match', (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/Test');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Index</h1>
                </div>
            );
        }
    }

    const actual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
        </Router>
    );

    // return null
    t.is(actual.html(), null);
});

Test.serial('Route nest', (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/parent/1/child');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Index</h1>
                </div>
            );
        }
    }

    class ParentPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Parent</h1>
                </div>
            );
        }
    }

    class ChildPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Child</h1>
                    <ul>{this.props.items.map((item, index) => (<li key={index}>{item}</li>))}</ul>
                </div>
            );
        }
    }

    const actual = mount(
        <Router history={history} items={['foo', 'bar', 'baz']}>
            <Route path="/" component={IndexPage}>
                <Route path="/parent/:id" component={ParentPage}>
                    <route path="/child" component={ChildPage}/>
                </Route>
            </Route>
        </Router>
    );

    const expected = mount(
        <ChildPage items={['foo', 'bar', 'baz']}/>
    );

    t.is(actual.html(), expected.html());
});

Test.serial('Not found', (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/not_found');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Index</h1>
                </div>
            );
        }
    }

    class ParentPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Parent</h1>
                </div>
            );
        }
    }

    class ChildPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Parent</h1>
                </div>
            );
        }
    }

    // Page Settings
    class NotFoundPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>NotFound</h1>
                </div>
            );
        }
    }

    const actual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}>
                <Route path="/parent/:id" component={ParentPage}>
                    <route path="/child" component={ChildPage}/>
                </Route>
            </Route>
            <Route path="*" component={NotFoundPage}/>
        </Router>
    );

    const expected = mount(
        <NotFoundPage/>
    );

    // return null
    t.is(actual.html(), expected.html());
});

Test.serial('Route order 1', (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/Test/1');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Index</h1>
                </div>
            );
        }
    }

    class TestPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Test</h1>
                </div>
            );
        }
    }

    class TestShowPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Test Show</h1>
                </div>
            );
        }
    }

    const actual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
            <Route path="/test/:id" component={TestShowPage}/>
            <Route path="/test" component={TestPage}/>
        </Router>
    );

    const expected = mount(
        <TestShowPage/>
    );

    // return null
    t.is(actual.html(), expected.html());
});

Test.serial('Route order 2', async (t) => {
    // Location Settings
    const history = createMemoryHistory();
    history.push('/Test');

    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Index</h1>
                </div>
            );
        }
    }

    class TestPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Test</h1>
                </div>
            );
        }
    }

    class TestShowPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Test Show</h1>
                </div>
            );
        }
    }

    const actual = mount(
        <Router history={history}>
            <Route path="/" component={IndexPage}/>
            <Route path="/test/:id" component={TestShowPage}/>
            <Route path="/test" component={TestPage}/>
        </Router>
    );

    const expected = mount(
        <TestPage/>
    );

    // return null
    t.is(actual.html(), expected.html());
});

Test.serial("Get default history", (t) => {
    const clientRouter = new Router({});
    const history = clientRouter.getHistory();
    t.true(typeof history === "object");
    t.true(typeof history.createHref === "function");
});
