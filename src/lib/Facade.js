import HistoryManager from "./HistoryManager";
import Request from "./Request";
import RouteMatcher from "./RouteMatcher";
import URL from "./URL";
import { createLink } from "./Link";
import Connector from "./Connector";

const routeMatcher = new RouteMatcher();
const historyManager = new HistoryManager();
const connector = new Connector(historyManager, routeMatcher);

const request = new Request(connector);

const url = new URL(connector);

const link = createLink(request);

export { link as Link, request as Request, url as URL, connector };
