import test from "ava";
import URL from "../src/URL";

test('to', async (t) => {
    class HistoryManagerMock {
        createHref(pathname) {
            t.is(pathname, '/test');
            return pathname;
        }
    }

    URL.setHistoryManager(new HistoryManagerMock());
    t.is(URL.to('/test'), '/test');
});

test('name', async (t) => {
    class HistoryManagerMock {
        createHrefByName(name, parameter) {
            t.is(name, 'test');
            t.is(parameter.test, 1);
            return '/test/1';
        }
    }

    URL.setHistoryManager(new HistoryManagerMock());
    t.is(URL.name('test', {test: 1}), '/test/1');
    t.plan(3);
});

test('name without parameter', async (t) => {
    class HistoryManagerMock {
        createHrefByName(name, parameters) {
            t.is(name, 'test');
            t.true(Object.keys(parameters).length === 0 && typeof parameters === "object")
            return '/test';
        }
    }

    URL.setHistoryManager(new HistoryManagerMock());
    t.is(URL.name('test'), '/test');
    t.plan(3);
});