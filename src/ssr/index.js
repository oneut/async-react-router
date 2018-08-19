import RouteResolver from "./RouteResolver";
import { createRouter } from "./Router";
import { routeMatcher, historyManager } from "../lib/Facade";

const router = createRouter(historyManager, routeMatcher);

const routeResolver = new RouteResolver(historyManager, routeMatcher);

export { router as Router, routeResolver as RouteResolver };
