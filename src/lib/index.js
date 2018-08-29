import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";
import { Link, Request, URL, routeMatcher, historyManager } from "./Facade";
import Router from "./Router";

function createRouter(history = createHashHistory()) {
  historyManager.initialHistory(history);
  return new Router(historyManager, routeMatcher);
}

export {
  createRouter,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  Link,
  Request,
  URL
};
