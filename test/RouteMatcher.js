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

test('Get renderer', (t) => {
    class TestComponent extends React.Component {
        render() {
            return (<div>Hello, World</div>);
        }
    }

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test', TestComponent);
    const renderer1 = RouteMatcher.fetchRenderer('/Test').getRenderer();
    t.is(renderer1.getComponent(), TestComponent);

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test/:id', TestComponent);
    const renderer2 = RouteMatcher.fetchRenderer('/Test/1').getRenderer();
    t.is(renderer2.getComponent(), TestComponent);

    RouteMatcher.init();
    RouteMatcher.addRoute('/Test/:id', TestComponent);
    const renderer3 = RouteMatcher.fetchRenderer('/Test/1/Test').getRenderer();
    t.is(renderer3, null);
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
