import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";
import { Link, Request, URL, routeMatcher, historyManager } from "./Facade";
import Route from "./Route";
import { createRouter } from "./Router";

const router = createRouter(historyManager, routeMatcher);

export {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  Link,
  Request,
  Route,
  router as Router,
  URL
};
