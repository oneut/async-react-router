import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import RouteMatcher from "../../../src/lib/RouteMatcher";
import HistoryManager from "../../../src/lib/HistoryManager";
import Connector from "../../../src/lib/Connector";
import InitialPropsRunner from "../../../src/lib/runner/InitialPropsRunner";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();
  const historyManager = new HistoryManager();

  const connector = new Connector(historyManager, routeMatcher);

  t.context.connector = connector;
});

test.cb("Rendering with initial props", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    static initialPropsWillGet() {
      t.fail();
    }

    static async getInitialProps() {
      t.fail();
    }

    static initialPropsDidGet() {
      t.fail();
    }

    render() {
      return (
        <div>
          <h1>Index</h1>
          <ul>
            {this.props.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  const runner = new InitialPropsRunner(initializedConnector, {
    items: ["foo", "bar", "baz"]
  });
  runner.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { items: ["foo", "bar", "baz"] })
    );

    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Rendering with empty initial props", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    static initialPropsWillGet() {
      t.fail();
    }

    static async getInitialProps() {
      t.fail();
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

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  const runner = new InitialPropsRunner(initializedConnector, {});
  runner.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(React.createElement(IndexPage, {}));
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test("No match route", (t) => {
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

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory({
      initialEntries: ["/unmatch"]
    })
  );
  initializedConnector.routeMatcher.addRoute("/", IndexPage);
  const runner = new InitialPropsRunner(initializedConnector, {});
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
