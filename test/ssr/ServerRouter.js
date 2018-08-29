import React from "react";
import test from "ava";
import { mount } from "enzyme";
import ServerRouter from "../../src/ssr/ServerRouter";
import RouteMatcher from "../../src/lib/RouteMatcher";

test.beforeEach((t) => {
  const routeMatcher = new RouteMatcher();
  t.context.router = new ServerRouter(routeMatcher);
});

test.cb("Index route", (t) => {
  // Page Settings
  class IndexPage extends React.Component {
    static initialPropsWillGet() {
      t.fail();
    }

    static async getInitialProps() {
      return {
        message: "world"
      };
    }

    static initialPropsDidGet() {
      t.fail();
    }

    render() {
      return <div>Hello, {this.props.message}</div>;
    }
  }

  t.context.router.route("/", IndexPage);
  t.context.router.runUsingPathname("/", (RootComponent) => {
    // The Router use RxJS to control async/await.
    // So, First Mount is null.
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(
      React.createElement(IndexPage, { message: "world" })
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

  t.context.router.route("/", IndexPage);
  t.context.router.runUsingPathname("/no-match", (RootComponent) => {
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

  t.context.router.route("/", IndexPage);
  t.context.router.route("(.*)", NotFoundPage);
  t.context.router.runUsingPathname("/not-found", (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(React.createElement(NotFoundPage));
    t.is(actual.html(), expected.html());
    t.end();
  });
});

test.cb("Async route", (t) => {
  // Page Settings
  class DynamicImportComponent extends React.Component {
    static async getInitialProps() {
      return {
        message: "dynamic import"
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

  t.context.router.runUsingPathname("/", (RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(
      <DynamicImportComponent message={"dynamic import"} />
    );
    t.is(actual.html(), expected.html());
    t.end();
  });
});
