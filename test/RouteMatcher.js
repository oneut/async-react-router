import React from 'react';
import test from 'ava';
import RouteMatcher from '../src/RouteMatcher';

test('Add Route', (t) => {
    class TestComponent extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test', TestComponent);
    t.is(RouteMatcher.routes[0].path, '/Test');
    t.is(RouteMatcher.routes[0].component, TestComponent);

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test/:id', TestComponent, 'test');
    t.is(RouteMatcher.routes[0].path, '/Test/:id');
    t.is(RouteMatcher.routes[0].component, TestComponent);
    t.is(RouteMatcher.nameRoutes['test'], '/Test/:id');
});

test('Fetch renderer', (t) => {
    class TestComponent extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    RouteMatcher.init();
    RouteMatcher.addRoute('/int', TestComponent);
    const renderer1 = RouteMatcher.fetchRenderer('/int').getRenderer();
    const prams1    = renderer1.getProps().params;
    t.is(renderer1.getComponent(), TestComponent);
    t.true(Object.keys(prams1).length === 0 && typeof prams1 === "object");

    RouteMatcher.init();
    RouteMatcher.addRoute('/int/:id', TestComponent);
    const renderer2 = RouteMatcher.fetchRenderer('/int/1').getRenderer();
    const prams2    = renderer2.getProps().params;
    t.is(renderer2.getComponent(), TestComponent);
    t.is(prams2.id, 1);

    RouteMatcher.init();
    RouteMatcher.addRoute('/int/:id', TestComponent);
    const renderer3 = RouteMatcher.fetchRenderer('/int/1/test').getRenderer();
    t.is(renderer3, null);

    RouteMatcher.init();
    RouteMatcher.addRoute('/string/:name', TestComponent);
    const renderer4 = RouteMatcher.fetchRenderer('/string/name').getRenderer();
    const prams4    = renderer4.getProps().params;
    t.is(renderer4.getComponent(), TestComponent);
    t.is(prams4.name, 'name');

    RouteMatcher.init();
    RouteMatcher.addRoute('/string/:name+', TestComponent);
    const renderer5 = RouteMatcher.fetchRenderer('/string').getRenderer();
    t.is(renderer5, null);

    RouteMatcher.init();
    RouteMatcher.addRoute('/string/:name+', TestComponent);
    const renderer6 = RouteMatcher.fetchRenderer('/string/name').getRenderer();
    const prams6    = renderer6.getProps().params;
    t.is(renderer6.getComponent(), TestComponent);
    t.is(prams6.name, 'name');
});

test('Compile by name', (t) => {
    class TestComponent extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test', TestComponent, 'test');
    const url = RouteMatcher.compileByName('test');
    t.is(url, '/Test');

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test/:id', TestComponent, 'test');
    const url2 = RouteMatcher.compileByName('test', {id: 1});
    t.is(url2, '/Test/1');
});

test('Error compile by name ', (t) => {
    const error = t.throws(() => {
        RouteMatcher.init();
        RouteMatcher.compileByName('test');
    }, Error);

    t.is(error.message, `Route Name "test" did not match Path.`);
});
