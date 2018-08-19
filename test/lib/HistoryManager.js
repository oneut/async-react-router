import test from "ava";
import HistoryManager from "../../src/lib/HistoryManager";
import createMemoryHistory from "history/createMemoryHistory";

test.serial("push path", async (t) => {
  const historyCallBack = (pathname) => {
    t.is(pathname, "/test");
  };

  const historyManager = new HistoryManager();
  historyManager.initialHistory(createMemoryHistory());
  historyManager.setRequestCallback(historyCallBack);
  historyManager.listen();
  await historyManager.push("/test");

  const location = historyManager.getLocation();
  t.is(location.pathname, "/test");
});

test.serial("push path by name", async (t) => {
  class RouteMatcherMock {
    compileByName(name, parameters = {}) {
      return "/test/1";
    }
  }

  const historyCallBack = (pathname) => {
    t.is(pathname, "/test/1");
  };

  const historyManager = new HistoryManager();
  historyManager.initialHistory(createMemoryHistory());
  historyManager.initialRouteMatcher(new RouteMatcherMock());
  historyManager.setRequestCallback(historyCallBack);
  historyManager.listen();
  await historyManager.pushByName("Test", { test: 1 });

  const location = historyManager.getLocation();
  t.is(location.pathname, "/test/1");
});

test.serial("create path", (t) => {
  const historyManager = new HistoryManager();
  historyManager.initialHistory(createMemoryHistory());
  t.is(historyManager.createHref("/create_href"), "/create_href");
});

test.serial("listen silent", async (t) => {
  const historyCallBack = (pathname) => {
    t.fail();
  };

  const location = {
    pathname: "/test"
  };

  const historyManager = new HistoryManager();
  historyManager.setRequestCallback(historyCallBack);
  historyManager.changeSilent();
  historyManager.listenCallback(location);
  t.pass();
});

test.serial("listen unsilent", async (t) => {
  const historyCallBack = (pathname) => {
    t.is(pathname, "/unsilent");
  };

  const location = {
    pathname: "/unsilent"
  };

  const historyManager = new HistoryManager();
  historyManager.setRequestCallback(historyCallBack);
  historyManager.changeSilent();
  historyManager.changeUnsilent();
  historyManager.listenCallback(location);
});

test.serial("create path by name", (t) => {
  class RouteMatcherMock {
    compileByName(name, parameters = {}) {
      t.is(name, "create_href_by_name");
      t.is(parameters.test, 1);
      return "/create_href_by_name/1";
    }
  }

  const historyManager = new HistoryManager();
  historyManager.initialHistory(createMemoryHistory());
  historyManager.initialRouteMatcher(new RouteMatcherMock());
  t.is(
    historyManager.createHrefByName("create_href_by_name", { test: 1 }),
    "/create_href_by_name/1"
  );
});
