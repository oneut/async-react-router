import test from "ava";
import Request from "../../src/lib/Request";

test("To", async (t) => {
  class HistoryManagerMock {
    push(pathname) {
      t.is(pathname, "/Test");
    }
  }

  const request = new Request();
  request.setHistoryManager(new HistoryManagerMock());
  request.to("/Test");
});

test("Name", async (t) => {
  class HistoryManagerMock {
    pushName(name, parameters) {
      t.is(name, "test");
      t.true(
        Object.keys(parameters).length === 0 && typeof parameters === "object"
      );
    }
  }

  const request = new Request();
  request.setHistoryManager(new HistoryManagerMock());
  request.name("test");
});

test("Name with parameters", async (t) => {
  class HistoryManagerMock {
    pushName(name, parameters) {
      t.is(name, "test");
      t.is(parameters.test, 1);
    }
  }

  const request = new Request();
  request.setHistoryManager(new HistoryManagerMock());
  request.name("test", { test: 1 });
});

test("Request is active", async (t) => {
  class HistoryManagerMock {
    getLocation() {
      return {
        pathname: "/Test"
      };
    }
  }

  const request = new Request();
  request.setHistoryManager(new HistoryManagerMock());
  t.true(request.isActive("/Test"));
  t.false(request.isActive("/"));
});

test("Request path normalized", async (t) => {
  const request = new Request();
  t.is(request.normarizeTo("#/Test"), "/Test");
  t.is(request.normarizeTo("/Test"), "/Test");
  t.is(request.normarizeTo("/Test/1"), "/Test/1");
});
