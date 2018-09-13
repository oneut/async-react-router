import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import RouteMatcher from "../../../src/lib/RouteMatcher";
import HistoryManager from "../../../src/lib/HistoryManager";
import { asyncFlush } from "../../helpers/Utility";
import Connector from "../../../src/lib/Connector";
import FirstComponentLoadRunner from "../../../src/lib/runner/FirstComponentLoadRunner";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();
  const historyManager = new HistoryManager();
  const connector = new Connector(historyManager, routeMatcher);
  t.context.connector = connector;
});

test.cb("Rendering first component", (t) => {
  // Page Settings
  class FirstPage extends React.Component {
    render() {
      return <div>first page</div>;
    }
  }

  class IndexPage extends React.Component {
    static async getInitialProps(props, prevProps) {
      return {
        message: "world"
      };
    }

    render() {
      return <div>Hello, {this.props.message}</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  const runner = new FirstComponentLoadRunner(initializedConnector, FirstPage);
  runner.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const firstExpected = mount(React.createElement(FirstPage));
    t.is(actual.html(), firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    actual.update();
    const expected = mount(
      React.createElement(IndexPage, { message: "world" })
    );
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("No match route", (t) => {
  // Page Settings
  class FirstPage extends React.Component {
    render() {
      return <div>first page</div>;
    }
  }

  class IndexPage extends React.Component {
    static async getInitialProps(props, prevProps) {
      return {
        message: "world"
      };
    }

    render() {
      return <div>Hello, {this.props.message}</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory({
      initialEntries: ["/unmatch"]
    })
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  const runner = new FirstComponentLoadRunner(initializedConnector, FirstPage);
  runner.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const firstExpected = mount(React.createElement(FirstPage));
    t.is(actual.html(), firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    actual.update();
    t.is(actual.html(), firstExpected.html());
    t.end();
  });
});

test.cb("Not found page", (t) => {
  // Page Settings
  class FirstPage extends React.Component {
    render() {
      return <div>first page</div>;
    }
  }

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
  initializedConnector.routeMatcher.addRoute("(.*)", NotFoundPage);
  const runner = new FirstComponentLoadRunner(initializedConnector, FirstPage);
  runner.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const firstExpected = mount(React.createElement(FirstPage));
    t.is(actual.html(), firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    const expected = mount(React.createElement(NotFoundPage));
    t.is(actual.html(), expected.html());
    t.end();
  });
});
