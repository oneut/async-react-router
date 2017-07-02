import test from "ava";
import React from "react";
import Renderer from "../src/Renderer";

test('Renderer function test', async (t) => {
    class Component extends React.Component {
        static async getInitialProps(props, prevProps) {
            return {
                data: 'data'
            };
        }

        render() {
            return (<div>Hello, World</div>);
        }
    }

    // Make Renderer
    const pathname  = '/path/';
    const component = Component;
    const params    = {
        parameter1: 'parameter1'
    };
    const renderer  = new Renderer(pathname, component, params);

    // Renderer Setup. Important to the order!.
    t.is(renderer.getPathname(), pathname);
    t.is(renderer.getComponent(), component);
    t.is(renderer.getParams().parameter1, params.parameter1);
});

test('Renderer fire Component method.', async (t) => {
    class PrevComponent extends React.Component {
        static async getInitialProps() {
            return {
                data: 'prev'
            };
        }

        render() {
            return (<div>Hello, World</div>);
        }
    }

    class Component extends React.Component {
        static initialPropsWillGet(props, prevProps) {
            t.is(props.pathname, '/path/');
            t.is(props.params.parameter1, 'parameter1');
            t.is(prevProps.pathname, '/prevPath/');
            t.is(prevProps.params.prevParameter1, 'prevParameter1');
        }

        static async getInitialProps(props, prevProps) {
            t.is(props.pathname, '/path/');
            t.is(props.params.parameter1, 'parameter1');
            t.is(prevProps.pathname, '/prevPath/');
            t.is(prevProps.params.prevParameter1, 'prevParameter1');
            return {
                data: 'data'
            };
        }

        static initialPropsDidGet(componentProps, prevComponentProps) {
            t.is(componentProps.pathname, '/path/');
            t.is(componentProps.params.parameter1, 'parameter1');
            t.is(componentProps.data, 'data');
            t.is(prevComponentProps.pathname, '/prevPath/');
            t.is(prevComponentProps.params.prevParameter1, 'prevParameter1');
            t.is(prevComponentProps.data, 'prev');
        }

        render() {
            return (<div>Hello, World</div>);
        }
    }

    // Make PrevRenderer.
    const prevPathname  = '/prevPath/';
    const prevComponent = PrevComponent;
    const prevParams    = {
        prevParameter1: 'prevParameter1'
    };
    const prevRenderer  = new Renderer(prevPathname, prevComponent, prevParams);

    // Renderer Setup. Important to the order!.
    prevRenderer.fireInitialPropsWillGet();
    await prevRenderer.fireGetInitialProps();
    prevRenderer.fireInitialPropsDidGet();

    // Make Renderer
    const pathname  = '/path/';
    const component = Component;
    const params    = {
        parameter1: 'parameter1'
    };
    const renderer  = new Renderer(pathname, component, params, prevRenderer);

    // Renderer Setup. Important to the order!.
    renderer.fireInitialPropsWillGet();
    const props = await renderer.fireGetInitialProps()
    renderer.fireInitialPropsDidGet();

    t.plan(14);
});