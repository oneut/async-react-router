import test from "ava";
import React from "react";
import { mount } from "enzyme";
import HistoryManager from "../../src/lib/HistoryManager";
import createMemoryHistory from "history/createMemoryHistory";
import { createLink } from "../../src/lib/Link";
import RouteMatcher from "../../src/lib/RouteMatcher";
import Request from "../../src/lib/Request";
import Connector from "../../src/lib/Connector";

test("Link", (t) => {
  const historyManager = new HistoryManager();
  const historyCallBack = (pathname) => {
    t.is(pathname, "/hello");
  };
  historyManager.setHistory(createMemoryHistory());
  historyManager.setRequestCallback(historyCallBack);
  historyManager.listen();

  const routeMatcher = new RouteMatcher();

  const connector = new Connector(historyManager, routeMatcher);

  const request = new Request(connector);

  const Link = createLink(request);
  const actual = mount(<Link to="/hello">hello, world</Link>);
  t.is(actual.html(), '<a href="/hello">hello, world</a>');

  actual.find("a").simulate("click");
  t.plan(2);
});
