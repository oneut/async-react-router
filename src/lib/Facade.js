import HistoryManager from "./HistoryManager";
import Request from "./Request";
import RouteMatcher from "./RouteMatcher";
import URL from "./URL";
import { createLink } from "./Link";

const routeMatcher = new RouteMatcher();
const historyManager = new HistoryManager();
historyManager.initialRouteMatcher(routeMatcher);

const request = new Request();
request.setHistoryManager(historyManager);

const url = new URL();
url.setHistoryManager(historyManager);

const link = createLink(request);

export {
  link as Link,
  request as Request,
  url as URL,
  routeMatcher,
  historyManager
};
