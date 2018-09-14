import test from "ava";
import Connector from "../../src/lib/Connector";
import URL from "../../src/lib/URL";

test("To", (t) => {
  class HistoryManagerMock {
    createHref(pathname) {
      t.is(pathname, "/test");
    }
  }

  const connector = new Connector(new HistoryManagerMock());

  const url = new URL(connector);
  url.to("/test");
});

test("Name", (t) => {
  class HistoryManagerMock {
    createHref(pathname) {
      t.is(pathname, "/test");
    }
  }

  class RouteMatcherMock {
    compileByName(name) {
      t.is(name, "test");
      return "/test";
    }
  }

  const connector = new Connector(
    new HistoryManagerMock(),
    new RouteMatcherMock()
  );

  const url = new URL(connector);
  url.name("test");
  t.plan(2);
});

test("Name with parameters", (t) => {
  class HistoryManagerMock {
    createHref(pathname) {
      t.is(pathname, "/test/1");
    }
  }

  class RouteMatcherMock {
    compileByName(name, parameters) {
      t.is(name, "test");
      t.is(parameters.test, 1);
      return "/test/1";
    }
  }

  const connector = new Connector(
    new HistoryManagerMock(),
    new RouteMatcherMock()
  );

  const url = new URL(connector);
  url.name("test", { test: 1 });
  t.plan(3);
});
