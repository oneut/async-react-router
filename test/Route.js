import test from 'ava';
import Route from "../src/Route";

test('Test is nothing', (t) => {
   t.true(typeof Route === "function");
   t.true(typeof Route() === "undefined");
});
