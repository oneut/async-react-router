import test from "ava";
const lib = require("../../src/lib");

test("Get object", (t) => {
  t.true(!!lib.createRouter);
  t.true(!!lib.createBrowserHistory());
  t.true(!!lib.createHashHistory());
  t.true(!!lib.createMemoryHistory());
  t.true(!!lib.Link);
  t.true(!!lib.Request);
  t.true(!!lib.URL);
});

test("Create router", (t) => {
  const router = lib.createRouter();
  t.true(!!router.route);
  t.true(!!router.asyncRoute);
  t.true(!!router.run);
});
