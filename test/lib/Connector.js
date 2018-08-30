import React from "react";
import test from "ava";
import createMemoryHistory from "history/createMemoryHistory";
import Connector from "../../src/lib/Connector";
import RouteMatcher from "../../src/lib/RouteMatcher";
import HistoryManager from "../../src/lib/HistoryManager";

class IndexPage extends React.Component {
  render() {
    return <div>Hello, world</div>;
  }
}

test.beforeEach((t) => {
  t.context.routeMatcher = new RouteMatcher();
  t.context.historyManager = new HistoryManager();
});

test.serial("Unregistered subscribe", (t) => {
  // Create Connector object
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );

  // Create initialized connector
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  t.notThrows(() => {
    initializedConnector.onStateChange();
  });
});

test.cb("Subscribe", (t) => {
  // Create Connector object
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );

  // Create initialized connector
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );

  initializedConnector.subscribe(() => {
    t.pass();
    t.end();
  });

  initializedConnector.onStateChange();
});

test.cb("Request", (t) => {
  // Create Connector object
  const connector = new Connector(
    t.context.historyManager,
    t.context.routeMatcher
  );

  // Create initialized connector
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );

  // Add route after initializing Route Matcher
  t.context.routeMatcher.addRoute("/", IndexPage);

  initializedConnector.subscribe(() => {
    t.pass();
    t.end();
  });
  initializedConnector.request("/");
});
