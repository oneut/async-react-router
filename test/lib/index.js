import test from "ava";
const asyncReactRouter = require("../../src/lib");

test("Get object", (t) => {
  t.true(!!asyncReactRouter.createRouter);
  t.true(!!asyncReactRouter.createBrowserHistory());
  t.true(!!asyncReactRouter.createHashHistory());
  t.true(!!asyncReactRouter.createMemoryHistory());
  t.true(!!asyncReactRouter.Link);
  t.true(!!asyncReactRouter.Request);
  t.true(!!asyncReactRouter.URL);
});

test("Create router", (t) => {
  const router = asyncReactRouter.createRouter();
  t.true(!!router.route);
  t.true(!!router.asyncRoute);
  t.true(!!router.run);
});
