import Test from "ava";
import browserEnv from 'browser-env';

browserEnv();

Test.serial('Get object', (t) => {
    const asyncReactRouter = require("../../src/lib");

    t.true(!!asyncReactRouter.createBrowserHistory());
    t.true(!!asyncReactRouter.createHashHistory());
    t.true(!!asyncReactRouter.createMemoryHistory());
    t.true(!!asyncReactRouter.Link);
    t.true(!!asyncReactRouter.Request);
    t.true(!!asyncReactRouter.Route);
    t.true(!!asyncReactRouter.Router);
    t.true(!!asyncReactRouter.URL);
});
