import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import Connector from "../../src/lib/Connector";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";

class IndexPage extends React.Component {
  render() {
    return <div>Hello, world</div>;
  }
}

test.beforeEach((t) => {
  t.context.routeMatcher = new RouteMatcher();
  t.context.historyManager = new HistoryManager();
  t.context.historyManager.initialRouteMatcher(t.context.routeMatcher);
  t.context.routeMatcher.addRoute("/", IndexPage);
});

test.serial("Unregistered subscribe", (t) => {
  // Set history
  t.context.historyManager.initialHistory(createMemoryHistory());

  // Connector test
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );
  t.context.historyManager.push("/");
  t.notThrows(() => {
    connector.onStateChange();
  });
});

test.cb("Subscribe", (t) => {
  // Set history
  t.context.historyManager.initialHistory(createMemoryHistory());

  // Connector test
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );
  connector.subscribe(() => {
    t.pass();
    t.end();
  });

  connector.onStateChange();
});

test.cb("Request", (t) => {
  // Set history
  t.context.historyManager.initialHistory(createMemoryHistory());

  // Connector test
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );
  connector.subscribe(() => {
    t.pass();
    t.end();
  });
  connector.request("/");
});

test("Set/Get component", (t) => {
  // Set history
  t.context.historyManager.initialHistory(createMemoryHistory());

  // Create test component
  class FirstPage extends React.Component {
    render() {
      return <div>First Page</div>;
    }
  }

  // Connector test
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );
  connector.componentResolver.setComponent(FirstPage);

  const actual = mount(
    React.createElement(connector.componentResolver.getComponent())
  );
  const expected = mount(React.createElement(FirstPage));
  t.is(actual.html(), expected.html());
});

test.serial("Set component from renderer", async (t) => {
  // Set history
  t.context.historyManager.initialHistory(createMemoryHistory());

  // Connector test
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );
  const renderer = await t.context.routeMatcher.createRenderer("/");
  connector.componentResolver.setComponentFromRenderer(renderer);

  const actual = mount(
    React.createElement(connector.componentResolver.getComponent())
  );
  const expected = mount(React.createElement(IndexPage));
  t.is(actual.html(), expected.html());
});
