import React from 'react';
import test from 'ava';
import Route from "../../src/lib/Route";
import RouteNormalizer from '../../src/lib/RouteNormalizer';

test('make method', (t) => {
    const routeNormalizer =  RouteNormalizer.make();
    t.is(routeNormalizer.constructor.name, "RouteNormalizer");
});

test('addRoute method', (t) => {
    // Page Settings
    class IndexPage extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    const route = (<Route path="/" component={IndexPage} name="IndexPage"/>);

    const routeNormalizer =  RouteNormalizer.make();
    const normalizedRoutes = routeNormalizer.addRoute(route).get();

    const indexPageRoute = normalizedRoutes[0];

    t.is(indexPageRoute.normalizedPath, '/');
    t.is(indexPageRoute.component, IndexPage);
    t.is(indexPageRoute.name, "IndexPage");
});

test('addRoute method with nest', (t) => {
    // Page Settings
    class FirstPage extends React.Component {
        render() {
            return (<div>Hello, First</div>);
        }
    }

    class SecondPage extends React.Component {
        render() {
            return (<div>Hello, Second</div>);
        }
    }

    class ThirdPage extends React.Component {
        render() {
            return (<div>Hello, Third</div>);
        }
    }

    const route = (
        <Route path="/" component={FirstPage} name="FirstPage">
            <Route path="/second" component={SecondPage} name="SecondPage">
                <Route path="/third" component={ThirdPage} name="ThirdPage"/>
            </Route>
        </Route>
    );

    const normalizeRouter = RouteNormalizer.make();
    const normalizedRoutes = normalizeRouter.addRoute(route).get();

    const firstPageRoute = normalizedRoutes[0];

    t.is(firstPageRoute.normalizedPath, '/');
    t.is(firstPageRoute.component, FirstPage);
    t.is(firstPageRoute.name, "FirstPage");

    const secondPageRoute = normalizedRoutes[1];

    t.is(secondPageRoute.normalizedPath, '/second');
    t.is(secondPageRoute.component, SecondPage);
    t.is(secondPageRoute.name, "SecondPage");

    const thirdPageRoute = normalizedRoutes[2];

    t.is(thirdPageRoute.normalizedPath, '/second/third');
    t.is(thirdPageRoute.component, ThirdPage);
    t.is(thirdPageRoute.name, "ThirdPage");
});

test('addRoutes method', (t) => {
    // Page Settings
    class FirstPage extends React.Component {
        render() {
            return (<div>Hello, First</div>);
        }
    }

    class SecondPage extends React.Component {
        render() {
            return (<div>Hello, Second</div>);
        }
    }

    const div = (
        <div>
            <Route path="/first" component={FirstPage} name="FirstPage"/>
            <Route path="/second" component={SecondPage} name="SecondPage"/>
        </div>
    );

    const routeNormalizer =  RouteNormalizer.make();
    const normalizedRoutes = routeNormalizer.addRoutes(div.props.children).get();

    const firstPageRoute = normalizedRoutes[0];

    t.is(firstPageRoute.normalizedPath, '/first');
    t.is(firstPageRoute.component, FirstPage);
    t.is(firstPageRoute.name, "FirstPage");

    const secondPageRoute = normalizedRoutes[1];

    t.is(secondPageRoute.normalizedPath, '/second');
    t.is(secondPageRoute.component, SecondPage);
    t.is(secondPageRoute.name, "SecondPage");
});
