import test from 'ava';
import React from "react";
import { mount } from "enzyme";
import HistoryManager from "../../src/lib/HistoryManager";
import createMemoryHistory from "history/createMemoryHistory";
import Link from "../../src/lib/Link";

test('Link', (t) => {
    const historyCallBack = (pathname) => {
        t.is(pathname, '/hello');
    };

    HistoryManager.init();
    HistoryManager.initialHistory(createMemoryHistory());
    HistoryManager.setRequestCallback(historyCallBack);
    HistoryManager.listen();

    const actual = mount(<Link to="/hello">hello, world</Link>);
    t.is(actual.html(), '<a href="/hello">hello, world</a>');

    actual.find('a').simulate('click');
    t.plan(2);
});
