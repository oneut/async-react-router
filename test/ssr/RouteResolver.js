import test from "ava";
import React from "react";
import { mount } from "enzyme";
import RouteResolver from "../../src/ssr/RouteResolver";
import Route from "../../src/lib/Route";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";
import Request from "../../src/lib/Request";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();

  const historyManager = new HistoryManager();
  historyManager.initialRouteMatcher(routeMatcher);

  const request = new Request();
  request.setHistoryManager(historyManager);

  t.context.routerReolver = new RouteResolver(historyManager, routeMatcher);
});

test.serial("resolve single route", async (t) => {
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

  const route = <Route path="/" component={IndexPage} />;

  const routeResolver = t.context.routerReolver.make(route);
  await routeResolver.resolve("/", (component, data) => {
    const actual = mount(component);
    const expected = mount(<IndexPage />);
    t.is(actual.html(), expected.html());
  });
});

test.serial("resolve nest route", async (t) => {
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

  class NestPage extends React.Component {
    render() {
      return (
        <div>
          <h1>Nest</h1>
        </div>
      );
    }
  }

  const route = (
    <Route path="/" component={IndexPage}>
      <Route path="/nest" component={NestPage} />
    </Route>
  );

  const routeResolver = t.context.routerReolver.make(route);
  await routeResolver.resolve("/nest", (component, data) => {
    const actual = mount(component);
    const expected = mount(<NestPage />);
    t.is(actual.html(), expected.html());
  });
});

test.serial("fire component method", async (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    static initialPropsWillGet() {
      t.fail();
    }

    static async getInitialProps() {
      return {
        message: "first rendering data"
      };
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

  const route = <Route path="/" component={IndexPage} />;

  const routeResolver = t.context.routerReolver.make(route);
  await routeResolver.resolve("/", (component, data) => {
    const actual = mount(component);
    const expected = mount(<IndexPage message="first rendering data" />);
    t.is(actual.html(), expected.html());
    t.is(data.message, "first rendering data");
  });
});
