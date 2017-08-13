import Test from "ava";
import React from "react";
import { mount } from "enzyme";
import ServerRouteCompiler from "../src/ServerRouteCompiler";
import Route from "../src/Route";

Test.serial("compile single route", async (t) => {
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

    const route = (
        <Route path="/" component={IndexPage}/>
    );

    const compiler = ServerRouteCompiler.make(route, '/');
    compiler.compile((component, data) => {
        const actual   = mount(component);
        const expected = mount(
            <IndexPage/>
        );
        t.is(actual.html(), expected.html());
    });
});

Test.serial("compile nest route", async (t) => {
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

    class NestPage extends React.Component {
        render() {
            return (
                <div>
                    <h1>Nest</h1>
                </div>
            );
        }
    }


    const route = (
        <Route path="/" component={IndexPage}>
            <Route path="/nest" component={NestPage}/>
        </Route>
    );

    const compiler = ServerRouteCompiler.make(route, '/nest');
    compiler.compile((component, data) => {
        const actual   = mount(component);
        const expected = mount(
            <NestPage/>
        );
        t.is(actual.html(), expected.html());
    });
});

Test.serial("fire component method", async (t) => {
    // Page Settings
    class IndexPage extends React.Component {
        static initialPropsWillGet() {
            t.fail();
        }

        static async getInitialProps() {
            return {
                message: 'first rendering data'
            };
        }

        static getFirstRenderedInitialProps() {
            t.fail();
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

    const route = (
        <Route path="/" component={IndexPage}/>
    );

    const compiler = ServerRouteCompiler.make(route, '/');
    compiler.compile((component, data) => {
        const actual   = mount(component);
        const expected = mount(
            <IndexPage message="first rendering data"/>
        );
        t.is(actual.html(), expected.html());
        t.is(data.message, "first rendering data");
    });
});
