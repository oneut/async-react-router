import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import Router from "../../src/ssr/Router";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";
import Connector from "../../src/lib/Connector";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();
  const historyManager = new HistoryManager();

  const connector = new Connector(historyManager, routeMatcher);

  t.context.connector = connector;
});

test.cb("Index route", (t) => {
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
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.setInitialProps({ message: "first rendering data" });
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { message: "first rendering data" })
    );
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Set initial props", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
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
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.setInitialProps({ items: ["foo", "bar", "baz"] });
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { items: ["foo", "bar", "baz"] })
    );

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
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
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
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.route("(.*)", NotFoundPage);
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(React.createElement(NotFoundPage));
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Async route", (t) => {
  // Page Settings
  class DynamicImportComponent extends React.Component {
    render() {
      return <div>{this.props.message}</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  const router = new Router(initializedConnector);

  router.setInitialProps({ message: "dynamic import" });
  // Use promise instead of dynamic import
  router.asyncRoute("/", () => Promise.resolve(DynamicImportComponent));
  router.run((RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(
      <DynamicImportComponent message={"dynamic import"} />
    );
    t.is(actual.html(), expected.html());
    t.end();
  });
});
