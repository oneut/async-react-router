import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import RouteMatcher from "../../../src/lib/RouteMatcher";
import HistoryManager from "../../../src/lib/HistoryManager";
import Connector from "../../../src/lib/Connector";
import LoadRunner from "../../../src/lib/runner/LoadRunner";
import InitialPropsRunner from "../../../src/lib/runner/InitialPropsRunner";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();
  const historyManager = new HistoryManager();

  const connector = new Connector(historyManager, routeMatcher);

  t.context.connector = connector;
});

test.cb("Rendering", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    static initialPropsWillGet(props) {
      t.is(props.pathname, "/");
    }

    static async getInitialProps(props) {
      t.is(props.pathname, "/");
      return {
        message: "world"
      };
    }

    static initialPropsDidGet(componentProps) {
      t.is(componentProps.pathname, "/");
    }

    render() {
      return <div>Hello, {this.props.message}</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  const runner = new LoadRunner(initializedConnector);
  runner.run(async (RootComponent) => {
    const mountedActual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { message: "world" })
    );
    t.is(mountedActual.html(), expected.html());

    t.plan(4);
    t.end();
  });
});

test("No match route", (t) => {
  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  const runner = new LoadRunner(initializedConnector);
  runner.run(async (RootComponent) => {
    t.fail();
  });

  t.pass();
});

test.cb("Not found page", (t) => {
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

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory({
      initialEntries: ["/not-found"]
    })
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  initializedConnector.routeMatcher.addRoute("(.*)", NotFoundPage);
  const runner = new InitialPropsRunner(initializedConnector, {});
  runner.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(React.createElement(NotFoundPage));
    t.is(actual.html(), expected.html());
    t.end();
  });
});
