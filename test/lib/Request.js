import test from "ava";
import Connector from "../../src/lib/Connector";
import Request from "../../src/lib/Request";

test("To", async (t) => {
  // Create mock
  class HistoryManagerMock {
    push(pathname) {
      t.is(pathname, "/test");
    }
  }

  class RouteMatcherMock {}

  const connector = new Connector(
    new HistoryManagerMock(),
    new RouteMatcherMock()
  );

  // Request test
  const request = new Request(connector);
  request.to("/test");
});

test("Name", async (t) => {
  // Create mock
  class HistoryManagerMock {
    push(pathname) {
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

  // Request test
  const request = new Request(connector);
  request.name("test");
});

test("Name with parameters", async (t) => {
  // Create mock
  class HistoryManagerMock {
    push(pathname) {
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

  // Request test
  const request = new Request(connector);
  request.name("test", { test: 1 });
});

test("isActive", async (t) => {
  // Create mock
  class HistoryManagerMock {
    getLocation() {
      return {
        pathname: "/test"
      };
    }
  }

  class RouteMatcherMock {}

  const connector = new Connector(
    new HistoryManagerMock(),
    new RouteMatcherMock()
  );

  // Request test
  const request = new Request(connector);
  t.true(request.isActive("/test"));
  t.false(request.isActive("/"));
});

test("Request path normalized", async (t) => {
  // Request test
  const request = new Request();
  t.is(request.normarizeTo("#/test"), "/test");
  t.is(request.normarizeTo("/test"), "/test");
  t.is(request.normarizeTo("/test/1"), "/test/1");
});
