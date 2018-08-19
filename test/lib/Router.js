import React from "react";
import test from "ava";
import { mount } from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import Route from "../../src/lib/Route";
import { createRouter } from "../../src/lib/Router";
import Request from "../../src/lib/Request";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";

const asyncFlush = () => new Promise((resolve) => setTimeout(resolve, 0));

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();

  const historyManager = new HistoryManager();
  historyManager.initialRouteMatcher(routeMatcher);

  const request = new Request();
  request.setHistoryManager(historyManager);

  t.context.router = createRouter(historyManager, routeMatcher);
  t.context.request = request;
});

test.serial("match single route", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/");

  // Page Settings
  class IndexPage extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  // The Router use RxJS to control async/await.
  // So, First Mount is null.
  const mountedActual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );
  t.is(mountedActual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  // renderer from componentWillMount
  await mountedActual.update();
  const expected = mount(<IndexPage />);
  t.is(mountedActual.html(), expected.html());
});

test.serial("match nest route", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/nest");

  // Page Settings
  class IndexPage extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  class NestPage extends React.Component {
    render() {
      return <div>Nest Page</div>;
    }
  }

  // The Router use RxJS to control async/await.
  // So, First Mount is null.
  const mountedActual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage}>
        <Route path="/nest" component={NestPage} />
      </Route>
    </t.context.router>
  );
  t.is(mountedActual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  // renderer from componentWillMount
  await mountedActual.update();
  const expected = mount(<NestPage />);
  t.is(mountedActual.html(), expected.html());
});

test.serial("unmatch route", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/nest");

  // The Router use RxJS to control async/await.
  // So, First Mount is null.
  const mountedActual = mount(<t.context.router history={history} />);
  t.is(mountedActual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  // renderer from componentWillMount
  await mountedActual.update();
  t.is(mountedActual.html(), null);
});

test.serial("default history", async (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    static initialPropsDidGet(componentProps) {
      t.is(componentProps.pathname, "/");
    }

    render() {
      return <div>Hello, World</div>;
    }
  }

  // The Router use RxJS to control async/await.
  // So, First Mount is null.
  const mountedActual = mount(
    <t.context.router>
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );
  t.is(mountedActual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  // renderer from componentWillMount
  await mountedActual.update();
  const expected = mount(<IndexPage />);
  t.is(mountedActual.html(), expected.html());

  t.plan(3);
});

test.serial("first rendering", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/");

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

  // The Router use RxJS to control async/await.
  // So, First Mount is null.
  const mountedActual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );
  t.is(mountedActual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  // renderer from componentWillMount
  await mountedActual.update();
  const expected = mount(<IndexPage message="world" />);
  t.is(mountedActual.html(), expected.html());

  t.plan(5);
});

test.serial("next rendering from Request `to`", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/");

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

  class UserPage extends React.Component {
    static initialPropsWillGet(props, prevProps) {
      t.is(props.pathname, "/user");
      t.is(prevProps.pathname, "/");
    }

    static async getInitialProps(props, prevProps) {
      t.is(props.pathname, "/user");
      t.is(prevProps.pathname, "/");
      return {
        userName: "oneut"
      };
    }

    static initialPropsDidGet(componentProps, prevComponentProps) {
      t.is(componentProps.userName, "oneut");
      t.is(prevComponentProps.message, "world");
    }

    render() {
      return <div>Hello, {this.props.userName}</div>;
    }
  }

  // The Router use RxJS to control async/await.
  // Test up to call renderer.
  const mountedActual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/user" component={UserPage} />
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  // next rendering
  t.context.request.to("/user");

  // wait to resolve promise.
  await asyncFlush();

  // renderer update
  await mountedActual.update();
  const expected = mount(<UserPage userName="oneut" />);
  t.is(mountedActual.html(), expected.html());

  t.plan(7);
});

test.serial("Router props", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/");

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

  // The Router use RxJS to control async/await.
  // So, First Rendering is null.
  const mountedActual = mount(
    <t.context.router history={history} items={["foo", "bar", "baz"]}>
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );
  t.is(mountedActual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  // renderer from componentWillMount
  mountedActual.update();
  const expected = mount(<IndexPage items={["foo", "bar", "baz"]} />);
  t.is(mountedActual.html(), expected.html());
});
