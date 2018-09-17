import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from "history";
import { Link, Request, URL, connector } from "./lib/Facade";
import Router from "./lib/Router";
import * as SSR from "./ssr";

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
  URL,
  SSR
};
