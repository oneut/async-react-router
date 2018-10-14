import test from "ava";
import HistoryManager from "../../src/lib/HistoryManager";
import createMemoryHistory from "history/createMemoryHistory";

test("Push pathname", (t) => {
  // Create history callback
  const historyCallBack = (pathname) => {
    t.is(pathname, "/test");
  };

  // HistoryManager test
  const historyManager = new HistoryManager();
  historyManager.setHistory(createMemoryHistory());
  historyManager.setHistoryCallback(historyCallBack);
  historyManager.listen();

  historyManager.push("/test");

  const location = historyManager.getLocation();
  t.is(location.pathname, "/test");
  t.plan(2);
});

test("Create pathname", (t) => {
  // HistoryManager test
  const historyManager = new HistoryManager();
  historyManager.setHistory(createMemoryHistory());
  t.is(historyManager.createHref("/create_href"), "/create_href");
});

test("Listen silent", (t) => {
  // Create history callback
  const historyCallBack = (pathname) => {
    t.fail();
  };

  // Define location
  const location = {
    pathname: "/test"
  };

  // HistoryManager test
  const historyManager = new HistoryManager();
  historyManager.setHistoryCallback(historyCallBack);
  historyManager.changeSilent();
  historyManager.listenCallback(location);
  t.pass();
  t.plan(1);
});

test("Listen unsilent", (t) => {
  // Create history callback
  const historyCallBack = (pathname) => {
    t.is(pathname, "/unsilent");
  };

  // Define location
  const location = {
    pathname: "/unsilent"
  };

  // HistoryManager test
  const historyManager = new HistoryManager();
  historyManager.setHistoryCallback(historyCallBack);
  historyManager.changeSilent();
  historyManager.changeUnsilent();
  historyManager.listenCallback(location);
  t.plan(1);
});
