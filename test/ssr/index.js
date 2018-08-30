import test from "ava";
const ssr = require("../../src/ssr");

test("Get object", (t) => {
  t.true(!!ssr.createRouter);
  t.true(!!ssr.createServerRouter());
});

test("Create router", (t) => {
  const router = ssr.createRouter();
  t.true(!!router.route);
  t.true(!!router.asyncRoute);
  t.true(!!router.setInitialProps);
  t.true(!!router.run);
});

test("Create server router", (t) => {
  const router = ssr.createServerRouter();
  t.true(!!router.route);
  t.true(!!router.asyncRoute);
  t.true(!!router.runUsingPathname);
});
