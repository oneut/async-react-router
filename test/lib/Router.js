import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import Router from "../../src/lib/Router";
import Request from "../../src/lib/Request";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";
import { asyncFlush } from "../helpers/Utility";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();

  const historyManager = new HistoryManager();
  historyManager.initialRouteMatcher(routeMatcher);

  const request = new Request();
  request.setHistoryManager(historyManager);

  t.context.router = new Router(historyManager, routeMatcher);
  t.context.historyManager = historyManager;
  t.context.request = request;
});

test.cb("Match single route", (t) => {
  // Location Settings
  t.context.historyManager.initialHistory(createMemoryHistory());

  // Page Settings
  class IndexPage extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  t.context.router.route("/", IndexPage);
  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const mountedActual = mount(<RootComponent />);
    t.is(mountedActual.html(), null);

    // wait to resolve promise.
    await asyncFlush();

    mountedActual.update();
    const expected = mount(<IndexPage />);
    t.is(mountedActual.html(), expected.html());
    t.end();
  });
});

test.cb("Match multiple route", (t) => {
  // Location Settings
  t.context.historyManager.initialHistory(
    createMemoryHistory({
      initialEntries: ["/another"]
    })
  );

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

  t.context.router.route("/", IndexPage);
  t.context.router.route("/another", AnotherPage);
  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const mountedActual = mount(<RootComponent />);
    t.is(mountedActual.html(), null);

    // wait to resolve promise.
    await asyncFlush();

    mountedActual.update();
    const expected = mount(<AnotherPage />);
    t.is(mountedActual.html(), expected.html());
    t.end();
  });
});

test.cb("Unmatch route", (t) => {
  // Location Settings
  t.context.historyManager.initialHistory(createMemoryHistory());
  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const mountedActual = mount(<RootComponent />);
    t.is(mountedActual.html(), null);

    // wait to resolve promise.
    await asyncFlush();

    // renderer from componentWillMount
    await mountedActual.update();
    t.is(mountedActual.html(), null);
    t.end();
  });
});

test.cb("First rendering", (t) => {
  t.context.historyManager.initialHistory(createMemoryHistory());

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

  // Location Settings
  t.context.router.route("/", IndexPage);
  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const mountedActual = mount(<RootComponent />);
    t.is(mountedActual.html(), null);

    // wait to resolve promise.
    await asyncFlush();

    // renderer from componentWillMount
    mountedActual.update();
    const expected = mount(<IndexPage message="world" />);
    t.is(mountedActual.html(), expected.html());

    t.plan(5);
    t.end();
  });
});

test.cb("Next rendering from Request `to`", (t) => {
  t.context.historyManager.initialHistory(createMemoryHistory());

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

  // Location Settings
  t.context.router.route("/", IndexPage);
  t.context.router.route("/next", NextPage);

  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // Test up to call renderer.
    const mountedActual = mount(<RootComponent />);
    t.is(mountedActual.html(), null);

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
  t.context.historyManager.initialHistory(createMemoryHistory());

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

  t.context.router.route("/", IndexPage);
  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Rendering is null.
    const mountedActual = mount(
      <RootComponent items={["foo", "bar", "baz"]} />
    );
    t.is(mountedActual.html(), null);

    // wait to resolve promise.
    await asyncFlush();

    mountedActual.update();
    const expected = mount(<IndexPage items={["foo", "bar", "baz"]} />);
    t.is(mountedActual.html(), expected.html());
    t.end();
  });
});

test.cb("Async route", (t) => {
  t.context.historyManager.initialHistory(createMemoryHistory());

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

  // Use promise instead of dynamic import
  t.context.router.asyncRoute("/", () =>
    Promise.resolve(DynamicImportComponent)
  );
  t.context.router.run(async (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Rendering is null.
    const mountedActual = mount(<RootComponent />);
    t.is(mountedActual.html(), null);

    // wait to resolve promise.
    await asyncFlush();

    mountedActual.update();
    const expected = mount(
      <DynamicImportComponent message={"Dynamic import"} />
    );
    t.is(mountedActual.html(), expected.html());
    t.end();
  });
});

test.cb("Set first component", (t) => {
  t.context.historyManager.initialHistory(createMemoryHistory());

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
      return <div>Hello, {this.props.name}</div>;
    }
  }

  t.context.router.setFirstComponent(FirstPage);
  t.context.router.route("/", IndexPage);
  t.context.router.run(async (RootComponent) => {
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
