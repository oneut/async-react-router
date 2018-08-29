import ServerRouter from "./ServerRouter";
import Router from "./Router";
import { routeMatcher, historyManager } from "../lib/Facade";
import { createBrowserHistory, createMemoryHistory } from "history";

function createRouter() {
  // Settings HistoryManager.
  historyManager.initialHistory(createBrowserHistory());
  return new Router(historyManager, routeMatcher);
}

function createServerRouter() {
  // Must define history. Because history is used in Request, URL, etc..
  historyManager.initialHistory(createMemoryHistory());
  return new ServerRouter(routeMatcher);
}

export { createRouter, createServerRouter };
