import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";
import { Link, Request, URL, connector } from "./Facade";
import Router from "./Router";

function createRouter(history = createHashHistory()) {
  return new Router(connector.newInitializedInstance(history));
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
