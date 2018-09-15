import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from "history";
import { Link, Request, URL, connector } from "./Facade";
import Router from "./Router";
import * as SSR from "../ssr/index";

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
