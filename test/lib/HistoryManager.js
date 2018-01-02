import Test from "ava";
import HistoryManager from "../../src/lib/HistoryManager";
import createMemoryHistory from "history/createMemoryHistory";

Test.serial('push path', async (t) => {
    const historyCallBack = (pathname) => {
        t.is(pathname, '/test');
    };

    HistoryManager.init();
    HistoryManager.initialHistory(createMemoryHistory());
    HistoryManager.setRequestCallback(historyCallBack);
    HistoryManager.listen();
    await HistoryManager.push('/test');

    const location = HistoryManager.getLocation();
    t.is(location.pathname, '/test');
});

Test.serial('push path by name', async (t) => {
    class RouteMatcherMock {
        compileByName(name, parameters = {}) {
            return '/test/1';
        }
    }

    const historyCallBack = (pathname) => {
        t.is(pathname, '/test/1');
    };

    HistoryManager.init();
    HistoryManager.initialHistory(createMemoryHistory());
    HistoryManager.initialRouteMatcher(new RouteMatcherMock());
    HistoryManager.setRequestCallback(historyCallBack);
    HistoryManager.listen();
    await HistoryManager.pushByName('Test', {test: 1});

    const location = HistoryManager.getLocation();
    t.is(location.pathname, '/test/1');
});

Test.serial('create path', (t) => {
    HistoryManager.initialHistory(createMemoryHistory());
    t.is(HistoryManager.createHref('/create_href'), '/create_href');
});

Test.serial('listen silent', async (t) => {
    const historyCallBack = (pathname) => {
        t.fail();
    };

    const location = {
        pathname: '/test'
    };
    HistoryManager.init();
    HistoryManager.setRequestCallback(historyCallBack);
    HistoryManager.changeSilent();
    HistoryManager.listenCallback(location);
    t.pass();
});

Test.serial('listen unsilent', async (t) => {
    const historyCallBack = (pathname) => {
        t.is(pathname, '/unsilent');
    };

    const location = {
        pathname: '/unsilent'
    };
    HistoryManager.init();
    HistoryManager.setRequestCallback(historyCallBack);
    HistoryManager.changeSilent();
    HistoryManager.changeUnsilent();
    HistoryManager.listenCallback(location);
});

Test.serial('create path by name', (t) => {
    class RouteMatcherMock {
        compileByName(name, parameters = {}) {
            t.is(name, 'create_href_by_name');
            t.is(parameters.test, 1);
            return '/create_href_by_name/1';
        }
    }

    HistoryManager.init();
    HistoryManager.initialHistory(createMemoryHistory());
    HistoryManager.initialRouteMatcher(new RouteMatcherMock());
    t.is(HistoryManager.createHrefByName('create_href_by_name', {test: 1}), '/create_href_by_name/1');
});
