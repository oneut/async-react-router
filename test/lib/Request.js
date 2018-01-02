import test from "ava";
import Request from "../../src/lib/Request";

test('To', async (t) => {
    class HistoryManagerMock {
        push(pathname) {
            t.is(pathname, '/Test');
        }
    }

    Request.setHistoryManager(new HistoryManagerMock());
    Request.to('/Test');
});

test('Name', async (t) => {
    class HistoryManagerMock {
        pushName(name, parameters) {
            t.is(name, 'test');
            t.true(Object.keys(parameters).length === 0 && typeof parameters === "object");
        }
    }

    Request.setHistoryManager(new HistoryManagerMock());
    Request.name('test');
});

test('Name with parameters', async (t) => {
    class HistoryManagerMock {
        pushName(name, parameters) {
            t.is(name, 'test');
            t.is(parameters.test, 1);
        }
    }

    Request.setHistoryManager(new HistoryManagerMock());
    Request.name('test', {test: 1});
});

test('Request is active', async (t) => {
    class HistoryManagerMock {
        getLocation() {
            return {
                pathname: '/Test'
            };
        }
    }

    Request.setHistoryManager(new HistoryManagerMock());
    t.true(Request.isActive('/Test'));
    t.false(Request.isActive('/'));
});

test('Request path normalized', async (t) => {
    t.is(Request.normarizeTo('#/Test'), '/Test');
    t.is(Request.normarizeTo('/Test'), '/Test');
    t.is(Request.normarizeTo('/Test/1'), '/Test/1');
});
