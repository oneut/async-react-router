import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import Router from "../../src/lib/Router";
import Request from "../../src/lib/Request";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";
import { asyncFlush } from "../helpers/Utility";
import Connector from "../../src/lib/Connector";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();
  const historyManager = new HistoryManager();

  const connector = new Connector(historyManager, routeMatcher);

  const request = new Request(connector);

  t.context.connector = connector;
  t.context.historyManager = historyManager;
  t.context.request = request;
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
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { message: "world" })
    );
    t.is(actual.html(), expected.html());

    t.plan(4);
    t.end();
  });
});

test.cb("Rendering with first component", (t) => {
  class FirstPage extends React.Component {
    render() {
      return <div>first page</div>;
    }
  }

  // Page Settings
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
  const router = new Router(initializedConnector);

  router.setFirstComponent(FirstPage);
  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Rendering is null.
    const mountedActual = mount(<RootComponent />);
    const firstExpected = mount(<FirstPage />);
    t.is(mountedActual.html(), firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    mountedActual.update();
    const expected = mount(<IndexPage message={"world"} />);
    t.is(mountedActual.html(), expected.html());
    t.end();
  });
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
  const router = new Router(initializedConnector);
  router.setInitialProps({ items: ["foo", "bar", "baz"] });
  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { items: ["foo", "bar", "baz"] })
    );

    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Match single route", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(<IndexPage />);
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Match multiple route", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  class AnotherPage extends React.Component {
    render() {
      return <div>Nest Page</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory({
      initialEntries: ["/another"]
    })
  );
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.route("/another", AnotherPage);
  router.run(async (RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(<AnotherPage />);
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Next rendering from Request `to`", (t) => {
  // Page Settings
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

  class NextPage extends React.Component {
    static initialPropsWillGet(props, prevProps) {
      t.is(props.pathname, "/next");
      t.is(prevProps.pathname, "/");
    }

    static async getInitialProps(props, prevProps) {
      t.is(props.pathname, "/next");
      t.is(prevProps.pathname, "/");
      return {
        nextMessage: "next world"
      };
    }

    static initialPropsDidGet(componentProps, prevComponentProps) {
      t.is(componentProps.nextMessage, "next world");
      t.is(prevComponentProps.message, "world");
    }

    render() {
      return <div>Hello, {this.props.nextMessage}</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.route("/next", NextPage);
  router.run(async (RootComponent) => {
    // Test up to call renderer.
    const mountedActual = mount(React.createElement(RootComponent));
    const firstExpected = mount(
      React.createElement(IndexPage, { message: "world" })
    );
    t.is(mountedActual.html(), firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    // next rendering
    t.context.request.to("/next");

    // wait to resolve promise.
    await asyncFlush();

    // renderer update
    await mountedActual.update();
    const expected = mount(<NextPage nextMessage="next world" />);
    t.is(mountedActual.html(), expected.html());

    t.plan(8);
    t.end();
  });
});

test.cb("Router props", (t) => {
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
  router.run(async (RootComponent) => {
    const actual = mount(<RootComponent items={["foo", "bar", "baz"]} />);
    const expected = mount(<IndexPage items={["foo", "bar", "baz"]} />);
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Async route", (t) => {
  // Page Settings
  class DynamicImportComponent extends React.Component {
    static async getInitialProps(props, prevProps) {
      return {
        message: "Dynamic import"
      };
    }

    render() {
      return <div>{this.props.message}</div>;
    }
  }

  const initializedConnector = t.context.connector.newInitializedInstance(
    createMemoryHistory()
  );
  const router = new Router(initializedConnector);

  // Use promise instead of dynamic import
  router.asyncRoute("/", () => Promise.resolve(DynamicImportComponent));
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      <DynamicImportComponent message={"Dynamic import"} />
    );
    t.is(actual.html(), expected.html());
    t.end();
  });
});
