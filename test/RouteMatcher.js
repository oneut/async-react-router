import test from 'ava';
import RouteMatcher from '../src/RouteMatcher';

test('RouterMatcher success', (t) => {
    const routeMatcher = RouteMatcher.make('/path', '/path');
    t.true(routeMatcher.success());
});

test('RouterMatcher fails', (t) => {
    const routeMatcher = RouteMatcher.make('/path', '/path/test');
    t.true(routeMatcher.fails());
});

test('RouterMatcher success with parameter', (t) => {
    const routeMatcher = RouteMatcher.make('/path/:pathId', '/path/1');
    t.true(routeMatcher.success());

    const params = routeMatcher.getParams();
    t.is(Number(params.pathId), 1);
});

test('RouterMatcher fails with parameter', (t) => {
    const routeMatcher = RouteMatcher.make('/path/:pathId', '/test/1');
    t.true(routeMatcher.fails());
})

test('RouterMatcher success with multiple parameter', (t) => {
    const routeMatcher = RouteMatcher.make('/path/:pathId/file/:fileName', '/path/1/file/file_name.txt');
    t.true(routeMatcher.success());

    const params = routeMatcher.getParams();
    t.is(Number(params.pathId), 1);
    t.is(params.fileName, 'file_name.txt');
});

test('RouterMatcher fails with multiple parameter', (t) => {
    const routeMatcher = RouteMatcher.make('/path/:pathId/file/:fileName', '/test/1/abc/file_name.txt');
    t.true(routeMatcher.fails());
});