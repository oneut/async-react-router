import ServerRouter from "./ServerRouter";
import Router from "./Router";
import { connector } from "../lib/Facade";
import { createBrowserHistory, createMemoryHistory } from "history";

function createRouter() {
  // Settings HistoryManager.
  return new Router(connector.newInitializedInstance(createBrowserHistory()));
}

function createServerRouter() {
  // Must define history. Because history is used in Request, URL, etc..
  connector.initHistory(createMemoryHistory());
  connector.initRouteMatcher();
  return new ServerRouter(connector.routeMatcher);
}

export { createRouter, createServerRouter };
