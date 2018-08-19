import test from "ava";
import Route from "../../src/lib/Route";

test("is function", (t) => {
  t.true(typeof Route === "function");
});

test("return undefined", (t) => {
  t.true(typeof Route() === "undefined");
});
