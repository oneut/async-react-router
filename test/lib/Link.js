import test from "ava";
import React from "react";
import { mount } from "enzyme";
import HistoryManager from "../../src/lib/HistoryManager";
import createMemoryHistory from "history/createMemoryHistory";
import { createLink } from "../../src/lib/Link";
import RouteMatcher from "../../src/lib/RouteMatcher";
import Request from "../../src/lib/Request";

test("Link", (t) => {
  const routeMatcher = new RouteMatcher();

  const historyCallBack = (pathname) => {
    t.is(pathname, "/hello");
  };

  const historyManager = new HistoryManager();
  historyManager.initialRouteMatcher(routeMatcher);
  historyManager.initialHistory(createMemoryHistory());
  historyManager.setRequestCallback(historyCallBack);
  historyManager.listen();

  const request = new Request();
  request.setHistoryManager(historyManager);

  const Link = createLink(request);

  const actual = mount(<Link to="/hello">hello, world</Link>);
  t.is(actual.html(), '<a href="/hello">hello, world</a>');

  actual.find("a").simulate("click");
  t.plan(2);
});
