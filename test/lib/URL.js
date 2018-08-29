import test from "ava";
import URL from "../../src/lib/URL";

test("to", (t) => {
  class HistoryManagerMock {
    createHref(pathname) {
      t.is(pathname, "/test");
      return pathname;
    }
  }

  const url = new URL();
  url.setHistoryManager(new HistoryManagerMock());
  t.is(url.to("/test"), "/test");
});

test("name", (t) => {
  class HistoryManagerMock {
    createHrefByName(name, parameter) {
      t.is(name, "test");
      t.is(parameter.test, 1);
      return "/test/1";
    }
  }

  const url = new URL();
  url.setHistoryManager(new HistoryManagerMock());
  t.is(url.name("test", { test: 1 }), "/test/1");
  t.plan(3);
});

test("name without parameter", (t) => {
  class HistoryManagerMock {
    createHrefByName(name, parameters) {
      t.is(name, "test");
      t.true(
        Object.keys(parameters).length === 0 && typeof parameters === "object"
      );
      return "/test";
    }
  }

  const url = new URL();
  url.setHistoryManager(new HistoryManagerMock());
  t.is(url.name("test"), "/test");
  t.plan(3);
});
