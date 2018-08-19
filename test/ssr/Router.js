import test from "ava";
import React from "react";
import { mount } from "enzyme";
import Route from "../../src/lib/Route";
import createMemoryHistory from "history/createMemoryHistory";
import browserEnv from "browser-env";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";
import Request from "../../src/lib/Request";
import { createRouter } from "../../src/ssr/Router";

browserEnv();

const asyncFlush = () => new Promise((resolve) => setTimeout(resolve, 0));

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();

  const historyManager = new HistoryManager();
  historyManager.initialRouteMatcher(routeMatcher);

  const request = new Request();
  request.setHistoryManager(historyManager);

  t.context.router = createRouter(historyManager, routeMatcher);
});

test.serial("Index route", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/");

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

  const firstRenderedInitialProps = { message: "first rendering data" };
  const actual = mount(
    <t.context.router
      history={history}
      firstRenderedInitialProps={firstRenderedInitialProps}
    >
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );
  t.is(actual.html(), null);

  // wait to resolve promise.
  await asyncFlush();

  actual.update();
  const expected = mount(<IndexPage message="first rendering data" />);

  t.is(actual.html(), expected.html());

  t.plan(2);
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

  const actual = mount(
    <t.context.router history={history} items={["foo", "bar", "baz"]}>
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  actual.update();
  const expected = mount(<IndexPage items={["foo", "bar", "baz"]} />);

  t.is(actual.html(), expected.html());
});

test.serial("No match", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/Test");

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

  const actual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage} />
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  actual.update();

  // return null
  t.is(actual.html(), null);
});

test.serial("Route nest", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/parent/1/child");

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

  class ParentPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Parent</h1>
        </div>
      );
    }
  }

  class ChildPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Child</h1>
          <ul>
            {this.props.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  const actual = mount(
    <t.context.router history={history} items={["foo", "bar", "baz"]}>
      <Route path="/" component={IndexPage}>
        <Route path="/parent/:id" component={ParentPage}>
          <route path="/child" component={ChildPage} />
        </Route>
      </Route>
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  actual.update();
  const expected = mount(<ChildPage items={["foo", "bar", "baz"]} />);

  t.is(actual.html(), expected.html());
});

test.serial("Not found", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/not_found");

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

  class ParentPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Parent</h1>
        </div>
      );
    }
  }

  class ChildPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Parent</h1>
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

  const actual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage}>
        <Route path="/parent/:id" component={ParentPage}>
          <route path="/child" component={ChildPage} />
        </Route>
      </Route>
      <Route path="(.*)" component={NotFoundPage} />
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  actual.update();
  const expected = mount(<NotFoundPage />);

  // return null
  t.is(actual.html(), expected.html());
});

test.serial("Route order desc for show", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/Test/1");

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

  class TestPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Test</h1>
        </div>
      );
    }
  }

  class TestShowPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Test Show</h1>
        </div>
      );
    }
  }

  const actual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/test/:id" component={TestShowPage} />
      <Route path="/test" component={TestPage} />
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  actual.update();
  const expected = mount(<TestShowPage />);

  // return null
  t.is(actual.html(), expected.html());
});

test.serial("Route order desc for index", async (t) => {
  // Location Settings
  const history = createMemoryHistory();
  history.push("/Test");

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

  class TestPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Test</h1>
        </div>
      );
    }
  }

  class TestShowPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Test Show</h1>
        </div>
      );
    }
  }

  const actual = mount(
    <t.context.router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/test/:id" component={TestShowPage} />
      <Route path="/test" component={TestPage} />
    </t.context.router>
  );

  // wait to resolve promise.
  await asyncFlush();

  actual.update();
  const expected = mount(<TestPage />);

  // return null
  t.is(actual.html(), expected.html());
});
