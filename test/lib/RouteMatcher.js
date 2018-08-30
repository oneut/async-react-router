import React from "react";
import test from "ava";
import RouteMatcher from "../../src/lib/RouteMatcher";

test("Add route", (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/Test", TestComponent);
  t.is(routeMatcher.routes[0].path, "/Test");
  t.is(routeMatcher.routes[0].component, TestComponent);
});

test("Add Route with url params", (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/Test/:id", TestComponent, "test");
  t.is(routeMatcher.routes[0].path, "/Test/:id");
  t.is(routeMatcher.routes[0].component, TestComponent);
  t.is(routeMatcher.nameRoutes["test"], "/Test/:id");
});

test.serial("Fetch renderer on index", async (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/index", TestComponent);
  const renderer = await routeMatcher.createRenderer("/index");
  const prams = renderer.getProps().params;
  t.is(renderer.getComponent(), TestComponent);
  t.true(Object.keys(prams).length === 0 && typeof prams === "object");
});

test.serial("Fetch renderer on show", async (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/show/:id", TestComponent);
  const renderer = await routeMatcher.createRenderer("/show/1");
  const prams = renderer.getProps().params;
  t.is(renderer.getComponent(), TestComponent);
  t.is(prams.id, 1);
});

test.serial("Fetch renderer with int params", async (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/show/:id", TestComponent);
  const renderer = await routeMatcher.createRenderer("/show/1");
  const prams = renderer.getProps().params;
  t.is(renderer.getComponent(), TestComponent);
  t.is(prams.id, 1);
});

test.serial("Fetch renderer with string params", async (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/string/:name", TestComponent);
  const renderer = await routeMatcher.createRenderer("/string/name");
  const prams = renderer.getProps().params;
  t.is(renderer.getComponent(), TestComponent);
  t.is(prams.name, "name");
});

test.serial("Fetch renderer on not found", async (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/show/:id", TestComponent);
  const renderer = await routeMatcher.createRenderer("/show/1/test");
  t.is(renderer, null);
});

test.serial("Fetch renderer with __esModule on dynamic imports", async (t) => {
  class EsModuleComponent extends React.Component {
    render() {
      return <div>Hello, esModule.</div>;
    }
  }

  function importMock() {
    return new Promise((resolve) => {
      resolve({
        default: EsModuleComponent,
        __esModule: true
      });
    });
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/esmodule", importMock, "esmodule", true);
  const renderer = await routeMatcher.createRenderer("/esmodule");
  const prams = renderer.getProps().params;
  t.is(renderer.getComponent(), EsModuleComponent);
  t.true(Object.keys(prams).length === 0 && typeof prams === "object");
});

test.serial(
  "Fetch renderer without __esModule on dynamic imports",
  async (t) => {
    class EsModuleComponent extends React.Component {
      render() {
        return <div>Hello, esModule.</div>;
      }
    }

    function importMock() {
      return new Promise((resolve) => {
        resolve(EsModuleComponent);
      });
    }

    const routeMatcher = new RouteMatcher();
    routeMatcher.addRoute("/unesmodule", importMock, "unesmodule", true);
    const renderer = await routeMatcher.createRenderer("/unesmodule");
    const prams = renderer.getProps().params;
    t.is(renderer.getComponent(), EsModuleComponent);
    t.true(Object.keys(prams).length === 0 && typeof prams === "object");
  }
);

test.serial("Compile by name", (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/Test", TestComponent, "test");
  const url = routeMatcher.compileByName("test");
  t.is(url, "/Test");
});

test("Compile by name with url params", (t) => {
  class TestComponent extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/Test/:id", TestComponent, "test");
  const url = routeMatcher.compileByName("test", { id: 1 });
  t.is(url, "/Test/1");
});

test("Error compile by name ", (t) => {
  const error = t.throws(() => {
    const routeMatcher = new RouteMatcher();
    routeMatcher.compileByName("test");
  }, Error);

  t.is(error.message, `Route Name "test" did not match Path.`);
});
