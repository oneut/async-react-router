import React from "react";
import test from "ava";
import { mount } from "enzyme";
import ComponentResolver from "../../src/lib/ComponentResolver";
import Renderer from "../../src/lib/Renderer";

test("Default component", (t) => {
  const componentResolver = new ComponentResolver();
  t.is(componentResolver.getComponent(), null);
});

test("Set component", (t) => {
  // Create test component
  class TestComponent extends React.Component {
    render() {
      return <div>Test component</div>;
    }
  }

  const componentResolver = new ComponentResolver();
  componentResolver.setComponent(TestComponent);
  const actual = mount(React.createElement(componentResolver.getComponent()));
  const expected = mount(React.createElement(TestComponent));
  t.is(actual.html(), expected.html());
});

test("Set component from renderer", (t) => {
  // Create test component
  class TestComponent extends React.Component {
    render() {
      return (
        <div>
          <div>message: {this.props.params.message}</div>
          <div>pathname: {this.props.pathname}</div>
        </div>
      );
    }
  }

  const renderer = new Renderer("/", TestComponent, {
    message: "Hello, world"
  });
  const componentResolver = new ComponentResolver();
  componentResolver.setComponentFromRenderer(renderer);
  const actual = mount(React.createElement(componentResolver.getComponent()));
  const expected = mount(
    React.createElement(TestComponent, {
      params: {
        message: "Hello, world"
      },
      pathname: "/"
    })
  );
  t.is(actual.html(), expected.html());
});
