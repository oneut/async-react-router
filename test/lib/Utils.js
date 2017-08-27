import test from "ava";
import * as Utils from "../../src/lib/Utils";

test('Clean path', async (t) => {
    t.is('/Test', Utils.cleanPath('/Test'));
    t.is('/Test/1', Utils.cleanPath('/Test/1'));
    t.is('/Test/path', Utils.cleanPath('/Test//path'));
    t.is('/Test/1/path', Utils.cleanPath('/Test//1//path'));
});

test('Normalize pathname', async (t) => {
    t.is('/Test', Utils.normalizePathname('/Test?a=1'));
    t.is('/Test', Utils.normalizePathname('/Test#a'));
    t.is('/Test/path', Utils.normalizePathname('/Test/path?a=1'));
    t.is('/Test/path', Utils.normalizePathname('/Test/path#a'));
    t.is('/Test/1/path', Utils.normalizePathname('/Test/1/path?a=1#a'));
});

test('Create route', async (t) => {
    t.is('/', Utils.createRoute('/'));
    t.is('/', Utils.createRoute('/', '/Test'));
    t.is('/Test', Utils.createRoute('/Test'));
    t.is('/Test', Utils.createRoute('/Test', '/'));
    t.is('/parent//child', Utils.createRoute('/child', '/parent'));
    t.is('/parent/child', Utils.createRoute('child', '/parent'));
});
